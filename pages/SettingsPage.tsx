
import React from 'react';
import Card, { CardContent } from '../components/ui/Card';
import { SettingsIcon } from '../components/icons/LucideIcons';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold font-serif mb-6">Settings</h1>
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center py-20">
            <SettingsIcon className="w-16 h-16 text-muted-foreground mb-4 animate-spin-slow" />
            <h2 className="text-2xl font-bold">Coming Soon!</h2>
            <p className="text-muted-foreground max-w-md mt-2">
              Application settings, profile management, and API key configurations will be available here in a future update.
            </p>
          </div>
        </CardContent>
      </Card>
      <style>{`
        .animate-spin-slow {
          animation: spin 5s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
