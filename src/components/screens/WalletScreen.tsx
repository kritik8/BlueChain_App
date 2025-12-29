import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Eye, EyeOff, Copy, Key, ArrowDownRight, ArrowUpRight, RefreshCw, Check, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const WalletScreen: React.FC = () => {
  const { setActiveTab, wallet, toggleBalanceVisibility, generateKeyPair, showToast } = useApp();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalBalance = wallet.assets.reduce((sum, asset) => sum + asset.inrValue, 0);

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      showToast('success', 'Address Copied', 'Wallet address copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateKeyPair = () => {
    setShowKeyModal(true);
  };

  const confirmKeyGeneration = () => {
    generateKeyPair();
    setShowKeyModal(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'received':
      case 'buy':
        return <ArrowDownRight className="w-4 h-4 text-success" />;
      case 'sent':
        return <ArrowUpRight className="w-4 h-4 text-destructive" />;
      case 'swap':
        return <RefreshCw className="w-4 h-4 text-info" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="gradient-header pt-14 pb-8 px-5 relative">
        <button 
          onClick={() => setActiveTab('home')}
          className="absolute top-14 left-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Wallet</h1>
          <p className="text-white/80 text-sm mt-1">Manage Your Digital Assets</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 -mt-4 scrollbar-hide">
        {/* Total Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6 mb-5 gradient-primary text-white relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-xs font-medium uppercase tracking-wide">Total Balance</span>
              <button onClick={toggleBalanceVisibility} className="text-white/70 hover:text-white transition-colors p-1">
                {wallet.showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-4xl font-bold tracking-tight">
              {wallet.showBalance ? `₹${totalBalance.toLocaleString('en-IN')}` : '₹••••••••'}
            </p>
            <p className="text-white/60 text-xs mt-2">Available for transactions</p>
          </div>
        </motion.div>

        {/* Wallet Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-elevated p-4 mb-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
              <p className="font-mono text-foreground text-sm">
                {wallet.address || 'Not Connected'}
              </p>
            </div>
            <button
              onClick={copyAddress}
              disabled={!wallet.address}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                copied ? 'bg-success-light text-success' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Generate Key Pair */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5"
        >
          <button
            onClick={handleGenerateKeyPair}
            className="w-full py-4 rounded-xl font-semibold text-success-foreground bg-success shadow-lg shadow-success/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Key className="w-5 h-5" />
            <span>Generate New Key Pair</span>
          </button>
        </motion.div>

        {/* Assets List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-5"
        >
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">🪙</span>
            Assets
          </h2>

          <div className="space-y-3">
            {wallet.assets.map((asset) => (
              <div key={asset.id} className="card-elevated p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                    {asset.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {wallet.showBalance ? asset.balance.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '••••'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {wallet.showBalance ? `₹${asset.inrValue.toLocaleString('en-IN')}` : '₹••••'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">🔁</span>
            Recent Transactions
          </h2>

          <div className="space-y-3">
            {wallet.transactions.map((tx) => (
              <div key={tx.id} className="card-elevated p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'received' || tx.type === 'buy' 
                      ? 'bg-success-light' 
                      : tx.type === 'sent' 
                      ? 'bg-destructive/10' 
                      : 'bg-info-light'
                  }`}>
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm capitalize">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">{tx.token}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${
                      tx.amount >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {tx.amount >= 0 ? '+' : ''}{tx.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">₹{tx.inrValue.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">{tx.date}</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {tx.fromAddress || tx.toAddress || '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Key Generation Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/50 flex items-center justify-center p-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-lg">New Key Pair Generated</h3>
                <button onClick={() => setShowKeyModal(false)} className="text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-warning-light rounded-xl p-4 mb-6">
                <p className="text-warning-foreground text-sm">
                  ⚠️ Please backup your private key securely. This cannot be recovered if lost.
                </p>
              </div>

              <button
                onClick={confirmKeyGeneration}
                className="btn-primary"
              >
                OK, I've Backed Up
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletScreen;
