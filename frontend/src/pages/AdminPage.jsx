import React, { useState, useEffect } from 'react';
import { getPets } from '../services/petService';

export const AdminPage = ({ onBackClick }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    category: 'dogs',
    price: '',
    age: '',
    weight: '',
    temperament: '',
    health: '',
    diet: '',
    image: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [tab, setTab] = useState('dashboard');

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    setLoading(true);
    try {
      const data = await getPets();
      setPets(data);
    } catch (err) {
      console.error('Error loading pets:', err);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setPets(pets.map(pet => 
        pet.id === editingId 
          ? { ...pet, ...formData }
          : pet
      ));
      setEditingId(null);
    } else {
      const newPet = {
        id: Math.max(...pets.map(p => p.id), 0) + 1,
        ...formData,
        price: parseFloat(formData.price),
        age: parseFloat(formData.age),
        weight: parseFloat(formData.weight),
      };
      setPets([...pets, newPet]);
    }
    
    resetForm();
  };

  const handleEdit = (pet) => {
    setFormData({
      name: pet.name,
      breed: pet.breed,
      category: pet.category,
      price: pet.price,
      age: pet.age,
      weight: pet.weight,
      temperament: pet.temperament,
      health: pet.health,
      diet: pet.diet,
      image: pet.image,
    });
    setEditingId(pet.id);
    setTab('manage');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      setPets(pets.filter(pet => pet.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      breed: '',
      category: 'dogs',
      price: '',
      age: '',
      weight: '',
      temperament: '',
      health: '',
      diet: '',
      image: '',
    });
    setEditingId(null);
  };

  const statistics = {
    totalPets: pets.length,
    totalOrders: 24,
    totalRevenue: '$4,800',
    categories: {
      dogs: pets.filter(p => p.category === 'dogs').length,
      cats: pets.filter(p => p.category === 'cats').length,
      birds: pets.filter(p => p.category === 'birds').length,
      fish: pets.filter(p => p.category === 'fish').length,
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Admin Dashboard</h1>
              <p className="text-green-100">Manage your petstore with ease</p>
            </div>
            <button
              onClick={onBackClick}
              className="px-6 py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-green-50 transition-all shadow-md"
            >
              ← Back to Shop
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setTab('dashboard')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
              tab === 'dashboard' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 4h2v14h-2zm4-2h2v16h-2z"/></svg>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setTab('manage')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
              tab === 'manage' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.3-1.54L6 17h12l-3.04-4.71z"/></svg>
            <span>Manage Pets</span>
          </button>
        </div>

        {/* Dashboard Tab */}
        {tab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-2">Total Pets</p>
                    <p className="text-4xl font-black text-gray-900">{statistics.totalPets}</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-2">Total Orders</p>
                    <p className="text-4xl font-black text-gray-900">{statistics.totalOrders}</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4V2h10v2H7zm5 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6.1-4H5.9l.5-2H17l1.9-9h-15l-.2-1H2v2h2l3.6 7.59-1.35 2.45c-.1.2-.15.4-.15.6 0 1.1.9 2 2 2h12v-2H9.9l.3-.5H19l3.4-7h-2.3l-1-4z"/></svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-2">Revenue</p>
                    <p className="text-4xl font-black text-gray-900">{statistics.totalRevenue}</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-2">Active Listings</p>
                    <p className="text-4xl font-black text-gray-900">{pets.length}</p>
                  </div>
                  <div className="bg-orange-100 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-orange-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                <span>Pets by Category</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(statistics.categories).map(([category, count]) => (
                  <div key={category} className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 text-center hover:shadow-lg transition-all">
                    <div className="text-3xl font-black text-green-600 mb-2">{count}</div>
                    <div className="text-gray-700 font-bold capitalize">{category}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Pets */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 4h2v14h-2zm4-2h2v16h-2z"/></svg>
                <span>Recently Added Pets</span>
              </h2>
              {pets.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pets added yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-black text-gray-900">Pet Name</th>
                        <th className="px-6 py-4 text-left text-sm font-black text-gray-900">Breed</th>
                        <th className="px-6 py-4 text-left text-sm font-black text-gray-900">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-black text-gray-900">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pets.slice(0, 5).map((pet, idx) => (
                        <tr key={pet.id} className={`hover:bg-gray-50 transition-all ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">{pet.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{pet.breed}</td>
                          <td className="px-6 py-4 text-sm"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold capitalize text-xs">{pet.category}</span></td>
                          <td className="px-6 py-4 text-sm font-black text-green-600">${pet.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manage Pets Tab */}
        {tab === 'manage' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.3-1.54L6 17h12l-3.04-4.71z"/></svg>
                  <span>{editingId ? 'Edit Pet' : 'Add New Pet'}</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pet Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 font-medium"
                      placeholder="e.g., Max"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Breed</label>
                    <input
                      type="text"
                      name="breed"
                      value={formData.breed}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 font-medium"
                      placeholder="e.g., Golden Retriever"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 font-medium"
                    >
                      <option value="dogs">Dogs</option>
                      <option value="cats">Cats</option>
                      <option value="birds">Birds</option>
                      <option value="fish">Fish</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 font-medium"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Age (years)</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 font-medium"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Weight (lbs)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 font-medium"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Temperament</label>
                    <input
                      type="text"
                      name="temperament"
                      value={formData.temperament}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 font-medium"
                      placeholder="e.g., Friendly, Playful"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Health Status</label>
                    <input
                      type="text"
                      name="health"
                      value={formData.health}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 font-medium"
                      placeholder="e.g., Fully vaccinated"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Diet Recommendations</label>
                    <input
                      type="text"
                      name="diet"
                      value={formData.diet}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 font-medium"
                      placeholder="e.g., High-protein dog food"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 font-medium"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex space-x-3 pt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-bold transition-all shadow-lg"
                    >
                      {editingId ? '✓ Update Pet' : '+ Add Pet'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-bold transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Pets List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.3-1.54L6 17h12l-3.04-4.71z"/></svg>
                    <span>All Pets</span>
                  </span>
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-lg font-black">{pets.length}</span>
                </h2>
                {loading ? (
                  <p className="text-gray-500 text-center py-8">Loading...</p>
                ) : pets.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pets added yet. Add one using the form!</p>
                ) : (
                  <div className="space-y-4 max-h-[700px] overflow-y-auto">
                    {pets.map(pet => (
                      <div key={pet.id} className="border-2 border-gray-200 rounded-xl p-5 hover:border-green-500 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-black text-gray-900">{pet.name}</h3>
                            <p className="text-sm text-gray-600 font-semibold">{pet.breed} • <span className="capitalize">{pet.category}</span></p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-green-600">${pet.price}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-100 p-4 rounded-lg text-sm">
                          <div><strong className="text-gray-700">Age:</strong> <span className="text-gray-600">{pet.age} yrs</span></div>
                          <div><strong className="text-gray-700">Weight:</strong> <span className="text-gray-600">{pet.weight} lbs</span></div>
                          <div><strong className="text-gray-700">Temperament:</strong> <span className="text-gray-600">{pet.temperament}</span></div>
                          <div><strong className="text-gray-700">Health:</strong> <span className="text-gray-600">{pet.health}</span></div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(pet)}
                            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-all text-sm"
                          >
                            ✎ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(pet.id)}
                            className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all text-sm"
                          >
                            ✕ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
