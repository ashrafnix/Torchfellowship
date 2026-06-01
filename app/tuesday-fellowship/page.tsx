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
    
    if (!formData.name || !formData.contact || !formData.placeOfResidence) {
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
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/30 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-3xl z-10">
        
        {/* Banner Section */}
        <div className="relative rounded-t-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-brand-dark to-gray-900 border border-white/10 p-8 sm:p-12 text-center group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="p-4 bg-brand-gold/10 rounded-full border border-brand-gold/20 mb-2 group-hover:scale-110 transition-transform duration-500">
              <ICONS.Flame className="w-12 h-12 text-brand-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] animate-pulse" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200 tracking-tight drop-shadow-sm">
              TUESDAY REVIVAL FELLOWSHIP
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl font-light tracking-wide max-w-xl mx-auto">
              Will you not revive us again, that your people may rejoice in you? <br/>
              <span className="text-sm italic text-brand-gold/80">— Psalm 85:6</span>
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-brand-dark/60 backdrop-blur-xl rounded-b-3xl shadow-2xl border border-white/10 p-6 sm:p-10">
          <div className="mb-8 border-b border-white/10 pb-6 text-center">
            <h2 className="text-2xl font-bold text-white tracking-wide">ATTENDANCE AND REGISTRATION</h2>
            <p className="text-gray-400 mt-2 text-sm">Please fill out the form below to register your attendance.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Input Group: Name */}
            <div className="space-y-2 group">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-300 tracking-wider group-focus-within:text-brand-gold transition-colors">
                NAME <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ICONS.User className="h-5 w-5 text-gray-500 group-focus-within:text-brand-gold transition-colors" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your answer"
                  className="block w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all outline-none shadow-inner"
                />
              </div>
            </div>

            {/* Input Group: Contact */}
            <div className="space-y-2 group">
              <label htmlFor="contact" className="block text-sm font-semibold text-gray-300 tracking-wider group-focus-within:text-brand-gold transition-colors">
                CONTACT <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ICONS.Phone className="h-5 w-5 text-gray-500 group-focus-within:text-brand-gold transition-colors" />
                </div>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="Your phone number or email"
                  className="block w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all outline-none shadow-inner"
                />
              </div>
            </div>

            {/* Input Group: First Time Visitor */}
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <label className="block text-sm font-semibold text-white tracking-wider">
                ARE YOU A FIRST TIME VISITOR?
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="isFirstTimeVisitor"
                    value="yes"
                    checked={formData.isFirstTimeVisitor === 'yes'}
                    onChange={handleChange}
                    className="w-5 h-5 text-brand-gold bg-black/50 border-gray-500 focus:ring-brand-gold focus:ring-offset-gray-900"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">Yes</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="isFirstTimeVisitor"
                    value="no"
                    checked={formData.isFirstTimeVisitor === 'no'}
                    onChange={handleChange}
                    className="w-5 h-5 text-brand-gold bg-black/50 border-gray-500 focus:ring-brand-gold focus:ring-offset-gray-900"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">No</span>
                </label>
              </div>
              {formData.isFirstTimeVisitor && (
                <button
                  type="button"
                  onClick={() => handleClearSelection('isFirstTimeVisitor')}
                  className="text-xs text-brand-gold hover:text-yellow-300 transition-colors mt-2 uppercase tracking-wider font-medium"
                >
                  Clear selection
                </button>
              )}
            </div>

            {/* Input Group: Volunteer */}
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <label className="block text-sm font-semibold text-white tracking-wider">
                DO YOU WISH TO VOLUNTEER IN ANY DEPARTMENT?
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="wishesToVolunteer"
                    value="yes"
                    checked={formData.wishesToVolunteer === 'yes'}
                    onChange={handleChange}
                    className="w-5 h-5 text-brand-gold bg-black/50 border-gray-500 focus:ring-brand-gold focus:ring-offset-gray-900"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">Yes</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="wishesToVolunteer"
                    value="no"
                    checked={formData.wishesToVolunteer === 'no'}
                    onChange={handleChange}
                    className="w-5 h-5 text-brand-gold bg-black/50 border-gray-500 focus:ring-brand-gold focus:ring-offset-gray-900"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">No</span>
                </label>
              </div>
              {formData.wishesToVolunteer && (
                <button
                  type="button"
                  onClick={() => handleClearSelection('wishesToVolunteer')}
                  className="text-xs text-brand-gold hover:text-yellow-300 transition-colors mt-2 uppercase tracking-wider font-medium"
                >
                  Clear selection
                </button>
              )}
            </div>

            {/* Input Group: Place of Residence */}
            <div className="space-y-2 group">
              <label htmlFor="placeOfResidence" className="block text-sm font-semibold text-gray-300 tracking-wider group-focus-within:text-brand-gold transition-colors">
                PLACE OF RESIDENCE <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ICONS.MapPin className="h-5 w-5 text-gray-500 group-focus-within:text-brand-gold transition-colors" />
                </div>
                <input
                  type="text"
                  id="placeOfResidence"
                  name="placeOfResidence"
                  value={formData.placeOfResidence}
                  onChange={handleChange}
                  required
                  placeholder="Your answer"
                  className="block w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all outline-none shadow-inner"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-4 px-8 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-[#8B2323] to-red-900 hover:from-red-800 hover:to-red-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transform transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 font-bold tracking-widest text-lg"
              >
                {isSubmitting ? (
                  <>
                    <ICONS.Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    <span>SUBMITTING...</span>
                  </>
                ) : (
                  <span>SUBMIT</span>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
