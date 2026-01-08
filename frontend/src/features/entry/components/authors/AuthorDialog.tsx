// Dialog for adding/editing authors
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { Plus, X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import type { Author, Affiliation } from '../../types';

interface AuthorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author: Author | null;
  onSave: (author: Omit<Author, 'id' | 'order'> | { id: string } & Partial<Author>) => void;
}

export function AuthorDialog({ open, onOpenChange, author, onSave }: AuthorDialogProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [orcid, setOrcid] = useState('');
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [newAffiliation, setNewAffiliation] = useState('');

  const isEditing = author !== null;

  useEffect(() => {
    if (open) {
      if (author) {
        setFirstName(author.firstName);
        setLastName(author.lastName);
        setOrcid(author.orcid || '');
        setAffiliations([...author.affiliations]);
      } else {
        setFirstName('');
        setLastName('');
        setOrcid('');
        setAffiliations([]);
      }
      setNewAffiliation('');
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, author]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  const handleAddAffiliation = () => {
    if (newAffiliation.trim()) {
      setAffiliations([...affiliations, { id: uuidv4(), name: newAffiliation.trim() }]);
      setNewAffiliation('');
    }
  };

  const handleRemoveAffiliation = (id: string) => {
    setAffiliations(affiliations.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstName.trim() || !lastName.trim()) return;

    if (isEditing && author) {
      onSave({
        id: author.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        orcid: orcid.trim() || null,
        affiliations,
        isCurrentUser: author.isCurrentUser,
      });
    } else {
      onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        orcid: orcid.trim() || null,
        affiliations,
        isCurrentUser: false,
      });
    }
    onOpenChange(false);
  };

  if (!open) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        onClick={() => onOpenChange(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 99998,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '24px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 99999,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
            {isEditing ? 'Edit Author' : 'Add Author'}
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            {isEditing ? 'Update author information below.' : 'Enter the author details below.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Label htmlFor="author-firstName">First Name *</Label>
                <Input
                  id="author-firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  style={{ marginTop: '4px' }}
                />
              </div>
              <div>
                <Label htmlFor="author-lastName">Last Name *</Label>
                <Input
                  id="author-lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  style={{ marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="author-orcid">ORCID</Label>
              <Input
                id="author-orcid"
                value={orcid}
                onChange={(e) => setOrcid(e.target.value)}
                placeholder="0000-0000-0000-0000"
                style={{ marginTop: '4px' }}
              />
            </div>

            <div>
              <Label htmlFor="author-affiliation">Affiliations</Label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <Input
                  id="author-affiliation"
                  value={newAffiliation}
                  onChange={(e) => setNewAffiliation(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAffiliation(); } }}
                  placeholder="Add affiliation"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddAffiliation}
                  disabled={!newAffiliation.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {affiliations.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {affiliations.map((aff) => (
                    <div
                      key={aff.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    >
                      <span>{aff.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveAffiliation(aff.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!firstName.trim() || !lastName.trim()}>
              {isEditing ? 'Save Changes' : 'Add Author'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
