import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Shield, ShoppingCart, Wallet, Waves, LogIn, UserPlus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { TabType } from '@/types';

interface RoleCard {
  id: TabType;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const roleCards: RoleCard[] = [
  {
    id: 'generator',
    title: 'Generator',
    description: 'NGOs & Communities submitting blue carbon projects',
    icon: <Leaf className="w-7 h-7" />,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'validator',
    title: 'Validator',
    description: 'Auditors & Verifiers reviewing project data',
    icon: <Shield className="w-7 h-7" />,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'consumer',
    title: 'Consumer',
    description: 'Carbon credit buyers & offset seekers',
    icon: <ShoppingCart className="w-7 h-7" />,
    gradient: 'from-violet-500 to-purple-600',
  },
];

const HomeScreen: React.FC = () => {
  const { setActiveTab, wallet, connectWallet } = useApp();

  const handleWalletClick = () => {
    if (wallet.isConnected) {
      setActiveTab('wallet');
    } else {
      connectWallet();
      setActiveTab('wallet');
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with gradient */}
      <div className="gradient-header pt-14 pb-16 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        {/* Logo and title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md mb-5 shadow-lg shadow-primary/20"
          >
            <Waves className="w-11 h-11 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">BlueChain MRV</h1>
          <p className="text-white/80 text-sm max-w-[240px] mx-auto leading-relaxed">
            Verify Carbon Credits with Trust & Transparency
          </p>
        </motion.div>
      </div>

      {/* Role selection cards */}
      <div className="flex-1 px-5 -mt-8 overflow-y-auto pb-44 scrollbar-hide">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-muted-foreground text-center mb-4 font-medium"
        >
          Select your role to get started
        </motion.p>
        
        <div className="space-y-3">
          {roleCards.map((card, index) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              onClick={() => setActiveTab(card.id)}
              className="w-full card-elevated p-4 flex items-center gap-4 active:scale-[0.98] transition-all text-left group hover:shadow-lg"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                {card.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{card.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{card.description}</p>
              </div>
              <div className="text-muted-foreground group-hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="absolute bottom-20 left-0 right-0 px-5 pb-4 bg-gradient-to-t from-background via-background to-transparent pt-10">
        {/* Sign In & Login Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex gap-3 mb-3"
        >
          <button
            onClick={() => setActiveTab('signin')}
            className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform"
          >
            <UserPlus className="w-4 h-4" />
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className="flex-1 py-3 px-4 rounded-xl bg-card border border-border text-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        </motion.div>

        {/* Connect Wallet Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          onClick={handleWalletClick}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Wallet className="w-4 h-4" />
          <span>{wallet.isConnected ? 'View Wallet' : 'Connect Wallet'}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default HomeScreen;
