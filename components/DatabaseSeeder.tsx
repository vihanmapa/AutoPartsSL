
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';
import { Database, Loader2 } from 'lucide-react';

export const DatabaseSeeder: React.FC = () => {
  const { seedDatabase, isLoading } = useApp();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    if (!confirm('This will upload mock data to your Firebase Firestore. This may overwrite existing data. Continue?')) return;
    
    setIsSeeding(true);
    try {
        await seedDatabase();
    } catch(e) {
        // Error handling handled by context
    } finally {
        setIsSeeding(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={handleSeed} 
        variant="secondary" 
        className="shadow-2xl border-2 border-white"
        disabled={isSeeding || isLoading}
      >
        {isSeeding ? (
            <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading Mock Data...
            </>
        ) : (
            <>
                <Database className="h-4 w-4" /> Seed Firebase DB
            </>
        )}
      </Button>
    </div>
  );
};
