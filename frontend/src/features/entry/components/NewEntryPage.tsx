import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { motion } from 'motion/react';
import { ArrowLeft, User, LogOut } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { initializeForm, resetForm, entryId } from '../stores/entryFormStore';
import { clearDraft } from '../stores/draftStore';
import { user, logout } from '../../../stores/authStore';
import { useUnsavedChangesWarning } from '../hooks/useUnsavedChangesWarning';
import { MetadataSection } from './sections/MetadataSection';
import { AuthorsSection } from './sections/AuthorsSection';
import { MoleculeSection } from './sections/MoleculeSection';
import { NmrSection } from './sections/NmrSection';
import { MassSpecSection } from './sections/MassSpecSection';
import { SubmitSection } from './sections/SubmitSection';
import companyLogo from 'figma:asset/3719964460fd60c11f6876da44f351cf07902b42.png';

export function NewEntryPage() {
  useSignals(); // Enable signal reactivity for this component
  const navigate = useNavigate();
  const currentUser = user.value;

  // Enable unsaved changes warning
  useUnsavedChangesWarning();

  useEffect(() => {
    // Always start fresh with a new entry - clear any old drafts
    clearDraft();
    initializeForm();

    // Cleanup on unmount
    return () => {
      resetForm();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
      const token = localStorage.getItem('nobs_access_token');

      if (token) {
        await fetch(`${apiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(() => {});
      }

      logout();
      navigate('/login');
    } catch (error) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="hover:bg-green-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <img
              src={companyLogo}
              alt="noBS Consortium"
              className="h-10 w-auto"
            />
          </div>
          <div className="flex items-center gap-6">
            {currentUser && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="w-4 h-4" />
                <span>{currentUser.name}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-xl p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-semibold mb-3 text-slate-900">New Compound Entry</h1>
            <p className="text-lg text-slate-600">
              Create a new natural product entry with spectroscopic data
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Entry ID: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{entryId.value || 'Generating...'}</span>
            </p>
          </motion.div>

          {/* Form Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-8"
          >
            <MetadataSection />
            <AuthorsSection />
            <MoleculeSection />
            <NmrSection />
            <MassSpecSection />
            <SubmitSection />
          </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6 bg-white/50 border-t border-green-100 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          <p>© 2024 noBS Consortium • Terms of Service • Privacy Policy</p>
        </div>
      </footer>
    </div>
  );
}
