
import React from 'react';
import Card, { CardContent } from '../components/ui/Card';
import { HistoryIcon } from '../components/icons/LucideIcons';

const HistoryPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold font-serif mb-6">Your History</h1>
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center py-20">
            <HistoryIcon className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold">Coming Soon!</h2>
            <p className="text-muted-foreground max-w-md mt-2">
              We're working on a feature to save and manage all your creations. Your project history will appear here soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
