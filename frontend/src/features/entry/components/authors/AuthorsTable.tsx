// Table component for displaying and managing authors
import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { Plus } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';
import { useAuthors, type NewAuthor } from '../../hooks/useAuthors';
import type { Author } from '../../types';
import { AuthorRow } from './AuthorRow';
import { AuthorDialog } from './AuthorDialog';

export function AuthorsTable() {
  useSignals();
  const { authors, addAuthor, updateAuthor, removeAuthor, moveAuthorUp, moveAuthorDown } =
    useAuthors();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const handleAddClick = () => {
    setEditingAuthor(null);
    setDialogOpen(true);
  };

  const handleEditClick = (author: Author) => {
    setEditingAuthor(author);
    setDialogOpen(true);
  };

  const handleSave = (authorData: NewAuthor | ({ id: string } & Partial<Author>)) => {
    if ('id' in authorData) {
      const { id, ...updates } = authorData;
      updateAuthor(id, updates);
    } else {
      addAuthor(authorData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddClick} size="sm" type="button">
          <Plus className="mr-2 h-4 w-4" />
          Add Author
        </Button>
      </div>

      {authors.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          No authors added yet. Click "Add Author" to add one.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Affiliations</TableHead>
              <TableHead>ORCID</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors.map((author, index) => (
              <AuthorRow
                key={author.id}
                author={author}
                index={index}
                totalAuthors={authors.length}
                onEdit={handleEditClick}
                onRemove={removeAuthor}
                onMoveUp={moveAuthorUp}
                onMoveDown={moveAuthorDown}
              />
            ))}
          </TableBody>
        </Table>
      )}

      <AuthorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        author={editingAuthor}
        onSave={handleSave}
      />
    </div>
  );
}
