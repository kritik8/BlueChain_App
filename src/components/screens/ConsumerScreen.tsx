import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Eye, EyeOff, TrendingUp, TrendingDown, ShoppingCart, Check, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const ConsumerScreen: React.FC = () => {
  const { setActiveTab, wallet, toggleBalanceVisibility, purchases, addPurchase, showToast } = useApp();
  const [creditAmount, setCreditAmount] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);

  const bccAsset = wallet.assets.find(a => a.symbol === 'BCC');
  const pricePerCredit = 150;
  const priceChange = 2.5;
  const volume24h = '₹12.5L';

  const handleBuyCredits = () => {
    const amount = parseInt(creditAmount);
    if (!amount || amount <= 0) {
      showToast('error', 'Invalid Amount', 'Please enter a valid credit amount.');
      return;
    }

    setIsPurchasing(true);
    setTimeout(() => {
      const newPurchase = {
        id: Date.now().toString(),
        credits: amount,
        pricePerCredit,
        inrAmount: amount * pricePerCredit,
        date: new Date().toLocaleString('en-IN'),
        walletHash: wallet.address || '0x0000...0000',
        status: 'completed' as const,
      };

      addPurchase(newPurchase);
      showToast('success', 'Carbon Credits Purchased Successfully', `${amount} BCC credits added to your wallet.`);
      setCreditAmount('');
      setIsPurchasing(false);
    }, 1500);
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
          <h1 className="text-xl font-bold text-white">Consumer Dashboard</h1>
          <p className="text-white/80 text-sm mt-1">Buy & Track Carbon Credits</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 -mt-4 scrollbar-hide">
        {/* Holdings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-5 mb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">💼</span>
              Your Holdings
            </h2>
            <button onClick={toggleBalanceVisibility} className="text-muted-foreground">
              {wallet.showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">
              {wallet.showBalance ? `${bccAsset?.balance || 0} BCC` : '••••••'}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              {wallet.showBalance ? `₹${bccAsset?.inrValue?.toLocaleString('en-IN') || 0}` : '₹••••••'}
            </p>
          </div>
        </motion.div>

        {/* Market Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-5 mb-5"
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">📈</span>
            Market Price
          </h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">₹{pricePerCredit}</p>
              <p className="text-xs text-muted-foreground">per credit</p>
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-semibold">{priceChange >= 0 ? '+' : ''}{priceChange}%</span>
              </div>
              <p className="text-xs text-muted-foreground">24h volume: {volume24h}</p>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 text-right">
            Last updated: {new Date().toLocaleTimeString('en-IN')}
          </p>
        </motion.div>

        {/* Buy Credits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-elevated p-5 mb-5"
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">🛒</span>
            Buy Credits
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Credit Amount
              </label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="Enter amount"
                className="input-field"
              />
              {creditAmount && (
                <p className="text-xs text-muted-foreground mt-2">
                  Total: ₹{(parseInt(creditAmount) * pricePerCredit).toLocaleString('en-IN') || 0}
                </p>
              )}
            </div>
            
            <button
              onClick={handleBuyCredits}
              disabled={isPurchasing || !creditAmount}
              className={`btn-primary flex items-center justify-center gap-2 ${
                isPurchasing || !creditAmount ? 'opacity-60' : ''
              }`}
            >
              <ShoppingCart className={`w-5 h-5 ${isPurchasing ? 'animate-bounce' : ''}`} />
              <span>{isPurchasing ? 'Processing...' : 'Buy Credits'}</span>
            </button>
          </div>
        </motion.div>

        {/* Purchase History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">🧾</span>
            Purchase History
          </h2>

          <div className="space-y-3">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="card-elevated p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success-light flex items-center justify-center">
                      <ArrowDownRight className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">+{purchase.credits} BCC</p>
                      <p className="text-xs text-muted-foreground">
                        ₹{purchase.pricePerCredit}/credit
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground text-sm">
                      ₹{purchase.inrAmount.toLocaleString('en-IN')}
                    </p>
                    <div className={`flex items-center justify-end gap-1 text-xs ${
                      purchase.status === 'completed' ? 'text-success' : 'text-warning'
                    }`}>
                      {purchase.status === 'completed' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span className="capitalize">{purchase.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{purchase.date}</span>
                  <span className="font-mono">{purchase.walletHash}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConsumerScreen;
