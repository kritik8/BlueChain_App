import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Leaf, Shield, ShoppingCart, Upload, X, Eye, EyeOff, Check, Phone, CreditCard, KeyRound, ExternalLink } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { UserRole } from '@/types';

interface FormData {
  organizationName: string;
  registrationNumber: string;
  email: string;
  password: string;
  documents: File[];
}

interface ValidatorFormData {
  aadharNumber: string;
  phoneNumber: string;
  verificationCode: string;
  confirmVerificationCode: string;
}

const tabs: { id: UserRole; label: string; icon: React.ReactNode }[] = [
  { id: 'generator', label: 'Generator', icon: <Leaf className="w-4 h-4" /> },
  { id: 'validator', label: 'Validator', icon: <Shield className="w-4 h-4" /> },
  { id: 'consumer', label: 'Consumer', icon: <ShoppingCart className="w-4 h-4" /> },
];

const SignInScreen: React.FC = () => {
  const { setActiveTab, showToast } = useApp();
  const [activeRole, setActiveRole] = useState<UserRole>('generator');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingDigilocker, setIsVerifyingDigilocker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    organizationName: '',
    registrationNumber: '',
    email: '',
    password: '',
    documents: [],
  });

  const [validatorFormData, setValidatorFormData] = useState<ValidatorFormData>({
    aadharNumber: '',
    phoneNumber: '',
    verificationCode: '',
    confirmVerificationCode: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [validatorErrors, setValidatorErrors] = useState<Partial<Record<keyof ValidatorFormData, string>>>({});

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= 8 && hasLetter && hasNumber;
  };

  const validateAadhar = (aadhar: string): boolean => {
    const cleanAadhar = aadhar.replace(/\s/g, '');
    return /^\d{12}$/.test(cleanAadhar);
  };

  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s/g, '');
    return /^\d{10}$/.test(cleanPhone);
  };

  const validateVerificationCode = (code: string): boolean => {
    return /^\d{6}$/.test(code);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = activeRole === 'consumer' ? 'Company name is required' : 'Organization name is required';
    }
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = activeRole === 'consumer' ? 'Business registration number is required' : 'Registration number is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Min 8 characters with letters & numbers';
    }
    if (formData.documents.length === 0 && activeRole !== 'validator') {
      newErrors.documents = 'Please upload at least one document';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateValidatorForm = (): boolean => {
    const newErrors: Partial<Record<keyof ValidatorFormData, string>> = {};

    if (!validatorFormData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!validateAadhar(validatorFormData.aadharNumber)) {
      newErrors.aadharNumber = 'Enter valid 12-digit Aadhar number';
    }

    if (!validatorFormData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhone(validatorFormData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter valid 10-digit phone number';
    }

    if (!validatorFormData.verificationCode.trim()) {
      newErrors.verificationCode = '6-digit code is required';
    } else if (!validateVerificationCode(validatorFormData.verificationCode)) {
      newErrors.verificationCode = 'Enter valid 6-digit code';
    }

    if (!validatorFormData.confirmVerificationCode.trim()) {
      newErrors.confirmVerificationCode = 'Please confirm your code';
    } else if (validatorFormData.verificationCode !== validatorFormData.confirmVerificationCode) {
      newErrors.confirmVerificationCode = 'Codes do not match';
    }

    setValidatorErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    showToast('success', 'Sign In Successful', `Welcome, ${formData.organizationName}!`);
    setActiveTab(activeRole);
  };

  const handleValidatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateValidatorForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    showToast('success', 'Validator Registration Successful', 'Your account has been created!');
    setActiveTab('validator');
  };

  const handleDigilockerVerify = async () => {
    // Validate Aadhar and Phone first
    const newErrors: Partial<Record<keyof ValidatorFormData, string>> = {};

    if (!validatorFormData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!validateAadhar(validatorFormData.aadharNumber)) {
      newErrors.aadharNumber = 'Enter valid 12-digit Aadhar number';
    }

    if (!validatorFormData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhone(validatorFormData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter valid 10-digit phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setValidatorErrors(newErrors);
      return;
    }

    setIsVerifyingDigilocker(true);
    
    // DigiLocker API integration - Opens DigiLocker authorization
    // In production, this would redirect to DigiLocker OAuth
    const digilockerAuthUrl = `https://api.digitallocker.gov.in/public/oauth2/1/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=${encodeURIComponent(window.location.origin + '/digilocker-callback')}&state=validator_signup`;
    
    // For demo, simulate the flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsVerifyingDigilocker(false);
    showToast('info', 'DigiLocker', 'Redirecting to DigiLocker for verification...');
    
    // In production: window.location.href = digilockerAuthUrl;
    // For demo, we'll just show success
    setTimeout(() => {
      showToast('success', 'DigiLocker Verified', 'Your identity has been verified successfully!');
      setActiveTab('validator');
    }, 1000);
  };

  const handleValidatorInputChange = (field: keyof ValidatorFormData, value: string) => {
    setValidatorFormData(prev => ({ ...prev, [field]: value }));
    if (validatorErrors[field]) {
      setValidatorErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatAadhar = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 12);
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatPhone = (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 10);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
    );
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...validFiles],
    }));
    setErrors(prev => ({ ...prev, documents: undefined }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getFieldLabels = () => {
    if (activeRole === 'consumer') {
      return {
        name: 'Company Legal Name',
        registration: 'Business Registration Number / Tax ID',
        email: 'Official Email',
        documents: 'Upload Official Documents',
      };
    }
    return {
      name: 'Organization Name',
      registration: 'Registration / Charity Number',
      email: 'Official Email',
      documents: 'Upload Documents',
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
            <h1 className="text-xl font-bold text-white">Sign In</h1>
            <p className="text-white/70 text-xs">Create your account</p>
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
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 scrollbar-hide">
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
                    value={validatorFormData.aadharNumber}
                    onChange={(e) => handleValidatorInputChange('aadharNumber', formatAadhar(e.target.value))}
                    className={`input-field ${validatorErrors.aadharNumber ? 'border-destructive' : ''}`}
                    placeholder="XXXX XXXX XXXX"
                    maxLength={14}
                  />
                  {validatorErrors.aadharNumber && (
                    <p className="text-xs text-destructive mt-1">{validatorErrors.aadharNumber}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    <Phone className="w-3.5 h-3.5 inline mr-1" />
                    Phone Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={validatorFormData.phoneNumber}
                      onChange={(e) => handleValidatorInputChange('phoneNumber', formatPhone(e.target.value))}
                      className={`input-field rounded-l-none ${validatorErrors.phoneNumber ? 'border-destructive' : ''}`}
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                    />
                  </div>
                  {validatorErrors.phoneNumber && (
                    <p className="text-xs text-destructive mt-1">{validatorErrors.phoneNumber}</p>
                  )}
                </div>

                {/* 6-digit Verification Code */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    <KeyRound className="w-3.5 h-3.5 inline mr-1" />
                    Set 6-Digit Verification Code *
                  </label>
                  <input
                    type="password"
                    value={validatorFormData.verificationCode}
                    onChange={(e) => handleValidatorInputChange('verificationCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`input-field tracking-[0.5em] text-center ${validatorErrors.verificationCode ? 'border-destructive' : ''}`}
                    placeholder="● ● ● ● ● ●"
                    maxLength={6}
                  />
                  {validatorErrors.verificationCode && (
                    <p className="text-xs text-destructive mt-1">{validatorErrors.verificationCode}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Create a 6-digit code for secure login</p>
                </div>

                {/* Confirm Verification Code */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    <KeyRound className="w-3.5 h-3.5 inline mr-1" />
                    Confirm Verification Code *
                  </label>
                  <input
                    type="password"
                    value={validatorFormData.confirmVerificationCode}
                    onChange={(e) => handleValidatorInputChange('confirmVerificationCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`input-field tracking-[0.5em] text-center ${validatorErrors.confirmVerificationCode ? 'border-destructive' : ''}`}
                    placeholder="● ● ● ● ● ●"
                    maxLength={6}
                  />
                  {validatorErrors.confirmVerificationCode && (
                    <p className="text-xs text-destructive mt-1">{validatorErrors.confirmVerificationCode}</p>
                  )}
                </div>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background px-2 text-muted-foreground">or verify with</span>
                  </div>
                </div>

                {/* DigiLocker Button */}
                <button
                  type="button"
                  onClick={handleDigilockerVerify}
                  disabled={isVerifyingDigilocker}
                  className="w-full py-3 px-4 bg-[#0066B3] hover:bg-[#005599] text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isVerifyingDigilocker ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Connecting to DigiLocker...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Verify using DigiLocker
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-muted-foreground">
                  DigiLocker will verify your identity using Aadhar
                </p>

                {/* Submit without DigiLocker */}
                <button
                  type="button"
                  onClick={handleValidatorSubmit}
                  disabled={isSubmitting}
                  className="btn-primary mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Link to Login */}
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-primary font-medium hover:underline"
                  >
                    Login
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
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    className={`input-field ${errors.organizationName ? 'border-destructive' : ''}`}
                    placeholder={activeRole === 'consumer' ? 'Enter company name' : 'Enter organization name'}
                  />
                  {errors.organizationName && (
                    <p className="text-xs text-destructive mt-1">{errors.organizationName}</p>
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

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">{labels.email} *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`input-field ${errors.email ? 'border-destructive' : ''}`}
                    placeholder="Enter official email"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Document Upload */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">{labels.documents} *</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full p-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-colors ${
                      errors.documents ? 'border-destructive bg-destructive/5' : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload PDF, JPG, PNG</span>
                  </button>
                  {errors.documents && (
                    <p className="text-xs text-destructive mt-1">{errors.documents}</p>
                  )}
                  
                  {/* Uploaded files list */}
                  {formData.documents.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {formData.documents.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                          <Check className="w-4 h-4 text-success" />
                          <span className="flex-1 text-xs truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
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
                      placeholder="Create a strong password"
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
                  <p className="text-xs text-muted-foreground mt-1">Min 8 characters with letters & numbers</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary mt-6 disabled:opacity-50"
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
              </>
            )}
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignInScreen;
