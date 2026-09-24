import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../services/api';

export const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await api.get('/collections');
        if (res.data.success) {
          setCollections(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load collections:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, []);

  return (
    <div className="bg-[#FAF9F5] pt-32 pb-24 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto pb-16 space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Seasonal Lookbooks</span>
          <h1 className="font-editorial text-4xl sm:text-6xl font-normal text-velora-black">
            The Collections
          </h1>
          <p className="text-xs font-light text-velora-muted leading-relaxed">
            Curated narratives in materiality, architectural structure, and tonal depth. Explore seasonal releases and permanent archive edits.
          </p>
        </div>

        {/* Collections Stack */}
        <div className="space-y-20">
          {collections.map((col, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={col._id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Image */}
                <div className={`lg:col-span-7 ${isEven ? '' : 'lg:order-2'}`}>
                  <Link to={`/shop?collection=${col.slug}`} className="block group aspect-[16/10] bg-stone-300 overflow-hidden shadow-2xl">
                    <img
                      src={col.heroImage}
                      alt={col.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                </div>

                {/* Content */}
                <div className={`lg:col-span-5 space-y-4 ${isEven ? '' : 'lg:order-1'}`}>
                  <span className="text-xs uppercase tracking-[0.25em] text-velora-champagne font-medium">
                    {col.season}
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black">
                    {col.name}
                  </h2>
                  <p className="text-sm font-editorial italic text-stone-700">
                    "{col.tagline}"
                  </p>
                  <p className="text-xs font-light text-stone-600 leading-relaxed pt-1">
                    {col.description}
                  </p>
                  <div className="pt-4">
                    <Link
                      to={`/shop?collection=${col.slug}`}
                      className="inline-flex items-center space-x-2 px-8 py-4 bg-velora-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors shadow-lg"
                    >
                      <span>Explore {col.name.split('—')[0]}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
