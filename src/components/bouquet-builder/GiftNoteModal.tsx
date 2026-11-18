import React, { useState, useEffect } from 'react';
import { CARD_STYLES, CardStyleOption } from '../../data/bouquetFlowers';
import { X, Check, Heart, Sparkles, PenLine } from 'lucide-react';

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
  const [selectedStyleId, setSelectedStyleId] = useState(initialStyleId);

  useEffect(() => {
    if (isOpen) {
      setRecipient(initialRecipient);
      setMessage(initialMessage);
      setSender(initialSender);
      setSelectedStyleId(initialStyleId || CARD_STYLES[0].id);
    }
  }, [isOpen, initialRecipient, initialMessage, initialSender, initialStyleId]);

  if (!isOpen) return null;

  const currentStyle =
    CARD_STYLES.find((s) => s.id === selectedStyleId) || CARD_STYLES[0];

  const handleTuckIn = () => {
    onSaveNote({
      recipient: recipient.trim(),
      message: message.trim(),
      sender: sender.trim(),
      cardStyle: currentStyle.id,
      isTucked: message.trim().length > 0,
    });
    onClose();
  };

  const handleRemoveNote = () => {
    setRecipient('');
    setMessage('');
    setSender('');
    onSaveNote({
      recipient: '',
      message: '',
      sender: '',
      cardStyle: CARD_STYLES[0].id,
      isTucked: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2424]/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-lg bg-[#FAF4ED] rounded-[32px] border-[2.5px] border-[#641623] p-6 sm:p-8 shadow-[0_20px_50px_rgba(100,22,35,0.22)] font-['Fredoka'] z-10 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-note-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#641623]/20 flex items-center justify-center text-[#641623] hover:bg-[#641623]/10 active:scale-95 transition-all cursor-pointer"
          aria-label="Close note dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF5CC] border border-[#641623]/15 text-[11px] font-bold text-[#811B2B] uppercase mb-1.5">
            <Sparkles className="w-3 h-3 text-[#E5A93C]" />
            <span>Handwritten Gift Card</span>
          </div>
          <h3
            id="gift-note-title"
            className="font-bold text-2xl sm:text-3xl text-[#641623] tracking-tight"
          >
            A little note. A lot of love.
          </h3>
          <p className="text-xs sm:text-sm text-[#641623]/70 mt-0.5">
            write a sweet handwritten message to tuck inside your bouquet ♡
          </p>
        </div>

        {/* ── Scallop Greeting Card Live Preview ── */}
        <div
          style={{
            backgroundColor: currentStyle.bgHex,
            borderColor: currentStyle.borderHex,
          }}
          className="w-full rounded-2xl border-[2.5px] border-dashed p-5 sm:p-6 mb-5 shadow-xs relative overflow-hidden transition-colors duration-300 min-h-[150px] flex flex-col justify-between"
        >
          {/* Card Top: Recipient */}
          <div className="text-left font-script text-base sm:text-lg text-[#811B2B]">
            {recipient ? `Dearest ${recipient},` : 'Dearest,'}
          </div>

          {/* Card Center: Handwriting Message */}
          <div className="my-3 text-center font-script text-lg sm:text-2xl text-[#641623] leading-relaxed break-words px-2">
            {message ? (
              <span>&ldquo;{message}&rdquo;</span>
            ) : (
              <span className="opacity-35 italic font-sans text-xs">
                (Your message will appear here in sweet handwritten script...)
              </span>
            )}
          </div>

          {/* Card Bottom: Sender */}
          <div className="text-right font-script text-base sm:text-lg text-[#811B2B]">
            {sender ? `With love, ${sender}` : 'With all our love ♡'}
          </div>

          {/* Small Decorative Flower Accent on Card */}
          <div className="absolute top-2 right-2 opacity-25 pointer-events-none">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#811B2B] fill-current">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="6" r="2.5" />
              <circle cx="12" cy="18" r="2.5" />
              <circle cx="6" cy="12" r="2.5" />
              <circle cx="18" cy="12" r="2.5" />
            </svg>
          </div>
        </div>

        {/* Card Style Theme Buttons */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-[11px] font-bold text-[#641623]/70 uppercase">
            Card theme:
          </span>
          {CARD_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setSelectedStyleId(style.id)}
              style={{ backgroundColor: style.bgHex, borderColor: style.borderHex }}
              className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 transition-all cursor-pointer ${
                selectedStyleId === style.id
                  ? 'ring-2 ring-[#811B2B] scale-105 shadow-xs font-black'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>

        {/* Form Inputs */}
        <div className="space-y-3.5 text-left mb-6">
          {/* Recipient */}
          <div>
            <label className="block text-xs font-bold text-[#641623] uppercase mb-1">
              To (Recipient Name)
            </label>
            <input
              type="text"
              placeholder="e.g. Mum, Priya, Bestie..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#641623]/20 focus:border-[#811B2B] focus:outline-none text-sm text-[#641623] shadow-xs"
              maxLength={40}
            />
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#641623] uppercase">
                Your Personal Note *
              </label>
              <span className="text-[11px] font-bold text-[#641623]/60">
                {message.length} / 200
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Wishing you flowers that never fade, just like your smile! Happy Birthday!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#641623]/20 focus:border-[#811B2B] focus:outline-none text-sm text-[#641623] shadow-xs resize-none"
            />
          </div>

          {/* Sender */}
          <div>
            <label className="block text-xs font-bold text-[#641623] uppercase mb-1">
              From (Sender Name)
            </label>
            <input
              type="text"
              placeholder="e.g. Annie, Rahul, With Love..."
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#641623]/20 focus:border-[#811B2B] focus:outline-none text-sm text-[#641623] shadow-xs"
              maxLength={40}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {message.trim() && (
            <button
              type="button"
              onClick={handleRemoveNote}
              className="px-4 py-3 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer"
            >
              Remove
            </button>
          )}

          <button
            type="button"
            onClick={handleTuckIn}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-[#811B2B] text-white font-['Fredoka'] font-black text-sm uppercase tracking-wider hover:bg-[#641623] transition-all cursor-pointer shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Tuck it in ♡</span>
          </button>
        </div>
      </div>
    </div>
  );
};
