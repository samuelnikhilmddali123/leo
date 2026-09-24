import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Feather, ShieldCheck } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="bg-[#FAF9F5] pt-32 pb-24 font-sans">
      <div className="max-w-5xl mx-auto px-6 md:px-12 space-y-20">
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full border border-black/10 p-1 flex items-center justify-center mx-auto shadow-sm">
            <img src="/logo.png" alt="LEO Crest" className="w-full h-full object-contain rounded-full" />
          </div>
          <span className="text-xs uppercase tracking-[0.35em] text-velora-champagne font-medium">The House of LEO</span>
          <h1 className="font-editorial text-4xl sm:text-6xl font-normal text-velora-black">
            Defined by Power & Precision
          </h1>
          <p className="text-sm font-light text-stone-600 max-w-xl mx-auto leading-relaxed pt-2">
            A sanctuary of sovereign luxury, architectural silhouettes, and supreme materiality for the modern international wardrobe.
          </p>
        </div>

        {/* Hero Image */}
        <div className="aspect-[16/9] bg-stone-300 overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=2560&q=95"
            alt="LEO Bespoke Tailoring Atelier"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Philosophy Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-xs font-light text-stone-700 leading-relaxed">
          <div className="space-y-4">
            <h3 className="font-editorial text-2xl text-velora-black font-normal">Sovereign Restraint</h3>
            <p>
              Embodied by the crest of the lion, LEO returns to the foundational essence of sartorial excellence: proportional balance, tactile indulgence, and uncompromising construction.
            </p>
            <p>
              We design garments for individuals who express authority through quiet poise. Our pieces do not demand attention—they command it through immaculate lines and exquisite fabrics.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-editorial text-2xl text-velora-black font-normal">Material Integrity</h3>
            <p>
              Every garment begins with our global fabric sourcing network: 22-momme pure Mulberry silk from historical mills, 4-ply Grade-A cashmere ethically combed from Mongolian Capra Hircus goats, and virgin tropical wool woven in Biella, Italy.
            </p>
            <p>
              Natural buffalo horn buttons, mother-of-pearl fastenings, and unbleached cupro linings ensure every tactile touchpoint feels extraordinary against the skin.
            </p>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-velora-border">
          <div className="space-y-2 text-center p-6 bg-white border border-velora-border">
            <Feather className="w-6 h-6 text-velora-champagne mx-auto mb-2" />
            <h4 className="font-editorial text-lg text-velora-black font-normal">Bespoke Drape</h4>
            <p className="text-xs text-stone-600 font-light">
              True bias-cuts and hand-padded lapels that adapt naturally to human anatomy over time.
            </p>
          </div>
          <div className="space-y-2 text-center p-6 bg-white border border-velora-border">
            <Sparkles className="w-6 h-6 text-velora-champagne mx-auto mb-2" />
            <h4 className="font-editorial text-lg text-velora-black font-normal">Zero Compromise</h4>
            <p className="text-xs text-stone-600 font-light">
              Limited-edition capsule releases crafted with precision to prevent mass-production waste.
            </p>
          </div>
          <div className="space-y-2 text-center p-6 bg-white border border-velora-border">
            <ShieldCheck className="w-6 h-6 text-velora-champagne mx-auto mb-2" />
            <h4 className="font-editorial text-lg text-velora-black font-normal">Heirloom Longevity</h4>
            <p className="text-xs text-stone-600 font-light">
              Designed to transcend fleeting seasons and maintain immaculate form across decades.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 pt-6">
          <h3 className="font-editorial text-3xl font-normal text-velora-black">Experience the Atelier</h3>
          <p className="text-xs text-stone-600 font-light">Discover the newest Autumn/Winter '26 pieces.</p>
          <div>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-velora-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors shadow-lg"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
