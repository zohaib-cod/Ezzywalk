"use client";

import { useState, useEffect } from 'react';

export default function SliderManager({ token, showToast }) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    label: '',
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    linkText: '',
    bgColor: 'bg-gray-900',
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/heroSlides');
      const data = await res.json();
      setSlides(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleEdit = (slide) => {
    setForm(slide);
    setImageFile(null);
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setForm({
      id: null,
      label: '',
      title: '',
      subtitle: '',
      imageUrl: '',
      linkUrl: '',
      linkText: '',
      bgColor: 'bg-gray-900',
      order: slides.length
    });
    setImageFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/heroSlides/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Slide deleted successfully', 'success');
        fetchSlides();
      } else {
        showToast('Failed to delete slide', 'error');
      }
    } catch (e) {
      showToast('Error deleting slide', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let finalImageUrl = form.imageUrl;

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      try {
        const uploadRes = await fetch('http://localhost:5000/api/admin/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        if (uploadRes.ok) {
          const { imageUrl } = await uploadRes.json();
          finalImageUrl = imageUrl;
        } else {
          showToast('Image upload failed', 'error');
          setIsUploading(false);
          return;
        }
      } catch (err) {
        showToast('Image upload error', 'error');
        setIsUploading(false);
        return;
      }
    }

    if (!finalImageUrl) {
      showToast('Image is required', 'error');
      setIsUploading(false);
      return;
    }

    const payload = { ...form, imageUrl: finalImageUrl };
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `http://localhost:5000/api/heroSlides/${form.id}` : `http://localhost:5000/api/heroSlides`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(form.id ? 'Slide updated successfully' : 'Slide added successfully', 'success');
        setIsEditing(false);
        fetchSlides();
      } else {
        showToast('Failed to save slide', 'error');
      }
    } catch (err) {
      showToast('Error saving slide', 'error');
    }
    setIsUploading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Main Slider</h2>
        {!isEditing && (
          <button onClick={handleCreateNew} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700">
            + Add New Slide
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h3 className="font-bold text-lg mb-4">{form.id ? 'Edit Slide' : 'Add New Slide'}</h3>
          
          <div>
            <label className="block text-sm font-bold mb-1">Slide Image (Required)</label>
            <input type="file" accept="image/*" className="w-full border p-2 rounded bg-white" onChange={e => setImageFile(e.target.files[0])} />
            {form.imageUrl && !imageFile && (
              <img src={form.imageUrl} alt="preview" className="h-20 mt-2 object-cover rounded shadow" />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Small Label (e.g. Season End Sale)</label>
              <input type="text" className="w-full border p-2 rounded" value={form.label} onChange={e => setForm({...form, label: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Main Title (e.g. 50%)</label>
              <input type="text" className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1">Subtitle (e.g. Upto Off)</label>
            <input type="text" className="w-full border p-2 rounded" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Button Text</label>
              <input type="text" className="w-full border p-2 rounded" value={form.linkText} onChange={e => setForm({...form, linkText: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Button Link URL</label>
              <input type="text" className="w-full border p-2 rounded" value={form.linkUrl} onChange={e => setForm({...form, linkUrl: e.target.value})} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Background Theme</label>
              <select className="w-full border p-2 rounded" value={form.bgColor} onChange={e => setForm({...form, bgColor: e.target.value})}>
                <option value="bg-gray-900">Dark (Black)</option>
                <option value="bg-blue-900">Dark (Blue)</option>
                <option value="bg-gradient-to-b from-blue-50 to-gray-200">Light (Gradient)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Order (Sort Index)</label>
              <input type="number" className="w-full border p-2 rounded" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)})} />
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button disabled={isUploading} type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50">
              {isUploading ? 'Saving...' : 'Save Slide'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-gray-500 py-4">Loading slides...</p>
          ) : slides.length === 0 ? (
            <p className="text-gray-500 py-4">No slides found. Add one above.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-2">Image</th>
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Order</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slides.map(slide => (
                  <tr key={slide.id} className="border-b last:border-0">
                    <td className="py-3">
                      <img src={slide.imageUrl} alt="slide" className="w-16 h-10 object-cover rounded border" />
                    </td>
                    <td className="py-3 text-sm font-medium">{slide.title || '(No Title)'}</td>
                    <td className="py-3 text-sm">{slide.order}</td>
                    <td className="py-3 text-sm flex space-x-2">
                      <button onClick={() => handleEdit(slide)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(slide.id)} className="text-red-600 hover:underline ml-3">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
