import React from 'react';
import { motion } from 'framer-motion';
import { Home, Leaf, Shield, ShoppingCart, Wallet } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { TabType } from '@/types';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home size={22} /> },
  { id: 'generator', label: 'Generator', icon: <Leaf size={22} /> },
  { id: 'validator', label: 'Validator', icon: <Shield size={22} /> },
  { id: 'consumer', label: 'Consumer', icon: <ShoppingCart size={22} /> },
  { id: 'wallet', label: 'Wallet', icon: <Wallet size={22} /> },
];

const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/50 px-2 pt-2 pb-7 z-40">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item relative ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {item.icon}
              </motion.div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;