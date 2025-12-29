export type TabType = 'home' | 'generator' | 'validator' | 'consumer' | 'wallet' | 'signin' | 'login';

export type UserRole = 'generator' | 'validator' | 'consumer';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  inrValue: number;
  icon: string;
}

export interface Transaction {
  id: string;
  type: 'received' | 'sent' | 'buy' | 'swap';
  token: string;
  amount: number;
  inrValue: number;
  date: string;
  fromAddress?: string;
  toAddress?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface WalletState {
  address: string | null;
  balance: number;
  assets: Asset[];
  transactions: Transaction[];
  isConnected: boolean;
  showBalance: boolean;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Project {
  id: string;
  name: string;
  hectares: number;
  location: Location;
  photos: File[] | string[];
  video: File | string | null;
  date: string;
  status: 'submitted' | 'under-review' | 'verified' | 'rejected';
  co2Tons?: number;
}

export interface Purchase {
  id: string;
  credits: number;
  pricePerCredit: number;
  inrAmount: number;
  date: string;
  walletHash: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  description?: string;
}
