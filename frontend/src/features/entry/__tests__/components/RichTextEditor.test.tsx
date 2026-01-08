import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RichTextEditor } from '../../components/editors/RichTextEditor';

describe('RichTextEditor', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with placeholder', () => {
    render(
      <RichTextEditor
        placeholder="Enter text here..."
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Enter text here...')).toBeInTheDocument();
  });

  it('renders with default placeholder when none provided', () => {
    render(<RichTextEditor onChange={mockOnChange} />);

    expect(screen.getByText('Enter text...')).toBeInTheDocument();
  });

  it('renders contenteditable element', () => {
    render(<RichTextEditor onChange={mockOnChange} />);

    const editor = document.querySelector('[contenteditable="true"]');
    expect(editor).toBeInTheDocument();
  });

  it('calls onChange when content changes', async () => {
    const user = userEvent.setup();
    render(<RichTextEditor onChange={mockOnChange} />);

    const editor = document.querySelector('[contenteditable="true"]');
    expect(editor).toBeInTheDocument();

    if (editor) {
      await user.click(editor);
      await user.type(editor, 'Hello');

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalled();
      });

      // Verify the onChange was called with a JSON string
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(() => JSON.parse(lastCall)).not.toThrow();
    }
  });

  it('applies correct styling classes', () => {
    render(<RichTextEditor onChange={mockOnChange} />);

    const container = document.querySelector('.border.rounded-md');
    expect(container).toBeInTheDocument();
  });
});
