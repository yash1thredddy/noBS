// Single author row component
import { ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { TableCell, TableRow } from '../../../../components/ui/table';
import type { Author } from '../../types';

interface AuthorRowProps {
  author: Author;
  index: number;
  totalAuthors: number;
  onEdit: (author: Author) => void;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export function AuthorRow({
  author,
  index,
  totalAuthors,
  onEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
}: AuthorRowProps) {
  const affiliationNames = author.affiliations.map((a) => a.name).join(', ');
  const isFirst = index === 0;
  const isLast = index === totalAuthors - 1;

  return (
    <TableRow>
      <TableCell className="font-medium">
        {author.firstName} {author.lastName}
        {author.isCurrentUser && (
          <span className="ml-2 text-xs text-muted-foreground">(you)</span>
        )}
      </TableCell>
      <TableCell>{affiliationNames || '-'}</TableCell>
      <TableCell>{author.orcid || '-'}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMoveUp(index)}
            disabled={isFirst}
            aria-label="Move author up"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMoveDown(index)}
            disabled={isLast}
            aria-label="Move author down"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(author)}
            aria-label="Edit author"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(author.id)}
            aria-label="Remove author"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
