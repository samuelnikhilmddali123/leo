import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const SizeGuideModal = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState('in'); // 'in' or 'cm'

  if (!isOpen) return null;

  const sizeTableInches = [
    { size: 'XS', chest: '34 - 36', waist: '28 - 30', hips: '35 - 37', length: '27.5' },
    { size: 'S', chest: '36 - 38', waist: '30 - 32', hips: '37 - 39', length: '28.0' },
    { size: 'M', chest: '38 - 40', waist: '32 - 34', hips: '39 - 41', length: '28.5' },
    { size: 'L', chest: '40 - 42', waist: '34 - 36', hips: '41 - 43', length: '29.0' },
    { size: 'XL', chest: '42 - 44', waist: '36 - 38', hips: '43 - 45', length: '29.5' },
    { size: 'XXL', chest: '44 - 46', waist: '38 - 40', hips: '45 - 47', length: '30.0' },
  ];

  const sizeTableCm = [
    { size: 'XS', chest: '86 - 91', waist: '71 - 76', hips: '89 - 94', length: '70' },
    { size: 'S', chest: '91 - 96', waist: '76 - 81', hips: '94 - 99', length: '71' },
    { size: 'M', chest: '96 - 101', waist: '81 - 86', hips: '99 - 104', length: '72' },
    { size: 'L', chest: '101 - 106', waist: '86 - 91', hips: '104 - 109', length: '73.5' },
    { size: 'XL', chest: '106 - 111', waist: '91 - 96', hips: '109 - 114', length: '75' },
    { size: 'XXL', chest: '111 - 116', waist: '96 - 101', hips: '114 - 119', length: '76' },
  ];

  const currentTable = unit === 'in' ? sizeTableInches : sizeTableCm;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-[#FAF9F5] text-velora-dark w-full max-w-2xl shadow-2xl p-6 md:p-10 z-10 border border-velora-border max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-velora-dark hover:text-velora-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[11px] text-velora-muted uppercase tracking-widest">Tailoring Reference</span>
          <h2 className="font-editorial text-2xl md:text-3xl font-normal text-velora-black mt-1">
            Bespoke Sizing & Measurements
          </h2>
          <p className="text-xs font-light text-velora-muted mt-2">
            LEO garments are cut with modern architectural proportions. For an oversized fit, choose your standard size; for a closer silhouette, size down.
          </p>

          {/* Unit Toggle */}
          <div className="mt-6 flex items-center space-x-2">
            <span className="text-xs uppercase tracking-widest text-velora-muted mr-2">Unit:</span>
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 text-xs uppercase font-medium border transition-colors ${
                unit === 'in' ? 'bg-velora-black text-white border-velora-black' : 'bg-white border-velora-border text-velora-dark'
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs uppercase font-medium border transition-colors ${
                unit === 'cm' ? 'bg-velora-black text-white border-velora-black' : 'bg-white border-velora-border text-velora-dark'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>

          {/* Size Chart Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EAE6DF] text-velora-black uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Chest ({unit})</th>
                  <th className="py-3 px-4">Waist ({unit})</th>
                  <th className="py-3 px-4">Hips ({unit})</th>
                  <th className="py-3 px-4">Length ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-velora-border">
                {currentTable.map((row) => (
                  <tr key={row.size} className="hover:bg-stone-100/60 font-light">
                    <td className="py-3 px-4 font-semibold text-velora-black">{row.size}</td>
                    <td className="py-3 px-4">{row.chest}</td>
                    <td className="py-3 px-4">{row.waist}</td>
                    <td className="py-3 px-4">{row.hips}</td>
                    <td className="py-3 px-4">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-4 bg-white border border-velora-border text-xs text-velora-muted space-y-2">
            <p className="font-semibold text-velora-black uppercase tracking-wider">How to Measure</p>
            <p><strong className="text-velora-dark">Chest:</strong> Measure under the arms at the fullest point around the chest.</p>
            <p><strong className="text-velora-dark">Waist:</strong> Measure around the natural waistline, keeping tape comfortably loose.</p>
            <p><strong className="text-velora-dark">Hips:</strong> Measure around the widest part of your hips and seat.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
