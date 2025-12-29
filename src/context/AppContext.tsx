import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { TabType, WalletState, Project, Purchase, ToastMessage } from '@/types';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  wallet: WalletState;
  connectWallet: () => void;
  disconnectWallet: () => void;
  toggleBalanceVisibility: () => void;
  generateKeyPair: () => void;
  projects: Project[];
  addProject: (project: Project) => void;
  purchases: Purchase[];
  addPurchase: (purchase: Purchase) => void;
  updateWalletBalance: (amount: number) => void;
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], message: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const defaultWallet: WalletState = {
  address: null,
  balance: 125000,
  assets: [
    { id: '1', name: 'Blue Carbon Credits', symbol: 'BCC', balance: 450, inrValue: 67500, icon: '🌊' },
    { id: '2', name: 'USD Coin', symbol: 'USDC', balance: 1250.50, inrValue: 104167, icon: '💵' },
    { id: '3', name: 'Ethereum', symbol: 'ETH', balance: 0.85, inrValue: 212500, icon: '⟠' },
    { id: '4', name: 'Polygon', symbol: 'MATIC', balance: 500, inrValue: 45000, icon: '🟣' },
  ],
  transactions: [
    { id: '1', type: 'received', token: 'BCC', amount: 50, inrValue: 7500, date: '2024-01-15 14:32', fromAddress: '0x1234...5678', status: 'completed' },
    { id: '2', type: 'buy', token: 'BCC', amount: 100, inrValue: 15000, date: '2024-01-14 10:15', status: 'completed' },
    { id: '3', type: 'sent', token: 'USDC', amount: -200, inrValue: 16667, date: '2024-01-13 09:45', toAddress: '0xABCD...EFGH', status: 'completed' },
    { id: '4', type: 'swap', token: 'ETH → BCC', amount: 25, inrValue: 3750, date: '2024-01-12 16:20', status: 'completed' },
  ],
  isConnected: false,
  showBalance: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [wallet, setWallet] = useState<WalletState>(defaultWallet);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Sundarbans Mangrove Restoration',
      hectares: 150,
      location: { lat: 21.9497, lng: 88.9012, address: 'Sundarbans, West Bengal' },
      photos: [],
      video: null,
      date: '2024-01-10',
      status: 'verified',
      co2Tons: 2250,
    },
    {
      id: '2',
      name: 'Chilika Blue Carbon Initiative',
      hectares: 85,
      location: { lat: 19.7235, lng: 85.3194, address: 'Chilika Lake, Odisha' },
      photos: [],
      video: null,
      date: '2024-01-08',
      status: 'under-review',
    },
  ]);
  const [purchases, setPurchases] = useState<Purchase[]>([
    { id: '1', credits: 100, pricePerCredit: 150, inrAmount: 15000, date: '2024-01-15 14:32', walletHash: '0x1234...5678', status: 'completed' },
    { id: '2', credits: 50, pricePerCredit: 148, inrAmount: 7400, date: '2024-01-12 10:15', walletHash: '0xABCD...EFGH', status: 'completed' },
  ]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastMessage['type'], message: string, description?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const connectWallet = useCallback(() => {
    const randomAddress = `0x${Math.random().toString(16).slice(2, 6).toUpperCase()}...${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
    setWallet(prev => ({ ...prev, address: randomAddress, isConnected: true }));
    showToast('success', 'Wallet Connected', `Connected to ${randomAddress}`);
  }, [showToast]);

  const disconnectWallet = useCallback(() => {
    setWallet(prev => ({ ...prev, address: null, isConnected: false }));
    showToast('info', 'Wallet Disconnected');
  }, [showToast]);

  const toggleBalanceVisibility = useCallback(() => {
    setWallet(prev => ({ ...prev, showBalance: !prev.showBalance }));
  }, []);

  const generateKeyPair = useCallback(() => {
    // Simulate key generation
    showToast('success', 'New Key Pair Generated', 'Please backup your private key securely.');
  }, [showToast]);

  const addProject = useCallback((project: Project) => {
    setProjects(prev => [project, ...prev]);
  }, []);

  const addPurchase = useCallback((purchase: Purchase) => {
    setPurchases(prev => [purchase, ...prev]);
    // Update wallet assets
    setWallet(prev => ({
      ...prev,
      assets: prev.assets.map(asset => 
        asset.symbol === 'BCC' 
          ? { ...asset, balance: asset.balance + purchase.credits, inrValue: asset.inrValue + purchase.inrAmount }
          : asset
      ),
    }));
  }, []);

  const updateWalletBalance = useCallback((amount: number) => {
    setWallet(prev => ({ ...prev, balance: prev.balance + amount }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        wallet,
        connectWallet,
        disconnectWallet,
        toggleBalanceVisibility,
        generateKeyPair,
        projects,
        addProject,
        purchases,
        addPurchase,
        updateWalletBalance,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
