import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Shield, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email(),
  phone: z.string().min(10, 'Valid phone number required'),
});

const passwordSchema = z.object({
  current_password: z.string().min(6, 'Current password required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string().min(8, 'Confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

interface KYCStatus {
  status: 'VERIFIED' | 'PENDING' | 'NOT_STARTED' | 'REJECTED';
  message?: string;
}

const ProfilePage: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [kycStatus] = useState<KYCStatus>({ status: 'VERIFIED' });
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const userName = 'John Doe';
  const userInitial = userName.charAt(0).toUpperCase();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+233 24 123 4567',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSaveProfile = async (data: ProfileFormData) => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Profile saved:', data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Password changed');
      resetPassword();
      alert('Password changed successfully');
    } finally {
      setIsSaving(false);
    }
  };

  const kycStatusColors: Record<KYCStatus['status'], string> = {
    VERIFIED: 'bg-green-500/20 text-green-400 border-green-500/30',
    PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    NOT_STARTED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="min-h-screen bg-[#0f1119] py-6">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#FF8533] flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{userInitial}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{userName}</h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${kycStatusColors[kycStatus.status]}`}>
              <Shield className="w-3 h-3 mr-1" />
              KYC: {kycStatus.status}
            </span>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit(onSaveProfile)}
          className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 space-y-5"
        >
          <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  {...register('first_name')}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f1119] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FF6A00] transition-colors"
                />
              </div>
              {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  {...register('last_name')}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f1119] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FF6A00] transition-colors"
                />
              </div>
              {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                {...register('email')}
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-[#0f1119] border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                {...register('phone')}
                className="w-full pl-10 pr-4 py-3 bg-[#0f1119] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FF6A00] transition-colors"
              />
            </div>
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-[#FF6A00] hover:bg-[#FF8533] disabled:bg-gray-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Shield className="w-5 h-5" />
                </motion.div>
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-5 h-5" />
                Saved!
              </>
            ) : (
              'Save Changes'
            )}
          </motion.button>
        </motion.form>

        {/* Change Password Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 mt-6"
        >
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="w-full flex items-center justify-between text-white font-bold mb-4"
          >
            <span className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </span>
            <motion.span animate={{ rotate: showPasswordSection ? 180 : 0 }}>
              <ChevronDown className="w-5 h-5" />
            </motion.span>
          </button>

          <AnimatePresence>
            {showPasswordSection && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handlePasswordSubmit(onChangePassword)}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      {...registerPassword('current_password')}
                      type="password"
                      className="w-full pl-10 pr-4 py-3 bg-[#0f1119] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FF6A00] transition-colors"
                    />
                  </div>
                  {passwordErrors.current_password && <p className="text-red-400 text-xs mt-1">{passwordErrors.current_password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      {...registerPassword('new_password')}
                      type="password"
                      className="w-full pl-10 pr-4 py-3 bg-[#0f1119] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FF6A00] transition-colors"
                    />
                  </div>
                  {passwordErrors.new_password && <p className="text-red-400 text-xs mt-1">{passwordErrors.new_password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      {...registerPassword('confirm_password')}
                      type="password"
                      className="w-full pl-10 pr-4 py-3 bg-[#0f1119] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FF6A00] transition-colors"
                    />
                  </div>
                  {passwordErrors.confirm_password && <p className="text-red-400 text-xs mt-1">{passwordErrors.confirm_password.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 bg-[#252840] hover:bg-[#2d3050] text-white font-bold rounded-lg transition-colors border border-gray-700"
                >
                  Update Password
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* KYC Status Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 mt-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verification Status
          </h3>
          <div className={`p-4 rounded-xl border ${kycStatusColors[kycStatus.status]}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{kycStatus.status}</p>
                <p className="text-xs mt-1 opacity-80">
                  {kycStatus.status === 'VERIFIED' && 'Your account is fully verified.'}
                  {kycStatus.status === 'PENDING' && 'Verification in progress...'}
                  {kycStatus.status === 'NOT_STARTED' && 'Complete verification to unlock all features.'}
                  {kycStatus.status === 'REJECTED' && 'Verification rejected. Please resubmit.'}
                </p>
              </div>
              {kycStatus.status !== 'VERIFIED' && (
                <button className="px-4 py-2 bg-[#FF6A00] hover:bg-[#FF8533] text-white text-sm font-bold rounded-lg transition-colors">
                  Verify Now
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
