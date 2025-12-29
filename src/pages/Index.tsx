import React from 'react';
import { AppProvider } from '@/context/AppContext';
import PhoneFrame from '@/components/PhoneFrame';
import AppContent from '@/components/AppContent';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <PhoneFrame>
        <AppContent />
      </PhoneFrame>
    </AppProvider>
  );
};

export default Index;
