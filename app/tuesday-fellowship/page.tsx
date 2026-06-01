'use client';

import React, { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';
import { ICONS } from '@/src/constants';

export default function TuesdayFellowshipRegistration() {
  const { apiClient } = useApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    isFirstTimeVisitor: '',
    wishesToVolunteer: '',
    placeOfResidence: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClearSelection = (field: 'isFirstTimeVisitor' | 'wishesToVolunteer') => {
    setFormData(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.contact || !formData.placeOfResidence) {
      toast.error('Please fill in all required text fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient('/api/tuesday-fellowship', 'POST', {
        ...formData,
        isFirstTimeVisitor: formData.isFirstTimeVisitor === 'yes',
        wishesToVolunteer: formData.wishesToVolunteer === 'yes',
      });
      toast.success('Registration successful! We look forward to seeing you.');
      setFormData({
        name: '',
        email: '',
        contact: '',
        isFirstTimeVisitor: '',
        wishesToVolunteer: '',
        placeOfResidence: ''
      });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Aurora & Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-orange-600/10 blur-[130px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute bottom-[-10%] left-[15%] w-[50%] h-[50%] bg-purple-900/20 blur-[160px] rounded-full pointer-events-none" />

      {/* Main Container: Unified Premium Glassmorphic Card */}
      <div className="w-full max-w-3xl z-10 bg-brand-surface/40 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden transition-all duration-300">
        
        {/* Banner Section */}
        <div className="relative border-b border-white/10 p-8 sm:p-12 text-center group bg-gradient-to-b from-black/40 via-brand-surface/20 to-transparent">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-surface/10 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col items-center space-y-5">
            {/* Logo Container */}
            <div className="relative p-2 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/20 rounded-full border border-orange-500/30 mb-3 group-hover:scale-105 transition-all duration-500 shadow-[0_0_30px_rgba(245,158,11,0.15)] group-hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]">
              <img
                src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png"
                alt="Torch Fellowship Logo"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 tracking-wider drop-shadow-md">
              TUESDAY REVIVAL FELLOWSHIP
            </h1>
            
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-orange-500/60 to-transparent mx-auto my-1"></div>
            
            <p className="text-gray-300 text-lg sm:text-xl font-light tracking-wide max-w-xl mx-auto leading-relaxed font-serif italic">
              “Will you not revive us again, that your people may rejoice in you?” <br/>
              <span className="text-xs tracking-widest font-semibold uppercase font-sans text-orange-400/90 mt-2 block not-italic">— Psalm 85:6</span>
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-10 bg-black/20">
          <div className="mb-8 border-b border-white/10 pb-6 text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-widest uppercase">
              ATTENDANCE & REGISTRATION
            </h2>
            <p className="text-gray-400 mt-2 text-sm font-medium">
              Please take a moment to record your attendance below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Input Group: Name */}
            <div className="space-y-2 group">
              <label htmlFor="name" className="block text-xs font-bold text-gray-400 tracking-widest uppercase group-focus-within:text-orange-400 transition-colors">
                Name <span className="text-orange-500 font-serif">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ICONS.User className="h-5 w-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400/80 transition-all outline-none shadow-inner text-sm sm:text-base font-medium"
                />
              </div>
            </div>

            {/* Input Group: Email */}
            <div className="space-y-2 group">
              <label htmlFor="email" className="block text-xs font-bold text-gray-400 tracking-widest uppercase group-focus-within:text-orange-400 transition-colors">
                Email Address <span className="text-orange-500 font-serif">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ICONS.Mail className="h-5 w-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400/80 transition-all outline-none shadow-inner text-sm sm:text-base font-medium"
                />
              </div>
            </div>

            {/* Input Group: Contact */}
            <div className="space-y-2 group">
              <label htmlFor="contact" className="block text-xs font-bold text-gray-400 tracking-widest uppercase group-focus-within:text-orange-400 transition-colors">
                Contact Info <span className="text-orange-500 font-serif">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ICONS.Phone className="h-5 w-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                </div>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number or email"
                  className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400/80 transition-all outline-none shadow-inner text-sm sm:text-base font-medium"
                />
              </div>
            </div>

            {/* Input Group: First Time Visitor */}
            <div className="space-y-4 bg-white/[0.02] backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300">
              <label className="block text-xs font-bold text-gray-300 tracking-widest uppercase">
                Are you a first time visitor?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer group bg-black/30 p-4 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all duration-300 select-none">
                  <input
                    type="radio"
                    name="isFirstTimeVisitor"
                    value="yes"
                    checked={formData.isFirstTimeVisitor === 'yes'}
                    onChange={handleChange}
                    className="w-5 h-5 text-orange-500 bg-black/50 border-white/15 focus:ring-orange-500/50 focus:ring-offset-black accent-orange-500 cursor-pointer"
                  />
                  <span className="text-gray-300 group-hover:text-orange-300 transition-colors font-semibold text-sm sm:text-base">Yes, I am</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group bg-black/30 p-4 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all duration-300 select-none">
                  <input
                    type="radio"
                    name="isFirstTimeVisitor"
                    value="no"
                    checked={formData.isFirstTimeVisitor === 'no'}
                    onChange={handleChange}
                    className="w-5 h-5 text-orange-500 bg-black/50 border-white/15 focus:ring-orange-500/50 focus:ring-offset-black accent-orange-500 cursor-pointer"
                  />
                  <span className="text-gray-300 group-hover:text-orange-300 transition-colors font-semibold text-sm sm:text-base">No, I am not</span>
                </label>
              </div>
              {formData.isFirstTimeVisitor && (
                <button
                  type="button"
                  onClick={() => handleClearSelection('isFirstTimeVisitor')}
                  className="text-[10px] text-orange-400 hover:text-orange-300 transition-colors mt-1 uppercase tracking-widest font-bold flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm">×</span> Clear selection
                </button>
              )}
            </div>

            {/* Input Group: Volunteer */}
            <div className="space-y-4 bg-white/[0.02] backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300">
              <label className="block text-xs font-bold text-gray-300 tracking-widest uppercase">
                Do you wish to volunteer in any department?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer group bg-black/30 p-4 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all duration-300 select-none">
                  <input
                    type="radio"
                    name="wishesToVolunteer"
                    value="yes"
                    checked={formData.wishesToVolunteer === 'yes'}
                    onChange={handleChange}
                    className="w-5 h-5 text-orange-500 bg-black/50 border-white/15 focus:ring-orange-500/50 focus:ring-offset-black accent-orange-500 cursor-pointer"
                  />
                  <span className="text-gray-300 group-hover:text-orange-300 transition-colors font-semibold text-sm sm:text-base">Yes, I do</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group bg-black/30 p-4 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all duration-300 select-none">
                  <input
                    type="radio"
                    name="wishesToVolunteer"
                    value="no"
                    checked={formData.wishesToVolunteer === 'no'}
                    onChange={handleChange}
                    className="w-5 h-5 text-orange-500 bg-black/50 border-white/15 focus:ring-orange-500/50 focus:ring-offset-black accent-orange-500 cursor-pointer"
                  />
                  <span className="text-gray-300 group-hover:text-orange-300 transition-colors font-semibold text-sm sm:text-base">No, thanks</span>
                </label>
              </div>
              {formData.wishesToVolunteer && (
                <button
                  type="button"
                  onClick={() => handleClearSelection('wishesToVolunteer')}
                  className="text-[10px] text-orange-400 hover:text-orange-300 transition-colors mt-1 uppercase tracking-widest font-bold flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm">×</span> Clear selection
                </button>
              )}
            </div>

            {/* Input Group: Place of Residence */}
            <div className="space-y-2 group">
              <label htmlFor="placeOfResidence" className="block text-xs font-bold text-gray-400 tracking-widest uppercase group-focus-within:text-orange-400 transition-colors">
                Place of Residence <span className="text-orange-500 font-serif">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ICONS.MapPin className="h-5 w-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                </div>
                <input
                  type="text"
                  id="placeOfResidence"
                  name="placeOfResidence"
                  value={formData.placeOfResidence}
                  onChange={handleChange}
                  required
                  placeholder="Enter your neighborhood, estate, or town"
                  className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400/80 transition-all outline-none shadow-inner text-sm sm:text-base font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-4 px-8 border border-transparent rounded-xl shadow-[0_4px_25px_rgba(249,115,22,0.35)] text-brand-dark bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-black tracking-widest text-lg cursor-pointer shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <ICONS.Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-dark" />
                    <span>SUBMITTING...</span>
                  </>
                ) : (
                  <span>SUBMIT REGISTRATION</span>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
