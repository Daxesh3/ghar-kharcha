import React, { useState } from 'react';
import { User, Lock, Bell, Database, Shield, Download, Upload, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      await updateUserProfile(displayName, photoURL || undefined);
      setSuccessMessage('Profile updated successfully');
    } catch (error) {
      setErrorMessage('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="card p-4">
            <nav className="space-y-1">
              <a href="#profile" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-primary-50 text-primary-700">
                <User size={18} className="mr-3" />
                <span>Profile</span>
              </a>
              <a href="#security" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
                <Lock size={18} className="mr-3" />
                <span>Security</span>
              </a>
              <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
                <Bell size={18} className="mr-3" />
                <span>Notifications</span>
              </a>
              <a href="#data" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
                <Database size={18} className="mr-3" />
                <span>Data Management</span>
              </a>
              <a href="#privacy" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
                <Shield size={18} className="mr-3" />
                <span>Privacy</span>
              </a>
              <a href="#help" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
                <HelpCircle size={18} className="mr-3" />
                <span>Help & Support</span>
              </a>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Profile Section */}
          <div id="profile" className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            
            {successMessage && (
              <div className="mb-4 p-3 bg-success-50 text-success-700 rounded-lg">
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-lg">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label htmlFor="displayName" className="input-label">Display Name</label>
                <input
                  type="text"
                  id="displayName"
                  className="input-field"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="input-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="input-field bg-gray-50"
                  value={currentUser?.email || ''}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="photoURL" className="input-label">Profile Photo URL</label>
                <input
                  type="url"
                  id="photoURL"
                  className="input-field"
                  placeholder="https://example.com/photo.jpg"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Data Management Section */}
          <div id="data" className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Data Management</h2>
            <p className="text-gray-600 mb-4">
              Manage your expense data by exporting or importing it
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button className="btn flex items-center justify-center bg-primary-50 text-primary-700 hover:bg-primary-100">
                <Download size={18} className="mr-2" />
                Export Data
              </button>
              <button className="btn flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200">
                <Upload size={18} className="mr-2" />
                Import Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;