import React, { useState } from 'react';
import { Plus, Edit, Trash2, User, Save, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { FamilyMember } from '../types';

interface MemberFormData {
  name: string;
  role: 'adult' | 'child';
  avatarUrl?: string;
}

const FamilyMembers: React.FC = () => {
  const { familyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } = useExpenses();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    role: 'adult',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addFamilyMember(formData);
      setFormData({ name: '', role: 'adult' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding family member:', error);
    }
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId) return;
    
    try {
      await updateFamilyMember(editingId, formData);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating family member:', error);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this family member? This will not delete their associated expenses.')) {
      try {
        await deleteFamilyMember(id);
      } catch (error) {
        console.error('Error deleting family member:', error);
      }
    }
  };
  
  const startEditing = (member: FamilyMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      avatarUrl: member.avatarUrl
    });
  };
  
  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ name: '', role: 'adult' });
  };
  
  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Family Members</h1>
          <p className="text-gray-500 mt-1">Manage your household members and their expenses</p>
        </div>
        
        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-primary flex items-center"
          disabled={isAdding}
        >
          <Plus size={18} className="mr-1.5" />
          Add Member
        </button>
      </div>
      
      {isAdding && (
        <div className="card p-6 mb-6 border-primary-200 border-2">
          <h2 className="text-xl font-semibold mb-4">Add Family Member</h2>
          <form onSubmit={handleAddSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="input-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input-field"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="role" className="input-label">Role</label>
                <select
                  id="role"
                  name="role"
                  className="input-field"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="adult">Adult</option>
                  <option value="child">Child</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="avatarUrl" className="input-label">Avatar URL (Optional)</label>
                <input
                  type="url"
                  id="avatarUrl"
                  name="avatarUrl"
                  className="input-field"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatarUrl || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.length === 0 ? (
          <div className="card p-8 text-center md:col-span-2 lg:col-span-3">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User size={28} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No family members yet</h3>
            <p className="text-gray-500 mb-4">
              Add family members to track expenses for each person
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus size={18} className="mr-1.5" />
              Add First Member
            </button>
          </div>
        ) : (
          familyMembers.map(member => (
            <div key={member.id} className="card p-5">
              {editingId === member.id ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label htmlFor={`edit-name-${member.id}`} className="input-label">Name</label>
                    <input
                      type="text"
                      id={`edit-name-${member.id}`}
                      name="name"
                      className="input-field"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`edit-role-${member.id}`} className="input-label">Role</label>
                    <select
                      id={`edit-role-${member.id}`}
                      name="role"
                      className="input-field"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="adult">Adult</option>
                      <option value="child">Child</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor={`edit-avatar-${member.id}`} className="input-label">Avatar URL</label>
                    <input
                      type="url"
                      id={`edit-avatar-${member.id}`}
                      name="avatarUrl"
                      className="input-field"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.avatarUrl || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="btn btn-secondary flex items-center"
                    >
                      <X size={16} className="mr-1.5" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success flex items-center"
                    >
                      <Save size={16} className="mr-1.5" />
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary-700">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <button
                      onClick={() => startEditing(member)}
                      className="text-gray-600 hover:text-primary-600 flex items-center text-sm font-medium"
                    >
                      <Edit size={16} className="mr-1.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-gray-600 hover:text-error-600 flex items-center text-sm font-medium"
                    >
                      <Trash2 size={16} className="mr-1.5" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FamilyMembers;