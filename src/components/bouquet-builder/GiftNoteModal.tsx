import React, { useState, useEffect } from 'react';
import { CARD_STYLES } from '../../data/bouquetFlowers';
import { X } from 'lucide-react';

interface GiftNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecipient: string;
  initialMessage: string;
  initialSender: string;
  initialStyleId: string;
  onSaveNote: (note: {
    recipient: string;
    message: string;
    sender: string;
    cardStyle: string;
    isTucked: boolean;
  }) => void;
}

export const GiftNoteModal: React.FC<GiftNoteModalProps> = ({
  isOpen,
  onClose,
  initialRecipient,
  initialMessage,
  initialSender,
  initialStyleId,
  onSaveNote,
}) => {
  const [recipient, setRecipient] = useState(initialRecipient);
  const [message, setMessage] = useState(initialMessage);
  const [sender, setSender] = useState(initialSender);

  useEffect(() => {
    if (isOpen) {
      setRecipient(initialRecipient);
      setMessage(initialMessage || 'Love, Annie');
      setSender(initialSender);
    }
  }, [isOpen, initialRecipient, initialMessage, initialSender]);

  if (!isOpen) return null;

  const handleTuckIn = () => {
    onSaveNote({
      recipient: recipient.trim(),
      message: message.trim(),
      sender: sender.trim(),
      cardStyle: 'scallop',
      isTucked: message.trim().length > 0,
    });
    onClose();
  };

  const handleClear = () => {
    setMessage('');
    setRecipient('');
    setSender('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Pink Modal Dialog (Petal Post Reference Style) */}
      <div
        className="relative w-full max-w-md sm:max-w-lg rounded-[36px] p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.25)] font-['Fredoka'] z-10 animate-scaleIn border border-white/60"
        style={{
          background: 'linear-gradient(to bottom, #FCE7F3 0%, #FBCFE8 100%)',
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Circular Close Button (top-right) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-left mb-4 pr-10">
          <h3 className="font-['Fredoka'] font-black text-xl sm:text-2xl text-[#811B2B] tracking-tight">
            A little note. A lot of love.
          </h3>
          <p className="font-['Fredoka'] text-xs sm:text-[13px] text-[#811B2B]/75 mt-0.5">
            Write on the card with your pen, or type below.
          </p>
        </div>

        {/* ── Central Scalloped Greeting Card with Animated Pen/Hand ── */}
        <div className="relative w-full bg-[#FFFDF9] rounded-2xl p-6 sm:p-8 shadow-md border-2 border-[#F43F5E] mb-4 min-h-[190px] sm:min-h-[220px] flex flex-col justify-between overflow-hidden">
          {/* Scalloped decorative border SVG around card perimeter */}
          <div className="absolute inset-2 border-2 border-dashed border-[#F43F5E]/40 rounded-xl pointer-events-none" />

          {/* Top recipient greeting */}
          <div className="relative z-10 flex justify-between items-center text-xs">
            <span className="font-['Fredoka'] font-bold text-[#811B2B]">
              {recipient ? `For: ${recipient}` : 'For someone special ♡'}
            </span>
            <span className="text-xs text-[#F43F5E]">💌</span>
          </div>

          {/* Customer's handwritten message */}
          <div className="relative z-10 my-auto py-2">
            <p className="font-['Satisfy'] text-2xl sm:text-3xl text-[#811B2B] leading-relaxed drop-shadow-xs italic">
              {message || 'Love Annie'}
            </p>
          </div>

          {/* Sender sign-off */}
          <div className="relative z-10 text-right">
            <span className="font-['Satisfy'] text-base text-[#811B2B]/80 italic">
              {sender ? `— ${sender}` : 'xoxo'}
            </span>
          </div>

          {/* Photorealistic White Gloved Hand holding fountain pen writing on card */}
          <div
            className="absolute z-20 pointer-events-none drop-shadow-xl transition-transform duration-300"
            style={{
              bottom: '-10px',
              right: '-10px',
              width: '130px',
              height: '130px',
            }}
          >
            <img
              src="/boutique/gloved-hand-pen.png"
              alt="Gloved hand with fountain pen"
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          </div>
        </div>

        {/* ── Input Box: "Your message" + "Tuck it in →" Button ── */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-[#811B2B] uppercase tracking-wider block text-left">
            Your message:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="For you, just because x"
              maxLength={70}
              className="flex-1 bg-white/95 border border-[#811B2B]/25 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#811B2B] shadow-inner"
            />
            <button
              type="button"
              onClick={handleTuckIn}
              className="px-5 py-2.5 rounded-full bg-[#3D2529] hover:bg-[#231518] text-white font-['Fredoka'] font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Tuck it in →
            </button>
          </div>

          {/* Secondary inputs & clear link */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-[#811B2B]/70 hover:text-[#811B2B] underline cursor-pointer"
            >
              Clear handwriting
            </button>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="To (optional)"
                className="w-24 bg-white/80 border border-gray-300 rounded-lg px-2 py-1 text-[11px] text-gray-700"
              />
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="From (optional)"
                className="w-24 bg-white/80 border border-gray-300 rounded-lg px-2 py-1 text-[11px] text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
