import React, { useState } from 'react';
import { mockTransactions } from '../../services/mockData';
import {
  CreditCard,
  ShieldCheck,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink
} from 'lucide-react';

const PaymentHistoryPage = () => {
  const [transactions, setTransactions] = useState(mockTransactions);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" /> Bank-Grade Escrow Ledger
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white">Payment & Escrow Transactions</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Complete transparent record of milestone escrow deposits, approvals, and releases.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 block">Total Funded in Escrow</span>
          <span className="text-2xl font-display font-extrabold text-white">$4,500.00</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
          <span className="text-xs text-emerald-400 font-semibold block">Released Payouts</span>
          <span className="text-2xl font-display font-extrabold text-emerald-400">$1,500.00</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-primary-500/30 bg-primary-950/20 space-y-1">
          <span className="text-xs text-primary-300 font-semibold block">Locked Escrow Hold</span>
          <span className="text-2xl font-display font-extrabold text-white">$3,000.00</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-display">Transaction History</h3>
          <span className="text-xs text-slate-400">{transactions.length} Verified Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Contract / Milestone</th>
                <th className="p-4">Gateway / Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-dark-800/40 transition">
                  <td className="p-4 font-mono text-[11px] text-slate-400">
                    {t.gatewayOrderId}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{t.contractTitle}</span>
                    <span className="text-[11px] text-slate-400">{t.milestoneTitle}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-dark-800 text-slate-300 border border-white/10">
                      {t.paymentGateway} • {t.paymentMethod}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-bold font-display text-white">
                      ${t.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <a
                      href={t.receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
