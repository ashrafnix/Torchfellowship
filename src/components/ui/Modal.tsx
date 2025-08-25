import React, { ReactNode } from 'react';
import { ICONS } from '../../constants.tsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="p-0.5 bg-gradient-to-br from-brand-gold/30 via-brand-surface to-brand-surface rounded-lg w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
            className="bg-brand-surface rounded-[7px] shadow-2xl max-h-[90vh] flex flex-col transform transition-transform duration-300 animate-scaleIn"
        >
            <div className="flex justify-between items-center p-4 border-b border-brand-muted">
            <h2 className="text-xl font-serif font-bold text-brand-text">{title}</h2>
            <button onClick={onClose} className="text-brand-text-dark hover:text-white transition-colors">
                <ICONS.X className="w-6 h-6" />
            </button>
            </div>
            <div className="p-6 overflow-y-auto admin-scroll">
            {children}
            </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Modal;