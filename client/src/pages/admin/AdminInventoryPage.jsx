import React, { useState, useEffect } from 'react';
import { Search, Save, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

export const AdminInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const { success, error } = useToast();

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/products?limit=100');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (productId, variantIdx, newStock) => {
    setProducts(prev =>
      prev.map(p => {
        if (p._id !== productId) return p;
        const updatedVariants = [...p.variants];
        updatedVariants[variantIdx] = {
          ...updatedVariants[variantIdx],
          stock: Math.max(0, Number(newStock) || 0),
        };
        const newTotal = updatedVariants.reduce((acc, v) => acc + v.stock, 0);
        return {
          ...p,
          variants: updatedVariants,
          totalStock: newTotal,
          inStock: newTotal > 0,
        };
      })
    );
  };

  const handleSaveProductInventory = async (product) => {
    setSavingId(product._id);
    try {
      const res = await api.put(`/products/${product._id}/inventory`, {
        variants: product.variants,
      });
      if (res.data.success) {
        success(`Inventory saved for "${product.title}" (${res.data.data.totalStock} units)`);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update inventory');
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Variant Inventory Matrix" subtitle="Live stock per SKU, size, and colorway with instant save capabilities.">
      <div className="space-y-6 font-sans text-xs">
        <div className="flex items-center justify-between">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or SKU..."
              className="bg-[#181818] border border-velora-borderDark py-2 px-3 pl-9 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-velora-champagne w-64"
            />
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={fetchInventory}
            className="px-4 py-2 bg-white/10 text-velora-champagne hover:bg-white/20 uppercase tracking-wider text-[11px] font-medium flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Inventory</span>
          </button>
        </div>

        {/* Product Variant Matrix Cards */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center text-white/40">Loading stock matrices...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-white/40 bg-[#181818] border border-velora-borderDark">
              No garments found matching "{search}".
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div key={p._id} className="bg-[#181818] border border-velora-borderDark p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
                  <div className="flex items-center space-x-3">
                    <img src={p.images?.[0]?.url} alt={p.title} className="w-12 h-16 object-cover bg-black" />
                    <div>
                      <h4 className="font-editorial text-lg text-white font-normal">{p.title}</h4>
                      <p className="text-[11px] text-white/40 font-mono">{p.sku} | Category: {p.categoryName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-white/40 block">Aggregated Units</span>
                      <span className={`font-semibold text-sm ${p.totalStock <= 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {p.totalStock} Units in Stock
                      </span>
                    </div>

                    <button
                      onClick={() => handleSaveProductInventory(p)}
                      disabled={savingId === p._id}
                      className="px-4 py-2 bg-velora-champagne text-black font-bold uppercase tracking-wider text-[11px] hover:bg-white transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingId === p._id ? 'Saving...' : 'Save Matrix'}</span>
                    </button>
                  </div>
                </div>

                {/* Variant Matrix Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {p.variants?.map((v, vIdx) => (
                    <div key={vIdx} className="bg-[#0E0E0E] p-3 border border-white/5 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] uppercase text-white/50">
                        <span className="font-semibold text-white">{v.size}</span>
                        <span className="truncate max-w-[70px]">{v.color}</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={v.stock}
                        onChange={(e) => handleStockChange(p._id, vIdx, e.target.value)}
                        className={`w-full bg-[#181818] border p-2 text-center text-xs font-semibold focus:outline-none ${
                          v.stock === 0 ? 'border-red-500/50 text-red-400' : v.stock <= 5 ? 'border-amber-500/50 text-amber-300' : 'border-velora-borderDark text-white'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
