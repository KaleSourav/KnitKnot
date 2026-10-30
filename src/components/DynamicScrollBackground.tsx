/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export function DynamicScrollBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none opacity-40">
      {/* Soft pastel ambient glow orbs */}
      <div className="absolute top-10 left-[10%] w-72 h-72 rounded-full bg-[#F5C4D5]/30 blur-3xl animate-float" />
      <div className="absolute top-[40%] right-[8%] w-80 h-80 rounded-full bg-[#F5DD91]/25 blur-3xl animate-float-alt" />
      <div className="absolute bottom-20 left-[15%] w-96 h-96 rounded-full bg-[#C5E7D4]/20 blur-3xl animate-float" />
    </div>
  );
}

export default DynamicScrollBackground;

