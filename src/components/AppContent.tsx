import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import HomeScreen from './screens/HomeScreen';
import GeneratorScreen from './screens/GeneratorScreen';
import ValidatorScreen from './screens/ValidatorScreen';
import ConsumerScreen from './screens/ConsumerScreen';
import WalletScreen from './screens/WalletScreen';
import SignInScreen from './screens/SignInScreen';
import LoginScreen from './screens/LoginScreen';
import BottomNavigation from './BottomNavigation';
import Toast from './Toast';

const screens = {
  home: HomeScreen,
  generator: GeneratorScreen,
  validator: ValidatorScreen,
  consumer: ConsumerScreen,
  wallet: WalletScreen,
  signin: SignInScreen,
  login: LoginScreen,
};

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const Screen = screens[activeTab];

  // Hide bottom navigation on signin/login screens
  const showBottomNav = activeTab !== 'signin' && activeTab !== 'login';

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Toast />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="h-full w-full"
        >
          <Screen />
        </motion.div>
      </AnimatePresence>

      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default AppContent;
