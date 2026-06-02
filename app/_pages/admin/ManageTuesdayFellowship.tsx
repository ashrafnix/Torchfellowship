'use client';

import React, { useState } from 'react';
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
    const [isExporting, setIsExporting] = useState(false);

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
        setIsExporting(true);
        // Build the printable HTML document
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tuesday Fellowship Registration Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1f2937;
      background: #ffffff;
      padding: 24px 16px;
      font-size: 13px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      border-bottom: 3px solid #f97316;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .logo-title { display: flex; align-items: center; gap: 12px; }
    .logo { height: 44px; width: auto; }
    .title h1 { font-size: 20px; color: #111827; font-weight: 700; }
    .title p  { font-size: 12px; color: #6b7280; margin-top: 2px; }
    .gen-date { font-size: 11px; color: #6b7280; text-align: right; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }
    .stat-label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .stat-value { font-size: 22px; font-weight: 700; color: #111827; }
    .table-wrap { width: 100%; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 24px; }
    th {
      background: #f3f4f6;
      border-bottom: 2px solid #e5e7eb;
      color: #374151;
      font-weight: 600;
      text-align: left;
      padding: 9px 10px;
      white-space: nowrap;
    }
    td { border-bottom: 1px solid #e5e7eb; padding: 9px 10px; color: #4b5563; word-break: break-word; }
    tr:nth-child(even) td { background: #f9fafb; }
    .card-list { display: none; }
    .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 12px; background: #ffffff; }
    .card-name { font-weight: 700; font-size: 14px; color: #111827; margin-bottom: 6px; }
    .card-row  { display: flex; justify-content: space-between; font-size: 11px; color: #4b5563; margin-bottom: 3px; }
    .card-label{ color: #9ca3af; margin-right: 8px; }
    .badge { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 600; }
    .badge-yes { background: #d1fae5; color: #065f46; }
    .badge-no  { background: #f3f4f6; color: #374151; }
    .footer { text-align: center; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 32px; }
    /* Mobile: card layout on small screens */
    @media screen and (max-width: 599px) {
      .table-wrap { display: none; }
      .card-list  { display: block; }
    }
    /* Print: always use table, hide cards */
    @media print {
      body { padding: 20px; font-size: 11px; }
      .card-list { display: none !important; }
      .table-wrap { display: block !important; }
      table { page-break-inside: auto; }
      tr { page-break-inside: avoid; page-break-after: auto; }
      thead { display: table-header-group; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-title">
      <img class="logo" src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png" alt="Torch Fellowship Logo" />
      <div class="title">
        <h1>Torch Fellowship Church</h1>
        <p>Tuesday Fellowship &mdash; Registration Report</p>
      </div>
    </div>
    <div class="gen-date"><p>Generated: ${new Date().toLocaleString()}</p></div>
  </div>

  <div class="stats-grid">
    <div class="stat-card"><div class="stat-label">Total</div><div class="stat-value">${stats.total}</div></div>
    <div class="stat-card"><div class="stat-label">First Timers</div><div class="stat-value">${stats.firstTimers}</div></div>
    <div class="stat-card"><div class="stat-label">Volunteers</div><div class="stat-value">${stats.volunteers}</div></div>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Date</th><th>Name</th><th>Email</th><th>Contact</th><th>Location</th><th>First Timer</th><th>Volunteer</th>
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
          <td><span class="badge ${reg.isFirstTimeVisitor ? 'badge-yes' : 'badge-no'}">${reg.isFirstTimeVisitor ? 'Yes' : 'No'}</span></td>
          <td><span class="badge ${reg.wishesToVolunteer ? 'badge-yes' : 'badge-no'}">${reg.wishesToVolunteer ? 'Yes' : 'No'}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="card-list">
    ${registrations.map(reg => `
    <div class="card">
      <div class="card-name">${reg.name}</div>
      <div class="card-row"><span class="card-label">Date</span><span>${new Date(reg.createdAt).toLocaleDateString()}</span></div>
      <div class="card-row"><span class="card-label">Email</span><span>${reg.email || 'N/A'}</span></div>
      <div class="card-row"><span class="card-label">Contact</span><span>${reg.contact}</span></div>
      <div class="card-row"><span class="card-label">Location</span><span>${reg.placeOfResidence}</span></div>
      <div class="card-row">
        <span class="card-label">First Timer</span>
        <span class="badge ${reg.isFirstTimeVisitor ? 'badge-yes' : 'badge-no'}">${reg.isFirstTimeVisitor ? 'Yes' : 'No'}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Volunteer</span>
        <span class="badge ${reg.wishesToVolunteer ? 'badge-yes' : 'badge-no'}">${reg.wishesToVolunteer ? 'Yes' : 'No'}</span>
      </div>
    </div>`).join('')}
  </div>

  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} Torch Fellowship Church. All rights reserved.</p>
  </div>
</body>
</html>`;

        const iframeId = '__tf_print_frame__';
        let iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = iframeId;
            iframe.style.cssText =
                'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;opacity:0;pointer-events:none;';
            document.body.appendChild(iframe);
        }

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) { setIsExporting(false); return; }

        doc.open();
        doc.write(htmlContent);
        doc.close();

        const iframeWin = iframe.contentWindow;
        if (!iframeWin) { setIsExporting(false); return; }

        const doPrint = () => {
            setIsExporting(false);
            iframeWin.focus();
            iframeWin.print();
        };

        const img = doc.querySelector('img');
        if (img && !img.complete) {
            const timeout = setTimeout(doPrint, 1500);
            img.onload  = () => { clearTimeout(timeout); doPrint(); };
            img.onerror = () => { clearTimeout(timeout); doPrint(); };
        } else {
            setTimeout(doPrint, 100);
        }
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
                            disabled={isExporting}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(249,115,22,0.25)] hover:shadow-[0_4px_18px_rgba(249,115,22,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isExporting ? <Spinner size="sm" /> : <ICONS.FileText className="w-4 h-4" />}
                            {isExporting ? 'Generating...' : 'Export PDF'}
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
