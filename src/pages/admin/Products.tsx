import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, X, Upload, Check, BookOpen, AlertTriangle, ShoppingBag, BarChart3 } from 'lucide-react';
import { productService } from '../../lib/services';
import { Product, ProductType } from '../../types';
import { formatPrice, cn } from '../../lib/utils';
import { toast } from 'sonner';
import { BOOK_CATEGORIES } from '../../constants/categories';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: BOOK_CATEGORIES[0] as string,
    type: 'physical' as ProductType,
    image_url: '',
    pdf_url: '',
    is_featured: false,
  });

  useEffect(() => {
    loadProducts();

    // Check for 'add=true' query param
    const params = new URLSearchParams(location.search);
    if (params.get('add') === 'true') {
      resetForm();
      setEditingProduct(null);
      setIsModalOpen(true);
    }
  }, [location]);

  // Handle escape key for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (productToDelete) setProductToDelete(null);
        else if (isModalOpen) setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [productToDelete, isModalOpen]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
        toast.success(`"${formData.title}" updated successfully`);
      } else {
        await productService.create(formData);
        toast.success(`"${formData.title}" added to store`);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      resetForm();
      await loadProducts();
    } catch (error: any) {
      console.error('Save error:', error);
      const errorMessage = error?.message || 'Unknown error';
      toast.error(`Failed to save product: ${errorMessage}`);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      type: product.type,
      image_url: product.image_url,
      pdf_url: product.pdf_url || '',
      is_featured: product.is_featured,
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const target = productToDelete;
    setDeleting(true);

    // 1. Optimistic UI update: remove book from view immediately
    setProducts((prev) => prev.filter((p) => p.id !== target.id));
    setProductToDelete(null);

    try {
      // 2. Perform deletion in storage and remote database
      await productService.delete(target.id);
      toast.success(`"${target.title}" deleted successfully`);
      await loadProducts();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error?.message || 'Failed to delete book');
      await loadProducts();
    } finally {
      setDeleting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = type === 'image';
    const setUploading = isImage ? setUploadingImage : setUploadingPdf;
    const bucket = isImage ? 'product-images' : 'product-pdfs';

    setUploading(true);
    try {
      const url = await productService.uploadFile(file, bucket);
      setFormData((prev) => ({
        ...prev,
        [isImage ? 'image_url' : 'pdf_url']: url,
      }));
      toast.success(`${isImage ? 'Cover image' : 'PDF document'} ready!`);
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.message || 'Unknown error';
      toast.error(`Upload error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      category: BOOK_CATEGORIES[0],
      type: 'physical',
      image_url: '',
      pdf_url: '',
      is_featured: false,
    });
  };

  const filteredProducts = products.filter((p) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Admin Quick Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-sky-100">
        <Link
          to="/admin/products"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-xs shadow-blue-500/20"
        >
          <BookOpen className="w-4 h-4" />
          <span>All Books & Products ({products.length})</span>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-white hover:bg-sky-50 text-slate-700 hover:text-blue-900 border border-sky-100 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-sky-600" />
          <span>Customer Orders</span>
        </Link>
        <Link
          to="/admin/dashboard"
          className="bg-white hover:bg-sky-50 text-slate-700 hover:text-blue-900 border border-sky-100 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-colors"
        >
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          <span>Overview & Stats</span>
        </Link>
      </div>

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full mb-2">
            <span>Admin Portal</span>
            <span>·</span>
            <span>Pioneer Books</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950">Book Catalog Management</h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage your store inventory: add new titles, update pricing, or remove books.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-2xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, category, format..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-sky-50/50 border border-sky-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
          />
        </div>
        <div className="text-xs font-medium text-slate-500 self-end sm:self-center">
          Showing <span className="font-bold text-blue-950">{filteredProducts.length}</span> of {products.length} books
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-sky-100 text-blue-950">
                <th className="px-6 py-4 font-bold">Book Title & Cover</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Format</th>
                <th className="px-6 py-4 font-bold">Price</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100/70">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-5">
                      <div className="h-5 bg-sky-50 rounded-lg w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <p className="font-semibold text-slate-700">No books found.</p>
                    <p className="text-xs text-slate-400 mt-1">Try a different search or click "Add New Book" above.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-16 rounded-lg bg-sky-50 border border-sky-100 overflow-hidden shrink-0">
                          <img
                            src={product.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800'}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-blue-950 line-clamp-1">{product.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {product.is_featured && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                Featured
                              </span>
                            )}
                            <span className="text-xs text-slate-500 line-clamp-1">{product.description}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{product.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border',
                          product.type === 'pdf'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        )}
                      >
                        {product.type === 'pdf' ? 'Digital PDF' : 'Physical'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-950">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          title={`Edit "${product.title}"`}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all border border-sky-100 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProductToDelete(product);
                          }}
                          title={`Delete "${product.title}"`}
                          aria-label={`Delete "${product.title}"`}
                          className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-xl transition-all border border-rose-200/80 shadow-2xs cursor-pointer group"
                        >
                          <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-sky-100 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-blue-950 to-blue-900 border-b border-blue-800 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2.5">
                <BookOpen className="w-5 h-5 text-sky-300" />
                <h2 className="text-xl font-bold">{editingProduct ? 'Edit Book Details' : 'Add New Book'}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-950 uppercase tracking-wider">Book Title *</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-sky-50/40 border border-sky-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm text-slate-900"
                    placeholder="e.g. Pakistan Penal Code (Act XLV of 1860)"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-950 uppercase tracking-wider">Price (Rs) *</label>
                  <input
                    required
                    type="number"
                    step="1"
                    min="0"
                    value={formData.price || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value === '' ? 0 : parseInt(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-sky-50/40 border border-sky-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm text-slate-900"
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-blue-950 uppercase tracking-wider">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-sky-50/40 border border-sky-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm text-slate-900 resize-none"
                  placeholder="Summary of the book, author, or contents..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Category ({BOOK_CATEGORIES.length} Legal Categories)
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-sky-50/40 border border-sky-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm text-slate-900"
                  >
                    {BOOK_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-950 uppercase tracking-wider">Format</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ProductType })}
                    className="w-full px-3.5 py-2.5 bg-sky-50/40 border border-sky-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm text-slate-900"
                  >
                    <option value="physical">Physical Book</option>
                    <option value="pdf">Digital PDF Download</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload & URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-950 uppercase tracking-wider">Cover Image</label>
                <div className="flex items-center space-x-4 p-3 bg-sky-50/30 rounded-2xl border border-sky-100">
                  <div className="w-16 h-22 bg-sky-50 rounded-xl border border-dashed border-sky-200 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Upload className="w-6 h-6 text-sky-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'image')}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className={cn(
                          'inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all',
                          uploadingImage
                            ? 'bg-sky-100 text-sky-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                        )}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                      </label>
                      <span className="text-xs text-slate-400">or enter image link below</span>
                    </div>
                    <input
                      type="url"
                      placeholder="https://example.com/cover.jpg"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-sky-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* PDF Document Upload */}
              {formData.type === 'pdf' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-blue-950 uppercase tracking-wider">Digital PDF File</label>
                  <div className="p-3 bg-sky-50/40 rounded-2xl border border-sky-100 space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center shrink-0 text-sky-700">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileUpload(e, 'pdf')}
                          className="hidden"
                          id="pdf-upload"
                        />
                        <label
                          htmlFor="pdf-upload"
                          className={cn(
                            'inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all',
                            uploadingPdf
                              ? 'bg-sky-100 text-sky-400 cursor-not-allowed'
                              : 'bg-sky-700 hover:bg-sky-800 text-white shadow-2xs'
                          )}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingPdf ? 'Uploading PDF...' : formData.pdf_url ? 'Replace PDF File' : 'Upload PDF Document'}</span>
                        </label>
                      </div>
                    </div>
                    <input
                      type="url"
                      placeholder="Or paste direct PDF URL (https://...)"
                      value={formData.pdf_url}
                      onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-sky-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Featured toggle */}
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-sky-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="featured" className="text-sm font-semibold text-blue-950 cursor-pointer">
                  Feature this book on the Home page showcase
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Save Changes' : 'Publish Book'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => !deleting && setProductToDelete(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100 shadow-2xs">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">Permanently Delete Book?</h3>
              <p className="text-sm text-slate-600">
                Are you sure you want to remove <span className="font-bold text-slate-950">"{productToDelete.title}"</span> from Pioneer Books?
              </p>
            </div>

            {/* Book Preview Card */}
            <div className="flex items-center space-x-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="w-12 h-16 rounded-lg bg-sky-50 border border-sky-100 overflow-hidden shrink-0">
                <img
                  src={productToDelete.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800'}
                  alt=""
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-slate-900 truncate">{productToDelete.title}</p>
                <p className="text-xs text-slate-500">{productToDelete.category} · {productToDelete.type === 'pdf' ? 'Digital PDF' : 'Physical'}</p>
                <p className="text-xs font-bold text-blue-900 mt-0.5">{formatPrice(productToDelete.price)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
