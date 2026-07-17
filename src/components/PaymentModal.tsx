import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, Copy, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

interface Props {
  orderId: number;
  total: number;
  onSuccess: () => void;
  onClose: () => void;
}

const UPI_ID = 'nakkaomshankar@axl';
const UPI_NAME = 'Tiffin House';

export function PaymentModal({ orderId, total, onSuccess, onClose }: Props) {
  const [step, setStep] = useState<'qr' | 'utr' | 'submitting' | 'success' | 'error'>('qr');
  const [utr, setUtr] = useState('');
  const [utrError, setUtrError] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [copied, setCopied] = useState<'upi' | 'amount' | null>(null);

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${total}&cu=INR&tn=${encodeURIComponent(`Order #${orderId}`)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}&margin=8&color=000000&bgcolor=ffffff`;

  function copyText(val: string, which: 'upi' | 'amount') {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  async function submitUTR() {
    const cleaned = utr.trim();
    if (!cleaned) { setUtrError('Please enter your UTR / Transaction ID'); return; }
    if (cleaned.length < 10) { setUtrError('UTR must be at least 10 characters'); return; }
    setUtrError('');
    setStep('submitting');
    try {
      await api.submitUTR({ order_id: orderId, utr_number: cleaned });
      setStep('success');
      setTimeout(onSuccess, 2000);
    } catch (err: any) {
      setErrMsg(err.message || 'Something went wrong. Please contact support.');
      setStep('error');
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          className="relative bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-sm overflow-hidden"
          initial={{ y: '100%', scale: 0.95 }} animate={{ y: 0, scale: 1 }}
          exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
            <div>
              <h3 className="text-lg font-black font-['Poppins']">
                {step === 'qr' ? '💳 Pay via UPI' : step === 'utr' ? '✅ Confirm Payment' : step === 'success' ? '🎉 Order Confirmed!' : step === 'error' ? '❌ Submission Failed' : 'Verifying…'}
              </h3>
              <p className="text-xs text-muted-foreground">Order #{orderId}</p>
            </div>
            {step !== 'success' && step !== 'submitting' && (
              <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="px-5 py-5">
            {/* ─── STEP 1: QR + UPI ─── */}
            {step === 'qr' && (
              <div className="space-y-4">
                {/* Amount */}
                <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3">
                  <span className="text-sm text-muted-foreground font-medium">Amount to pay</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-primary">₹{total}</span>
                    <button onClick={() => copyText(String(total), 'amount')}
                      className="p-1 rounded-lg hover:bg-primary/10 transition-colors" title="Copy amount">
                      <Copy className="w-3.5 h-3.5 text-primary" />
                    </button>
                    {copied === 'amount' && <span className="text-xs text-green-600 font-medium">Copied!</span>}
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white p-2 rounded-2xl border border-border shadow-sm">
                    <img
                      src={qrUrl}
                      alt="UPI QR Code"
                      className="w-[180px] h-[180px] sm:w-[210px] sm:h-[210px] block"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Scan with any UPI app</p>
                </div>

                {/* UPI ID */}
                <div className="bg-muted rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">UPI ID</p>
                    <p className="font-bold text-foreground text-sm font-mono tracking-wide">{UPI_ID}</p>
                  </div>
                  <button onClick={() => copyText(UPI_ID, 'upi')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shrink-0">
                    <Copy className="w-3 h-3" />
                    {copied === 'upi' ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                {/* Accepted apps */}
                <div className="flex items-center gap-2 justify-center flex-wrap">
                  {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'].map(app => (
                    <span key={app} className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">{app}</span>
                  ))}
                </div>

                {/* Warning */}
                <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                    After paying, you <strong>must enter your UTR / Transaction ID</strong> to confirm your order.
                  </p>
                </div>

                <button
                  onClick={() => setStep('utr')}
                  className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-sm"
                >
                  I've Paid — Enter UTR →
                </button>
              </div>
            )}

            {/* ─── STEP 2: UTR Entry ─── */}
            {step === 'utr' && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-xs text-green-800 dark:text-green-200 space-y-1">
                  <p className="font-bold">✅ Paid to: {UPI_ID}</p>
                  <p>Amount: <strong>₹{total}</strong> • Order <strong>#{orderId}</strong></p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground block">
                    UTR / Transaction Reference Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={utr}
                    onChange={e => { setUtr(e.target.value.toUpperCase()); setUtrError(''); }}
                    placeholder="e.g. 412345678901"
                    maxLength={30}
                    className={`w-full px-4 py-3 bg-background border rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${utrError ? 'border-red-400' : 'border-input'}`}
                    autoFocus
                  />
                  {utrError && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {utrError}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Find it in your UPI app under transaction history (usually 12-digit number)
                  </p>
                </div>

                <button
                  onClick={submitUTR}
                  className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all text-sm"
                >
                  Confirm Payment
                </button>
                <button
                  onClick={() => setStep('qr')}
                  className="w-full py-2.5 border border-input text-sm font-semibold rounded-xl hover:bg-muted transition-colors"
                >
                  ← Back to QR
                </button>
              </div>
            )}

            {/* ─── STEP 3: Submitting ─── */}
            {step === 'submitting' && (
              <div className="text-center py-8 space-y-3">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <p className="font-bold text-foreground">Submitting your UTR…</p>
                <p className="text-sm text-muted-foreground">Please wait</p>
              </div>
            )}

            {/* ─── SUCCESS ─── */}
            {step === 'success' && (
              <div className="text-center py-8 space-y-3">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                </motion.div>
                <h4 className="text-xl font-black text-green-600">Order Placed!</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your UTR has been submitted. We'll confirm your order shortly after verifying the payment.
                </p>
              </div>
            )}

            {/* ─── ERROR ─── */}
            {step === 'error' && (
              <div className="text-center py-6 space-y-4">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <p className="font-bold text-red-600">Submission Failed</p>
                <p className="text-sm text-muted-foreground">{errMsg}</p>
                <button onClick={() => setStep('utr')}
                  className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl">
                  Try Again
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
