import React from 'react';

export const ShippingPolicyPage = () => {
  return (
    <div className="bg-[#FAF9F5] pt-32 pb-24 font-sans text-xs font-light text-stone-700 leading-relaxed">
      <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-8">
        <div className="text-center space-y-2 pb-6 border-b border-velora-border">
          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Logistics & Care</span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-velora-black">
            Complimentary Shipping & Returns
          </h1>
        </div>

        <section className="space-y-3 bg-white p-6 md:p-8 border border-velora-border">
          <h3 className="font-editorial text-2xl text-velora-black font-normal">Domestic Delivery in India</h3>
          <p>
            All consignments exceeding ₹2,999 qualify for complimentary express air shipping across India. Orders below this threshold incur a flat ₹250 insured handling fee.
          </p>
          <p>
            Standard transit time is 2 to 4 business days. Signature confirmation is mandatory upon delivery to ensure maximum garment security.
          </p>
        </section>

        <section className="space-y-3 bg-white p-6 md:p-8 border border-velora-border">
          <h3 className="font-editorial text-2xl text-velora-black font-normal">14-Day Concierge Returns & Exchanges</h3>
          <p>
            We accommodate complimentary size exchanges and full refunds within 14 calendar days of consignment arrival.
          </p>
          <p>
            Garments must be returned in their original condition: unworn, unaltered, unwashed, with all security ribbons, spare buttons, and presentation boxes intact.
          </p>
        </section>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage = () => {
  return (
    <div className="bg-[#FAF9F5] pt-32 pb-24 font-sans text-xs font-light text-stone-700 leading-relaxed">
      <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-8">
        <div className="text-center space-y-2 pb-6 border-b border-velora-border">
          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Governance</span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-velora-black">
            Privacy Governance
          </h1>
        </div>

        <div className="bg-white p-6 md:p-8 border border-velora-border space-y-4">
          <h3 className="font-editorial text-2xl text-velora-black font-normal">Client Confidentiality</h3>
          <p>
            LEO Atelier upholds the strictest standards of data confidentiality. We collect personal identifying details (name, delivery address, phone number, and payment references) solely for order fulfillment and bespoke concierge communications.
          </p>
          <p>
            We never sell, lease, or distribute private client profiles to third-party marketing brokers. Financial credentials are encrypted with 256-bit SSL protocols and processed via PCI-DSS Level 1 certified gateways.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage = () => {
  return (
    <div className="bg-[#FAF9F5] pt-32 pb-24 font-sans text-xs font-light text-stone-700 leading-relaxed">
      <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-8">
        <div className="text-center space-y-2 pb-6 border-b border-velora-border">
          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Legal Terms</span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-velora-black">
            Terms of Service
          </h1>
        </div>

        <div className="bg-white p-6 md:p-8 border border-velora-border space-y-4">
          <h3 className="font-editorial text-2xl text-velora-black font-normal">Terms of Engagement</h3>
          <p>
            By accessing the LEO platform, you agree to our standard terms of service. All editorial imagery, typography compositions, product descriptions, and designs are the exclusive intellectual property of LEO House of Fashion.
          </p>
          <p>
            Prices are listed in Indian Rupees (INR) and are inclusive of statutory GST. We reserve the right to limit order quantities on limited-edition archival releases.
          </p>
        </div>
      </div>
    </div>
  );
};
