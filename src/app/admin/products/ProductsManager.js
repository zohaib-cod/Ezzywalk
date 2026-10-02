'use client';
import { useState } from 'react';
import ConfirmModal from '../ConfirmModal';

export default function ProductsManager({ initialProducts, token }) {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null });
  
  const [form, setForm] = useState({
    name: '', description: '', price: '', brand: 'EZZYWALK', category: 'MEN', imageUrl: '', stock: '', isSeasonEndSale: false
  });

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', brand: 'EZZYWALK', category: 'MEN', imageUrl: '', stock: '', isSeasonEndSale: false });
    setEditingId(null);
    setImageFile(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      brand: product.brand || 'EZZYWALK',
      category: product.category,
      imageUrl: product.imageUrl || '',
      stock: product.stock,
      isSeasonEndSale: product.isSeasonEndSale
    });
    setEditingId(product.id);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      action: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/admin/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setProducts(products.filter(p => p.id !== id));
          } else {
            alert('Failed to delete product');
          }
        } catch (e) {
          alert('Error deleting product');
        }
        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let finalImageUrl = form.imageUrl;

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      try {
        const uploadRes = await fetch('http://127.0.0.1:5000/api/admin/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        if (uploadRes.ok) {
          const { imageUrl } = await uploadRes.json();
          finalImageUrl = imageUrl;
        } else {
          alert('Image upload failed');
          setIsUploading(false);
          return;
        }
      } catch (err) {
        alert('Image upload error');
        setIsUploading(false);
        return;
      }
    }

    const url = editingId 
      ? `http://127.0.0.1:5000/api/admin/products/${editingId}`
      : `http://127.0.0.1:5000/api/admin/products`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, imageUrl: finalImageUrl })
      });
      if (res.ok) {
        const savedProduct = await res.json();
        if (editingId) {
          setProducts(products.map(p => p.id === editingId ? savedProduct : p));
        } else {
          setProducts([savedProduct, ...products]);
        }
        resetForm();
      } else {
        alert('Failed to save product');
      }
    } catch (e) {
      alert('Error saving product');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <ConfirmModal 
        isOpen={confirmModal.isOpen} 
        title={confirmModal.title} 
        message={confirmModal.message} 
        onConfirm={() => { if (confirmModal.action) confirmModal.action(); }} 
        onCancel={() => setConfirmModal({ isOpen: false, title: '', message: '', action: null })} 
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Products</h2>
        <button 
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Name</label>
            <input required type="text" className="w-full border p-2 rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">Collection & Category</label>
            <select 
              className="w-full border p-2 rounded" 
              value={`${form.brand}-${form.category}`} 
              onChange={e => {
                const [brand, category] = e.target.value.split('-');
                setForm({...form, brand, category});
              }}
            >
              <optgroup label="Ezzywalk">
                <option value="EZZYWALK-MEN">Ezzywalk - Men</option>
                <option value="EZZYWALK-WOMEN">Ezzywalk - Women</option>
                <option value="EZZYWALK-KIDS">Ezzywalk - Kids</option>
              </optgroup>
              <optgroup label="Stowave">
                <option value="STOWAVE-MEN">Stowave - Men</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Price ($)</label>
            <input required type="number" step="0.01" className="w-full border p-2 rounded" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Stock</label>
            <input required type="number" className="w-full border p-2 rounded" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">Image Upload (Required)</label>
            <input type="file" accept="image/*" className="w-full border p-2 rounded bg-white" onChange={e => setImageFile(e.target.files[0])} />
            {form.imageUrl && !imageFile && <div className="mt-2 text-xs text-blue-600">Current Image: {form.imageUrl}</div>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">Description</label>
            <textarea className="w-full border p-2 rounded" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
          </div>
          <div className="md:col-span-2 flex items-center mt-2">
            <input type="checkbox" id="sale" className="mr-2 h-4 w-4" checked={form.isSeasonEndSale} onChange={e => setForm({...form, isSeasonEndSale: e.target.checked})} />
            <label htmlFor="sale" className="text-sm font-bold">Include in Season End Sale</label>
          </div>
          <div className="md:col-span-2 mt-4">
            <button disabled={isUploading} type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50">
              {isUploading ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      )}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="pb-3 text-gray-500">Image</th>
            <th className="pb-3 text-gray-500">Name</th>
            <th className="pb-3 text-gray-500">Brand</th>
            <th className="pb-3 text-gray-500">Category</th>
            <th className="pb-3 text-gray-500">Price</th>
            <th className="pb-3 text-gray-500">Stock</th>
            <th className="pb-3 text-gray-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-4">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                )}
              </td>
              <td className="py-4 font-medium">{product.name}
                {product.isSeasonEndSale && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">SALE</span>}
              </td>
              <td className="py-4 text-sm font-bold">{product.brand || 'EZZYWALK'}</td>
              <td className="py-4 text-sm">{product.category}</td>
              <td className="py-4 text-sm font-bold">${product.price}</td>
              <td className="py-4 text-sm">{product.stock}</td>
              <td className="py-4 text-right space-x-2">
                <button onClick={() => handleEdit(product)} className="text-blue-600 hover:underline text-sm font-bold">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline text-sm font-bold">Delete</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="6" className="py-8 text-center text-gray-500">No products found. Add one above.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
