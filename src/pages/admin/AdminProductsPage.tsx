import React, { useState } from 'react';
import { 
  Package, Plus, Search, Edit2, Trash2, 
  Sparkles, Check, X, ArrowUpDown, Download, 
  Upload, Eye 
} from 'lucide-react';
import { mockDb } from '../../lib/mockDatabase';
import { useToast } from '../../contexts/ToastContext';
import { Product, FishGender, CareLevel } from '../../lib/types';
import { formatCurrency } from '../../lib/utils';

export const AdminProductsPage: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(() => mockDb.getProducts());
  const categories = mockDb.getCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [categoryId, setCategoryId] = useState('cat-betta');
  const [stockQuantity, setStockQuantity] = useState('1');
  const [isUnique, setIsUnique] = useState(true);
  const [strain, setStrain] = useState('Halfmoon');
  const [gender, setGender] = useState<FishGender>('Male');
  const [careLevel, setCareLevel] = useState<CareLevel>('Moderate');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const refreshProducts = () => {
    setProducts(mockDb.getProducts());
  };

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category_id !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.strain?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setComparePrice('');
    setCategoryId('cat-betta');
    setStockQuantity('1');
    setIsUnique(true);
    setStrain('Halfmoon');
    setGender('Male');
    setCareLevel('Moderate');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(String(p.price));
    setComparePrice(p.compare_at_price ? String(p.compare_at_price) : '');
    setCategoryId(p.category_id);
    setStockQuantity(String(p.stock_quantity));
    setIsUnique(p.is_unique_specimen);
    setStrain(p.strain || '');
    setGender(p.gender || 'Male');
    setCareLevel(p.care_level || 'Moderate');
    setDescription(p.description);
    setImageUrl(p.images[0] || '');
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      showToast('Name and price are required', 'error');
      return;
    }

    const cat = categories.find(c => c.id === categoryId);

    const saved = mockDb.saveProduct({
      id: editingProduct?.id,
      name,
      price: Number(price),
      compare_at_price: comparePrice ? Number(comparePrice) : undefined,
      category_id: categoryId,
      category_name: cat?.name,
      stock_quantity: Number(stockQuantity),
      is_unique_specimen: isUnique,
      strain,
      gender,
      care_level: careLevel,
      description,
      images: [imageUrl],
    });

    refreshProducts();
    setIsModalOpen(false);
    showToast(`Specimen ${saved.name} saved successfully!`, 'success');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this live specimen?')) {
      mockDb.deleteProduct(id);
      refreshProducts();
      showToast('Specimen removed from inventory', 'info');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'SKU', 'Name', 'Category', 'Price', 'Stock', 'Unique_Specimen'];
    const rows = products.map(p => [
      p.id,
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category_name,
      p.price,
      p.stock_quantity,
      p.is_unique_specimen ? 'YES' : 'NO'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `betta_aquatics_inventory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inventory exported as CSV', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-ocean-700 font-mono">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Live Specimen & Inventory Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total active specimens in stock: <strong className="text-slate-800">{products.length}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-ocean-700" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-ocean-950 hover:bg-ocean-900 text-aqua-400 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Specimen</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, strain, SKU..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-slate-500 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer text-xs focus:ring-1 focus:ring-ocean-600"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Specimen / Image</th>
                <th className="p-4">Category & Strain</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Specimen Type</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{product.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">SKU: {product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{product.category_name}</div>
                    <div className="text-[11px] text-ocean-700 font-medium">{product.strain || 'Standard'}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-900 font-display text-sm">
                    {formatCurrency(product.price)}
                    {product.compare_at_price && (
                      <span className="block text-[11px] text-slate-400 line-through font-normal">
                        {formatCurrency(product.compare_at_price)}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        product.stock_quantity > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {product.stock_quantity > 0 ? `${product.stock_quantity} In Stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.is_unique_specimen ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ocean-900 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3 text-sky-600" />
                        <span>Unique (1-of-1)</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Batch Stock</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Specimen"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Specimen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full z-10 text-xs text-slate-700 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold font-mono text-ocean-700 uppercase tracking-wider">
                  Live Stock Database
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  {editingProduct ? 'Edit Live Specimen' : 'Add New Aquarium Specimen'}
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Specimen Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Blue Halfmoon Betta (Show Class)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-ocean-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1499"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-ocean-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Compare Price (₹ MRP)</label>
                  <input
                    type="number"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    placeholder="1899"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-ocean-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-ocean-600 focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-ocean-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Strain / Variety</label>
                  <input
                    type="text"
                    value={strain}
                    onChange={(e) => setStrain(e.target.value)}
                    placeholder="e.g. Halfmoon"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-ocean-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as FishGender)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-ocean-600 focus:bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Breeding Pair">Breeding Pair</option>
                    <option value="Unsexed">Unsexed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Care Level</label>
                  <select
                    value={careLevel}
                    onChange={(e) => setCareLevel(e.target.value as CareLevel)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-ocean-600 focus:bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-ocean-600 focus:bg-white"
                  />
                  {imageUrl && (
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" 
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description & Pedigree</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-ocean-600 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUnique}
                    onChange={(e) => setIsUnique(e.target.checked)}
                    className="accent-ocean-900 w-4 h-4 rounded"
                  />
                  <span className="font-semibold text-slate-800">
                    Unique Specimen: Exact Fish Pictured (WYSIWYG - Locks Stock to 1)
                  </span>
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-ocean-950 hover:bg-ocean-900 text-aqua-400 font-bold text-xs rounded-xl shadow-md"
                >
                  Save Specimen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
