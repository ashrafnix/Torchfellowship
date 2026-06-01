'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ICONS } from '@/src/constants';
import { uploadImage } from '@/services/uploadService';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getApiUrl } from '@/lib/api';

const ProfilePage: React.FC = () => {
  const { user, reloadUser } = useAuth();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'access'>('personal');

  // Input States
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Security Input States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility States
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Mutation for updating profile and password
  const mutation = useMutation({
    mutationFn: async (payload: {
      fullName: string;
      avatarUrl: string | null;
      currentPassword?: string;
      newPassword?: string;
    }) => {
      const response = await fetch(getApiUrl('/api/profile/me'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      return response.json();
    },
    onSuccess: async () => {
      await reloadUser();
      toast.success('Profile updated successfully!');
      setAvatarFile(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image file is too large. Please use a file under 2MB.');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    let finalAvatarUrl = user?.avatarUrl || null;
    setIsUploading(true);

    if (avatarFile) {
      try {
        finalAvatarUrl = await uploadImage(avatarFile, 'avatars');
      } catch (uploadError) {
        toast.error((uploadError as Error).message);
        setIsUploading(false);
        return;
      }
    }
    
    setIsUploading(false);
    mutation.mutate({ fullName, avatarUrl: finalAvatarUrl });
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }

    mutation.mutate({
      fullName: user?.fullName || '',
      avatarUrl: user?.avatarUrl || null,
      currentPassword,
      newPassword
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark to-purple-950/20" />
        <div className="z-10 flex flex-col items-center space-y-4">
          <ICONS.Loader className="animate-spin h-10 w-10 text-orange-400" />
          <p className="text-gray-400 font-medium tracking-wide">Retrieving account session...</p>
        </div>
      </div>
    );
  }

  // Format Join Date
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Active Member';

  // Role Color Logic
  const getRoleColors = (role: string) => {
    switch (role) {
      case 'Super-Admin':
        return {
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)] border-purple-500/50',
          title: 'text-purple-400'
        };
      case 'Admin':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-500/50',
          title: 'text-amber-400'
        };
      default:
        return {
          bg: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
          glow: 'shadow-[0_0_20px_rgba(20,184,166,0.3)] border-teal-500/50',
          title: 'text-teal-400'
        };
    }
  };

  const roleStyles = getRoleColors(user.role);

  return (
    <div className="min-h-screen bg-brand-dark relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      {/* Decorative Aura Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-orange-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* ==================== LEFT SIDEBAR: PROFILE OVERVIEW ==================== */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Main User Card */}
          <div className="bg-brand-surface/40 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col items-center text-center group">
            
            {/* Elegant Avatar Container with Dynamic Glow */}
            <div className="relative mb-5">
              <div className={`h-28 w-28 rounded-full overflow-hidden border-2 p-1 flex items-center justify-center bg-black/40 transition-all duration-500 group-hover:scale-105 ${roleStyles.glow}`}>
                <img
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${user.fullName || user.email}&background=2B2F36&color=EAEAEA&size=128`}
                  alt="Profile Avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              
              {/* Overlay Edit Button */}
              <label htmlFor="avatar-upload-sidebar" className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-400 text-brand-dark p-2 rounded-full cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(249,115,22,0.3)] hover:scale-110">
                <ICONS.Image className="w-4 h-4" />
                <input
                  id="avatar-upload-sidebar"
                  type="file"
                  className="sr-only"
                  accept="image/png, image/jpeg"
                  onChange={handleAvatarChange}
                  aria-label="Upload new profile picture"
                />
              </label>
            </div>

            {/* Profile Info */}
            <h2 className="text-2xl font-serif font-black text-white tracking-wide group-hover:text-orange-300 transition-colors">
              {user.fullName || 'User Account'}
            </h2>
            <p className="text-gray-400 text-sm font-medium mt-1 select-all">{user.email}</p>
            
            {/* Dynamic Role Badge */}
            <span className={`mt-3 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest border ${roleStyles.bg}`}>
              {user.role}
            </span>

            <div className="w-full h-px bg-white/10 my-5" />

            {/* Visual Account Details */}
            <div className="w-full space-y-3.5 text-left text-xs sm:text-sm">
              <div className="flex items-center justify-between text-gray-400">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Account Standing</span>
                <span className="flex items-center gap-1.5 text-green-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Member Since</span>
                <span className="text-gray-200 font-medium">{joinDate}</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="bg-brand-surface/40 backdrop-blur-2xl rounded-3xl border border-white/10 p-3 shadow-xl flex flex-row lg:flex-col gap-2">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === 'personal'
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-brand-dark shadow-[0_4px_15px_rgba(249,115,22,0.25)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <ICONS.User className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline lg:inline">Personal Details</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-brand-dark shadow-[0_4px_15px_rgba(249,115,22,0.25)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <ICONS.Shield className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline lg:inline">Security Center</span>
            </button>
            <button
              onClick={() => setActiveTab('access')}
              className={`flex-1 flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === 'access'
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-brand-dark shadow-[0_4px_15px_rgba(249,115,22,0.25)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <ICONS.Settings className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline lg:inline">Access & Logs</span>
            </button>
          </div>

        </div>

        {/* ==================== RIGHT PANEL: TAB CONTENT ==================== */}
        <div className="lg:col-span-8">
          <div className="bg-brand-surface/40 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-h-[480px] flex flex-col justify-between">
            
            {/* ==================== TAB 1: PERSONAL INFORMATION ==================== */}
            {activeTab === 'personal' && (
              <form onSubmit={handlePersonalSubmit} className="space-y-6">
                <div>
                  <h1 className="text-3xl font-serif font-black text-white tracking-wide">Personal Details</h1>
                  <p className="text-gray-400 mt-1.5 text-sm font-medium">
                    Modify your public presentation details and avatar image.
                  </p>
                  <div className="h-0.5 w-16 bg-orange-500/80 mt-3" />
                </div>

                <div className="space-y-6 pt-4">
                  {/* Email Box (Read-Only) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ICONS.Shield className="h-5 w-5 text-orange-500/60" />
                      </div>
                      <input
                        type="text"
                        value={user.email}
                        readOnly
                        disabled
                        className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-gray-500 placeholder-gray-700 outline-none select-all cursor-not-allowed text-sm sm:text-base font-medium shadow-inner"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-600 text-xs">
                        🔒 Read-Only
                      </div>
                    </div>
                  </div>

                  {/* Name Input Box */}
                  <div className="space-y-2 group">
                    <label htmlFor="fullName-input" className="block text-xs font-bold text-gray-400 tracking-widest uppercase group-focus-within:text-orange-400 transition-colors">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ICONS.User className="h-5 w-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                      </div>
                      <input
                        type="text"
                        id="fullName-input"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="Enter your full name"
                        className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400/80 transition-all outline-none shadow-inner text-sm sm:text-base font-medium"
                      />
                    </div>
                  </div>

                  {/* Avatar Upload Field */}
                  <div className="space-y-3 bg-white/[0.02] backdrop-blur-md p-5 rounded-2xl border border-white/5">
                    <label className="block text-xs font-bold text-gray-300 tracking-widest uppercase">
                      Profile Picture
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="h-16 w-16 rounded-full overflow-hidden border border-white/10 shrink-0">
                        <img
                          src={avatarPreview || `https://ui-avatars.com/api/?name=${user.fullName || user.email}&background=2B2F36&color=EAEAEA&size=128`}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <label
                          htmlFor="avatar-upload-main"
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-orange-500/50 hover:bg-white/[0.01] transition-all text-xs font-bold tracking-widest text-gray-400 hover:text-orange-300 uppercase"
                        >
                          <ICONS.UploadCloud className="h-4 w-4" />
                          {avatarFile ? avatarFile.name : 'Select Avatar File'}
                        </label>
                        <input
                          id="avatar-upload-main"
                          type="file"
                          className="sr-only"
                          accept="image/png, image/jpeg"
                          onChange={handleAvatarChange}
                        />
                        <p className="text-[10px] text-gray-500 mt-1">PNG, JPG (Max. size 2MB)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={mutation.isPending || isUploading}
                    className="w-full flex items-center justify-center space-x-2 py-4 px-8 border border-transparent rounded-xl shadow-[0_4px_25px_rgba(249,115,22,0.35)] text-brand-dark bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500 transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-black tracking-widest text-sm uppercase cursor-pointer"
                  >
                    {mutation.isPending || isUploading ? (
                      <>
                        <ICONS.Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-dark" />
                        <span>Saving Profiles...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ==================== TAB 2: SECURITY & PASSWORDS ==================== */}
            {activeTab === 'security' && (
              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div>
                  <h1 className="text-3xl font-serif font-black text-white tracking-wide">Security Center</h1>
                  <p className="text-gray-400 mt-1.5 text-sm font-medium">
                    Update your account credentials to keep your profile secure.
                  </p>
                  <div className="h-0.5 w-16 bg-orange-500/80 mt-3" />
                </div>

                <div className="space-y-4 pt-4">
                  {/* Current Password Field */}
                  <div className="space-y-2 group">
                    <label htmlFor="currentPassword" className="block text-xs font-bold text-gray-400 tracking-widest uppercase group-focus-within:text-orange-400 transition-colors">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ICONS.Shield className="h-5 w-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                      </div>
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="block w-full pl-12 pr-12 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400/80 transition-all outline-none shadow-inner text-sm sm:text-base font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white focus:outline-none cursor-pointer"
                      >
                        {showCurrentPass ? <ICONS.EyeOff className="h-5 w-5" /> : <ICONS.Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password Field */}
                  <div className="space-y-2 group">
                    <label htmlFor="newPassword" className="block text-xs font-bold text-gray-400 tracking-widest uppercase group-focus-within:text-orange-400 transition-colors">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ICONS.Shield className="h-5 w-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                      </div>
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="block w-full pl-12 pr-12 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400/80 transition-all outline-none shadow-inner text-sm sm:text-base font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white focus:outline-none cursor-pointer"
                      >
                        {showNewPass ? <ICONS.EyeOff className="h-5 w-5" /> : <ICONS.Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password Field */}
                  <div className="space-y-2 group">
                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-400 tracking-widest uppercase group-focus-within:text-orange-400 transition-colors">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ICONS.Shield className="h-5 w-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                      </div>
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="block w-full pl-12 pr-12 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400/80 transition-all outline-none shadow-inner text-sm sm:text-base font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white focus:outline-none cursor-pointer"
                      >
                        {showConfirmPass ? <ICONS.EyeOff className="h-5 w-5" /> : <ICONS.Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2 text-xs">
                    <span className="font-extrabold uppercase text-[10px] text-orange-400 tracking-wider">Security Recommendations</span>
                    <ul className="space-y-1.5 text-gray-400 font-medium">
                      <li className="flex items-center gap-1.5">
                        <span className="text-green-500 font-bold">✔</span> Password must be at least 6 characters long.
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-green-500 font-bold">✔</span> Include mixed letters, numbers, and symbols for high strength.
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-green-500 font-bold">✔</span> Avoid utilizing common names, dictionary words, or keyboard patterns.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full flex items-center justify-center space-x-2 py-4 px-8 border border-transparent rounded-xl shadow-[0_4px_25px_rgba(249,115,22,0.35)] text-brand-dark bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500 transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-black tracking-widest text-sm uppercase cursor-pointer"
                  >
                    {mutation.isPending ? (
                      <>
                        <ICONS.Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-dark" />
                        <span>Updating Credentials...</span>
                      </>
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ==================== TAB 3: ACCESS & LOGS ==================== */}
            {activeTab === 'access' && (
              <div className="space-y-6 text-left">
                <div>
                  <h1 className="text-3xl font-serif font-black text-white tracking-wide">System Access & Logs</h1>
                  <p className="text-gray-400 mt-1.5 text-sm font-medium">
                    Analyze your active session keys, user scope, and operational permissions.
                  </p>
                  <div className="h-0.5 w-16 bg-orange-500/80 mt-3" />
                </div>

                {/* Capability Matrix Checklist */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-xs font-bold text-gray-300 tracking-widest uppercase">System Permissions Unlocked</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-start gap-3">
                      <div className="p-1 bg-green-500/10 rounded-full text-green-400 mt-0.5 select-none">✔</div>
                      <div>
                        <span className="text-xs font-bold text-white block">Public Community Chat</span>
                        <span className="text-[10px] text-gray-500">Read and publish standard chat streams</span>
                      </div>
                    </div>

                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-start gap-3">
                      <div className="p-1 bg-green-500/10 rounded-full text-green-400 mt-0.5 select-none">✔</div>
                      <div>
                        <span className="text-xs font-bold text-white block">Testimony Streams</span>
                        <span className="text-[10px] text-gray-500">Publish faith stories for verification</span>
                      </div>
                    </div>

                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-start gap-3">
                      <div className={user.role === 'Admin' || user.role === 'Super-Admin' ? 'p-1 bg-green-500/10 rounded-full text-green-400 mt-0.5 select-none' : 'p-1 bg-red-500/10 rounded-full text-red-400 mt-0.5 select-none'}>
                        {user.role === 'Admin' || user.role === 'Super-Admin' ? '✔' : '🔒'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Admin Console Dashboard</span>
                        <span className="text-[10px] text-gray-500">Review registrations and update resources</span>
                      </div>
                    </div>

                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-start gap-3">
                      <div className={user.role === 'Super-Admin' ? 'p-1 bg-green-500/10 rounded-full text-green-400 mt-0.5 select-none' : 'p-1 bg-red-500/10 rounded-full text-red-400 mt-0.5 select-none'}>
                        {user.role === 'Super-Admin' ? '✔' : '🔒'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Global User Security Manager</span>
                        <span className="text-[10px] text-gray-500">Modify accounts, role scopes, and access systems</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Developer / Account JSON Structure */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 tracking-widest uppercase block">Identity Raw Payload</span>
                  <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-[10px] text-orange-300 overflow-x-auto shadow-inner select-all">
                    <pre>{JSON.stringify({
                      userId: user.id,
                      userRole: user.role,
                      userMail: user.email,
                      authProvider: 'Firestore Secure Database',
                      securityToken: 'Active (JWT Exchanged Session)',
                      systemJoinStamp: user.createdAt || 'Default Standard Time'
                    }, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Brand Indicator */}
            <div className="pt-6 border-t border-white/5 text-center text-[10px] text-gray-500 tracking-widest font-semibold uppercase select-none">
              Torch Fellowship Network Security Profile
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
