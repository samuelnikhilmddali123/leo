import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="bg-[#FAF9F5] pt-40 pb-32 font-sans flex flex-col items-center justify-center text-center px-6 min-h-[75vh]">
      <span className="text-xs uppercase tracking-[0.35em] text-velora-champagne font-medium">404 Error</span>
      <h1 className="font-editorial text-5xl sm:text-7xl font-normal text-velora-black mt-2">
        Garment Not Found
      </h1>
      <p className="text-xs font-light text-stone-600 max-w-sm mt-4 leading-relaxed">
        The archive page or editorial link you are looking for has been relocated or archived.
      </p>
      <Link
        to="/"
        className="mt-8 px-8 py-4 bg-velora-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors shadow-lg flex items-center space-x-2"
      >
        <span>Return to Atelier Home</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
