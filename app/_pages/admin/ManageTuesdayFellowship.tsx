'use client';

import React from 'react';
import { ICONS } from '@/src/constants';
import Spinner from '@/components/ui/Spinner';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';

interface Registration {
  id: string;
  name: string;
  email: string;
  contact: string;
  isFirstTimeVisitor: boolean;
  wishesToVolunteer: boolean;
  placeOfResidence: string;
  createdAt: string;
}

const ManageTuesdayFellowship: React.FC = () => {
    const { apiClient } = useApi();

    const { data, isLoading } = useQuery<{registrations: Registration[]}>({
        queryKey: ['tuesday_fellowship_registrations', 'admin'],
        queryFn: () => apiClient('/api/tuesday-fellowship', 'GET')
    });

    const registrations = data?.registrations || [];

    const stats = {
        total: registrations.length,
        firstTimers: registrations.filter(r => r.isFirstTimeVisitor).length,
        volunteers: registrations.filter(r => r.wishesToVolunteer).length
    };

    const exportToPDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups to export the PDF');
            return;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Tuesday Fellowship Registration Report</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                            color: #1f2937;
                            padding: 40px;
                            line-height: 1.5;
                            background: white;
                        }
                        .header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 2px solid #f97316;
                            padding-bottom: 20px;
                            margin-bottom: 30px;
                        }
                        .logo-title {
                            display: flex;
                            align-items: center;
                            gap: 15px;
                        }
                        .logo {
                            height: 50px;
                            width: auto;
                        }
                        .title h1 {
                            margin: 0;
                            font-size: 24px;
                            color: #111827;
                        }
                        .title p {
                            margin: 5px 0 0 0;
                            font-size: 14px;
                            color: #6b7280;
                        }
                        .date {
                            text-align: right;
                            font-size: 12px;
                            color: #6b7280;
                        }
                        .stats-grid {
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            gap: 20px;
                            margin-bottom: 30px;
                        }
                        .stat-card {
                            background: #f9fafb;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            padding: 15px;
                            text-align: center;
                        }
                        .stat-card p {
                            margin: 0 0 5px 0;
                            font-size: 11px;
                            color: #6b7280;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        }
                        .stat-card h3 {
                            margin: 0;
                            font-size: 20px;
                            color: #111827;
                            font-weight: bold;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 30px;
                            font-size: 12px;
                        }
                        th {
                            background-color: #f3f4f6;
                            border-bottom: 2px solid #e5e7eb;
                            color: #374151;
                            font-weight: 600;
                            text-align: left;
                            padding: 10px 12px;
                        }
                        td {
                            border-bottom: 1px solid #e5e7eb;
                            padding: 10px 12px;
                            color: #4b5563;
                        }
                        tr:nth-child(even) {
                            background-color: #f9fafb;
                        }
                        .badge {
                            display: inline-block;
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-size: 11px;
                            font-weight: 500;
                        }
                        .badge-yes {
                            background-color: #d1fae5;
                            color: #065f46;
                        }
                        .badge-no {
                            background-color: #f3f4f6;
                            color: #374151;
                        }
                        .footer {
                            text-align: center;
                            font-size: 11px;
                            color: #9ca3af;
                            border-top: 1px solid #e5e7eb;
                            padding-top: 20px;
                            margin-top: 50px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo-title">
                            <img class="logo" src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png" alt="Torch Logo" />
                            <div class="title">
                                <h1>Torch Fellowship Church</h1>
                                <p>Tuesday Fellowship - Registration Report</p>
                            </div>
                        </div>
                        <div class="date">
                            <p>Generated: ${new Date().toLocaleString()}</p>
                        </div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <p>Total Registrations</p>
                            <h3>${stats.total}</h3>
                        </div>
                        <div class="stat-card">
                            <p>First Time Visitors</p>
                            <h3>${stats.firstTimers}</h3>
                        </div>
                        <div class="stat-card">
                            <p>Potential Volunteers</p>
                            <h3>${stats.volunteers}</h3>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Location</th>
                                <th>First Time Visitor</th>
                                <th>Wants to Volunteer</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${registrations.map(reg => `
                                <tr>
                                    <td>${new Date(reg.createdAt).toLocaleDateString()}</td>
                                    <td><strong>${reg.name}</strong></td>
                                    <td>${reg.email || 'N/A'}</td>
                                    <td>${reg.contact}</td>
                                    <td>${reg.placeOfResidence}</td>
                                    <td>
                                        <span class="badge ${reg.isFirstTimeVisitor ? 'badge-yes' : 'badge-no'}">
                                            ${reg.isFirstTimeVisitor ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge ${reg.wishesToVolunteer ? 'badge-yes' : 'badge-no'}">
                                            ${reg.wishesToVolunteer ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Torch Fellowship Church. All rights reserved.</p>
                    </div>

                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() {
                                window.close();
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="admin-glass p-6 rounded-2xl flex items-center space-x-4 border border-brand-gold/20">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <ICONS.Users className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Total Registrations</p>
                        <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
                    </div>
                </div>
                <div className="admin-glass p-6 rounded-2xl flex items-center space-x-4 border border-brand-gold/20">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                        <ICONS.UserPlus className="h-8 w-8 text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">First Time Visitors</p>
                        <h3 className="text-3xl font-bold text-white">{stats.firstTimers}</h3>
                    </div>
                </div>
                <div className="admin-glass p-6 rounded-2xl flex items-center space-x-4 border border-brand-gold/20">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                        <ICONS.HeartHandshake className="h-8 w-8 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Potential Volunteers</p>
                        <h3 className="text-3xl font-bold text-white">{stats.volunteers}</h3>
                    </div>
                </div>
            </div>

            <div className="admin-glass p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Registrations</h2>
                    {registrations.length > 0 && (
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(249,115,22,0.25)] hover:shadow-[0_4px_18px_rgba(249,115,22,0.4)]"
                        >
                            <ICONS.FileText className="w-4 h-4" />
                            Export PDF
                        </button>
                    )}
                </div>
                
                {isLoading ? <div className="flex justify-center py-12"><Spinner /></div> : (
                    <div className="overflow-x-auto">
                        {registrations.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-700/50">
                                        <th className="py-3 px-4 font-semibold text-gray-400">Date</th>
                                        <th className="py-3 px-4 font-semibold text-gray-400">Name</th>
                                        <th className="py-3 px-4 font-semibold text-gray-400">Email</th>
                                        <th className="py-3 px-4 font-semibold text-gray-400">Contact</th>
                                        <th className="py-3 px-4 font-semibold text-gray-400">Location</th>
                                        <th className="py-3 px-4 font-semibold text-gray-400 text-center">First Time</th>
                                        <th className="py-3 px-4 font-semibold text-gray-400 text-center">Volunteer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.map(reg => (
                                        <tr key={reg.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 text-sm text-gray-300">
                                                {new Date(reg.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4 font-medium text-white">{reg.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-300">{reg.email || 'N/A'}</td>
                                            <td className="py-3 px-4 text-sm text-gray-300">{reg.contact}</td>
                                            <td className="py-3 px-4 text-sm text-gray-300">{reg.placeOfResidence}</td>
                                            <td className="py-3 px-4 text-center">
                                                {reg.isFirstTimeVisitor ? (
                                                    <span className="inline-block px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs">Yes</span>
                                                ) : (
                                                    <span className="inline-block px-2 py-1 rounded bg-gray-500/20 text-gray-400 text-xs">No</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {reg.wishesToVolunteer ? (
                                                    <span className="inline-block px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs">Yes</span>
                                                ) : (
                                                    <span className="inline-block px-2 py-1 rounded bg-gray-500/20 text-gray-400 text-xs">No</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <ICONS.Users className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                                <p className="text-gray-400">No registrations found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTuesdayFellowship;
