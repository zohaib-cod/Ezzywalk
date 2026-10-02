'use client';
import { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';
import SliderManager from './SliderManager';

export default function AdminTabs({ users, token, userRole }) {
  const [activeTab, setActiveTab] = useState('users');
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const [inviteEmail, setInviteEmail] = useState('');
  
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null });
  
  const [profileForm, setProfileForm] = useState({ oldEmail: '', newEmail: '', name: '', newPassword: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  
  // Handlers for Invite
  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/admin/invite-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: inviteEmail })
      });
      const data = await res.json();
      if (res.ok) showToast('Invitation sent to ' + inviteEmail, 'success');
      else showToast(data.error || 'Failed to send invite', 'error');
    } catch (e) { showToast('Error sending invite', 'error'); }
  };
  
  // Handlers for Profile Change
  const requestOtp = async () => {
    if (!profileForm.oldEmail) return showToast('Enter your current email first', 'error');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/admin/request-password-change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: profileForm.oldEmail })
      });
      if (res.ok) { setOtpSent(true); showToast('OTP sent to your email!', 'success'); }
      else showToast('Failed to send OTP', 'error');
    } catch (e) { showToast('Error sending OTP', 'error'); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/admin/change-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (res.ok) showToast('Your profile/password has been changed successfully!', 'success');
      else showToast(data.error || 'Failed to update profile', 'error');
    } catch (e) { showToast('Error updating profile', 'error'); }
  };

  const blockAdmin = (adminId, isBlocked) => {
    const actionName = isBlocked ? 'Block' : 'Unblock';
    setConfirmModal({
      isOpen: true,
      title: `${actionName} Admin`,
      message: `Are you sure you want to ${actionName.toLowerCase()} this admin?`,
      action: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/admin/block-admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ adminId, isBlocked })
          });
          if (res.ok) { showToast(`Admin ${actionName.toLowerCase()}ed successfully. Refresh the page.`, 'success'); }
          else showToast(`Failed to ${actionName.toLowerCase()} admin`, 'error');
        } catch(e) { showToast(`Error ${actionName.toLowerCase()}ing admin`, 'error'); }
        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
      }
    });
  };

  const promoteAdmin = (adminId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Promote to Master Admin',
      message: 'Are you sure you want to promote this user to Master Admin? This action gives them full control over the system.',
      action: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/admin/promote-admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ adminId })
          });
          if (res.ok) { showToast('User promoted to Master Admin. Refresh the page.', 'success'); }
          else showToast('Failed to promote user', 'error');
        } catch(e) { showToast('Error promoting user', 'error'); }
        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
      }
    });
  };

  
  const [bannerForm, setBannerForm] = useState({
    label: '', title: '', description: '', imageUrl: '', linkUrl: '', linkText: '', tickerText: ''
  });
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  useEffect(() => {
    if (activeTab === 'banner') {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/banners`)
        .then(res => res.json())
        .then(data => {
          if (data) setBannerForm(data);
        })
        .catch(e => console.error(e));
    }
  }, [activeTab]);
  
  const handleBannerSave = async (e) => {
    e.preventDefault();
    setIsUploadingBanner(true);
    let finalImageUrl = bannerForm.imageUrl;

    if (bannerImageFile) {
      const formData = new FormData();
      formData.append('image', bannerImageFile);
      try {
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/admin/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        if (uploadRes.ok) {
          const { imageUrl } = await uploadRes.json();
          finalImageUrl = imageUrl;
          setBannerForm(prev => ({ ...prev, imageUrl })); // Update form state with new URL
        } else {
          showToast('Banner image upload failed', 'error');
          setIsUploadingBanner(false);
          return;
        }
      } catch (err) {
        showToast('Image upload error', 'error');
        setIsUploadingBanner(false);
        return;
      }
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/banners`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...bannerForm, imageUrl: finalImageUrl })
      });
      if (res.ok) showToast('Banner updated successfully!', 'success');
      else showToast('Failed to update banner', 'error');
    } catch (e) {
      showToast('Error updating banner', 'error');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  return (
    <div>
      {/* Custom Toast Notification */}
      {toast.show && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-xl text-white font-bold transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmModal.isOpen} 
        title={confirmModal.title} 
        message={confirmModal.message} 
        onConfirm={() => { if (confirmModal.action) confirmModal.action(); }} 
        onCancel={() => setConfirmModal({ isOpen: false, title: '', message: '', action: null })} 
      />

      <div className="flex space-x-4 mb-8 border-b pb-2 overflow-x-auto">
        <button className={`font-bold ${activeTab === 'users' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-gray-500'}`} onClick={() => setActiveTab('users')}>Users</button>
        {userRole === 'MASTER_ADMIN' && (
          <button className={`font-bold ${activeTab === 'coadmin' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-gray-500'}`} onClick={() => setActiveTab('coadmin')}>Co-Admins</button>
        )}
        <button className={`font-bold ${activeTab === 'slider' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-gray-500'}`} onClick={() => setActiveTab('slider')}>Slider Settings</button>
        <button className={`font-bold ${activeTab === 'banner' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-gray-500'}`} onClick={() => setActiveTab('banner')}>Banner Settings</button>
        <button className={`font-bold ${activeTab === 'profile' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-gray-500'}`} onClick={() => setActiveTab('profile')}>My Profile</button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Registered Users</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(u => u.role === 'USER')
                .map(user => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="py-3 text-sm">{user.name}</td>
                  <td className="py-3 text-sm">{user.email}</td>
                  <td className="py-3 text-sm">{user.role}</td>
                  <td className="py-3 text-sm">
                    {/* Actions for regular users if needed */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'coadmin' && userRole === 'MASTER_ADMIN' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6 max-w-xl">
            <h2 className="text-xl font-bold mb-4">Invite Co-Admin</h2>
            <form onSubmit={handleInvite} className="flex space-x-2">
              <input type="email" required placeholder="Enter co-admin's email" className="border p-2 rounded flex-1" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">Send Invite Link</button>
            </form>
            <p className="text-xs text-gray-500 mt-2">A unique registration link will be sent to their email.</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Manage Admins & Co-Admins</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(u => (u.role === 'ADMIN' || u.role === 'MASTER_ADMIN') && !u.isBlocked)
                  .map(user => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{user.name || 'Pending'}</td>
                    <td className="py-3 text-sm">{user.email}</td>
                    <td className="py-3 text-sm font-bold text-green-700">{user.role}</td>
                    <td className="py-3 text-sm">
                      {user.role === 'ADMIN' && (
                        <div className="flex space-x-2">
                          <button onClick={() => blockAdmin(user.id, !user.isBlocked)} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200">
                            Block
                          </button>
                          <button onClick={() => promoteAdmin(user.id)} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200">
                            Promote to Master
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {users.filter(u => (u.role === 'ADMIN' || u.role === 'MASTER_ADMIN') && !u.isBlocked).length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-sm text-gray-500">No active admins found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {users.filter(u => (u.role === 'ADMIN' || u.role === 'MASTER_ADMIN') && u.isBlocked).length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-red-600">Blocked Admins</h2>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-red-200">
                    <th className="pb-2 text-red-600">Name</th>
                    <th className="pb-2 text-red-600">Email</th>
                    <th className="pb-2 text-red-600">Role</th>
                    <th className="pb-2 text-red-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(u => (u.role === 'ADMIN' || u.role === 'MASTER_ADMIN') && u.isBlocked)
                    .map(user => (
                    <tr key={user.id} className="border-b last:border-0 bg-red-50">
                      <td className="py-3 text-sm px-2">{user.name || 'Pending'}</td>
                      <td className="py-3 text-sm">{user.email}</td>
                      <td className="py-3 text-sm font-bold text-red-700">{user.role}</td>
                      <td className="py-3 text-sm">
                        {user.role === 'ADMIN' && (
                          <div className="flex space-x-2">
                            <button onClick={() => blockAdmin(user.id, !user.isBlocked)} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-md font-bold hover:bg-green-200 border border-green-200">
                              Unblock & Restore
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow p-6 max-w-xl">
          <h2 className="text-xl font-bold mb-4">Update Profile & Security</h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Current Email (Required)</label>
              <input type="email" required placeholder="example@gmail.com" className="w-full border p-2 rounded bg-gray-50" value={profileForm.oldEmail} onChange={e => setProfileForm({...profileForm, oldEmail: e.target.value})} />
              <p className="text-[10px] text-gray-500 mt-1">OTP will be sent to this email to verify any sensitive changes.</p>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <label className="block text-sm font-bold text-gray-700">New Email (Optional)</label>
              <input type="email" placeholder="Enter new email if you want to change it" className="w-full border p-2 rounded" value={profileForm.newEmail} onChange={e => setProfileForm({...profileForm, newEmail: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700">New Password (Optional)</label>
              <input type="password" placeholder="Enter new password if you want to change it" className="w-full border p-2 rounded" value={profileForm.newPassword} onChange={e => setProfileForm({...profileForm, newPassword: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Full Name (Optional)</label>
              <input type="text" placeholder="Enter new name" className="w-full border p-2 rounded" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-100">
              <label className="block text-sm font-bold text-blue-900 mb-2">Step 1: Request Verification Code</label>
              <button type="button" onClick={requestOtp} className="w-full bg-blue-600 text-white font-bold px-4 py-2 text-sm rounded hover:bg-blue-700 shadow mb-3">
                Send OTP to Current Email
              </button>
              
              {otpSent && (
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-1">Step 2: Enter OTP</label>
                  <input type="text" placeholder="Enter 6-digit OTP from your email" required className="w-full border p-2 rounded border-blue-300" value={profileForm.otp} onChange={e => setProfileForm({...profileForm, otp: e.target.value})} />
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded mt-4 hover:bg-green-700 shadow-lg text-lg">
              Save Changes
            </button>
          </form>
        </div>
      )}
      {activeTab === 'slider' && (
        <SliderManager token={token} showToast={showToast} />
      )}
      {activeTab === 'banner' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Edit Landing Page Banner</h2>
          <form onSubmit={handleBannerSave} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-bold mb-1">Small Label (e.g. New Collection)</label>
              <input type="text" className="w-full border p-2 rounded" value={bannerForm.label} onChange={e => setBannerForm({...bannerForm, label: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Main Title</label>
              <input type="text" className="w-full border p-2 rounded" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Description</label>
              <textarea className="w-full border p-2 rounded" rows="3" value={bannerForm.description} onChange={e => setBannerForm({...bannerForm, description: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Background Image Upload</label>
              <input type="file" accept="image/*" className="w-full border p-2 rounded bg-white" onChange={e => setBannerImageFile(e.target.files[0])} />
              {bannerForm.imageUrl && !bannerImageFile && <div className="mt-2 text-xs text-blue-600">Current Image: {bannerForm.imageUrl}</div>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Button Text</label>
              <input type="text" className="w-full border p-2 rounded" value={bannerForm.linkText} onChange={e => setBannerForm({...bannerForm, linkText: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Button Link URL</label>
              <input type="text" className="w-full border p-2 rounded" value={bannerForm.linkUrl} onChange={e => setBannerForm({...bannerForm, linkUrl: e.target.value})} />
            </div>
            <button disabled={isUploadingBanner} type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50">
              {isUploadingBanner ? 'Saving...' : 'Save Banner'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
