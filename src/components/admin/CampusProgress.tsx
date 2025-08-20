import React from 'react';

interface CampusProgressProps {
  pending: number;
  total: number;
}

const CampusProgress: React.FC<CampusProgressProps> = ({ pending, total }) => {
  const progress = total > 0 ? ((total - pending) / total) * 100 : 100;

  return (
    <div className="dashboard-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Campus Applications</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-gray-400">
          <span>Pending</span>
          <span>{pending}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right text-sm font-medium text-white">
          {total - pending} / {total} Approved
        </div>
      </div>
    </div>
  );
};

export default CampusProgress;