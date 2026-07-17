import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface PaymentSectionProps {
  orderDetails: { name: string; mobile: string; dish: string; quantity: number; total: number } | null;
  onConfirm: () => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({ orderDetails, onConfirm }) => {
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  if (!orderDetails) return null;

  const upiId = "tiffinhouse@upi";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=${upiId}&pn=TiffinHouse&am=${orderDetails.total}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 md:px-6 max-w-3xl pb-24"
    >
      <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-foreground text-background p-6 text-center">
          <h3 className="text-2xl font-bold font-['Poppins']">Complete Your Payment</h3>
          <p className="text-background/80 mt-1">Amount to pay: ₹{orderDetails.total}</p>
        </div>

        <div className="p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center">
          {/* QR Code Column */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-border mb-4">
              <img src={qrUrl} alt="UPI QR Code" className="w-[200px] h-[200px]" />
            </div>
            <p className="text-sm font-semibold text-foreground">Scan with any UPI app</p>
            <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-muted rounded-full">
              <span className="font-mono text-sm">{upiId}</span>
              <button 
                onClick={handleCopy}
                className="text-primary hover:text-primary/80 transition-colors"
                title="Copy UPI ID"
              >
                {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Instructions Column */}
          <div className="flex-grow space-y-6">
            <ol className="space-y-4 text-sm md:text-base text-foreground">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">1</span>
                <span>Open any UPI app (GPay, PhonePe, Paytm, etc.)</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">2</span>
                <span>Scan the QR code or enter UPI ID</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">3</span>
                <span>Pay exactly <strong className="text-primary">₹{orderDetails.total}</strong></span>
              </li>
            </ol>

            <div className="pt-4 border-t border-border">
              <label className="text-sm font-semibold text-foreground mb-2 block">Transaction ID (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 1234567890"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>

            <button
              onClick={onConfirm}
              className="w-full py-4 bg-accent text-accent-foreground text-lg font-bold rounded-xl shadow-lg hover:bg-accent/90 transition-all active:scale-95"
              data-cursor="hover"
            >
              I Have Paid ₹{orderDetails.total}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
