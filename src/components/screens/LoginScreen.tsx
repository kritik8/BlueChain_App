import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Leaf, Shield, ShoppingCart, Eye, EyeOff, CreditCard, KeyRound } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { UserRole } from '@/types';

interface FormData {
  name: string;
  registrationNumber: string;
  password: string;
}

interface ValidatorLoginData {
  aadharNumber: string;
  verificationCode: string;
}

const tabs: { id: UserRole; label: string; icon: React.ReactNode }[] = [
  { id: 'generator', label: 'Generator', icon: <Leaf className="w-4 h-4" /> },
  { id: 'validator', label: 'Validator', icon: <Shield className="w-4 h-4" /> },
  { id: 'consumer', label: 'Consumer', icon: <ShoppingCart className="w-4 h-4" /> },
];

const LoginScreen: React.FC = () => {
  const { setActiveTab, showToast } = useApp();
  const [activeRole, setActiveRole] = useState<UserRole>('generator');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    registrationNumber: '',
    password: '',
  });

  const [validatorData, setValidatorData] = useState<ValidatorLoginData>({
    aadharNumber: '',
    verificationCode: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [validatorErrors, setValidatorErrors] = useState<Partial<Record<keyof ValidatorLoginData, string>>>({});

  const validateAadhar = (aadhar: string): boolean => {
    const cleanAadhar = aadhar.replace(/\s/g, '');
    return /^\d{12}$/.test(cleanAadhar);
  };

  const validateVerificationCode = (code: string): boolean => {
    return /^\d{6}$/.test(code);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = activeRole === 'consumer' ? 'Company name is required' : 'Organization name is required';
    }
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = activeRole === 'consumer' ? 'Business registration number is required' : 'Registration number is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateValidatorLogin = (): boolean => {
    const newErrors: Partial<Record<keyof ValidatorLoginData, string>> = {};

    if (!validatorData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!validateAadhar(validatorData.aadharNumber)) {
      newErrors.aadharNumber = 'Enter valid 12-digit Aadhar number';
    }

    if (!validatorData.verificationCode.trim()) {
      newErrors.verificationCode = '6-digit code is required';
    } else if (!validateVerificationCode(validatorData.verificationCode)) {
      newErrors.verificationCode = 'Enter valid 6-digit code';
    }

    setValidatorErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    showToast('success', 'Login Successful', 'Welcome Back!');
    setActiveTab(activeRole);
  };

  const handleValidatorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateValidatorLogin()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    showToast('success', 'Login Successful', 'Welcome back, Validator!');
    setActiveTab('validator');
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleValidatorInputChange = (field: keyof ValidatorLoginData, value: string) => {
    setValidatorData(prev => ({ ...prev, [field]: value }));
    if (validatorErrors[field]) {
      setValidatorErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatAadhar = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 12);
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const getFieldLabels = () => {
    if (activeRole === 'consumer') {
      return {
        name: 'Company Legal Name',
        registration: 'Business Registration Number / Tax ID',
      };
    }
    return {
      name: 'Organization Name',
      registration: 'Registration / Charity Number',
    };
  };

  const labels = getFieldLabels();

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="gradient-header pt-12 pb-6 px-5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('home')}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Login</h1>
            <p className="text-white/70 text-xs">Access your account</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-3 relative z-10">
        <div className="bg-card rounded-xl p-1.5 shadow-lg flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveRole(tab.id);
                setErrors({});
                setValidatorErrors({});
                setFormData({ name: '', registrationNumber: '', password: '' });
                setValidatorData({ aadharNumber: '', verificationCode: '' });
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeRole === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.form
            key={activeRole}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {activeRole === 'validator' ? (
              <div className="space-y-4">
                {/* Aadhar Number */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    <CreditCard className="w-3.5 h-3.5 inline mr-1" />
                    Aadhar Number *
                  </label>
                  <input
                    type="text"
                    value={validatorData.aadharNumber}
                    onChange={(e) => handleValidatorInputChange('aadharNumber', formatAadhar(e.target.value))}
                    className={`input-field ${validatorErrors.aadharNumber ? 'border-destructive' : ''}`}
                    placeholder="XXXX XXXX XXXX"
                    maxLength={14}
                  />
                  {validatorErrors.aadharNumber && (
                    <p className="text-xs text-destructive mt-1">{validatorErrors.aadharNumber}</p>
                  )}
                </div>

                {/* 6-digit Verification Code */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    <KeyRound className="w-3.5 h-3.5 inline mr-1" />
                    6-Digit Verification Code *
                  </label>
                  <input
                    type="password"
                    value={validatorData.verificationCode}
                    onChange={(e) => handleValidatorInputChange('verificationCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`input-field tracking-[0.5em] text-center ${validatorErrors.verificationCode ? 'border-destructive' : ''}`}
                    placeholder="● ● ● ● ● ●"
                    maxLength={6}
                  />
                  {validatorErrors.verificationCode && (
                    <p className="text-xs text-destructive mt-1">{validatorErrors.verificationCode}</p>
                  )}
                </div>

                {/* Login Button */}
                <button
                  type="button"
                  onClick={handleValidatorLogin}
                  disabled={isSubmitting}
                  className="btn-primary mt-6 disabled:opacity-50"
                >
                  {isSubmitting ? 'Logging In...' : 'Login'}
                </button>

                {/* Link to Sign In */}
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signin')}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            ) : (
              <>
                {/* Organization/Company Name */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">{labels.name} *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`input-field ${errors.name ? 'border-destructive' : ''}`}
                    placeholder={activeRole === 'consumer' ? 'Enter company name' : 'Enter organization name'}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Registration Number */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">{labels.registration} *</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    className={`input-field ${errors.registrationNumber ? 'border-destructive' : ''}`}
                    placeholder="Enter registration number"
                  />
                  {errors.registrationNumber && (
                    <p className="text-xs text-destructive mt-1">{errors.registrationNumber}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`input-field pr-10 ${errors.password ? 'border-destructive' : ''}`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary mt-6 disabled:opacity-50"
                >
                  {isSubmitting ? 'Logging In...' : 'Login'}
                </button>

                {/* Link to Sign In */}
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signin')}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </>
            )}
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginScreen;
