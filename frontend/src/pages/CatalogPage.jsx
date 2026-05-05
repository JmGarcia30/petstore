import React, { useState, useEffect } from 'react';
import { getCategories, getPets } from '../services/petService';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export const CatalogPage = ({ initialCategory = null, onViewDetails = null, onAddToCart = null }) => {
  const [categories, setCategories] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        console.log('Raw categories data:', data);
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data?.value)) {
          setCategories(data.value);
        } else if (data && typeof data === 'object') {
          // If it's an object with category properties, extract just the names
          const categoryNames = Object.keys(data).map(key => ({
            id: key,
            name: data[key]?.name || key,
            description: data[key]?.description || ''
          }));
          setCategories(categoryNames);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  // Load pets when category or search changes
  useEffect(() => {
    const loadPets = async () => {
      setLoading(true);
      try {
        const data = await getPets({
          category: selectedCategory,
          search: searchTerm,
          page: 0,
          pageSize: 20,
        });
        setPets(Array.isArray(data) ? data : data?.value || []);
        setError(null);
      } catch (err) {
        console.error('Error loading pets:', err);
        setError('Failed to load products');
        setPets([]);
      } finally {
        setLoading(false);
      }
    };
    loadPets();
  }, [selectedCategory, searchTerm]);

  const handleAddToCart = (pet) => {
    addToCart(pet);
    if (onAddToCart) {
      onAddToCart(pet.name, 'Added to cart!');
    }
  };

  const handleSeeDetails = (pet) => {
    if (onViewDetails) {
      onViewDetails(pet);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Petstore Catalog
            </h1>
            <p className="text-lg text-gray-600">Browse our curated selection of quality pet products</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search for pets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 shadow-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Category Filter - Horizontal at Top */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {/* All Products Button */}
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === null
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-600'
                }`}
              >
                All Products
              </button>

              {/* Category Buttons */}
              {categories.map((category) => {
                const categoryName = typeof category === 'string' ? category : category?.name || '';
                return (
                  <button
                    key={categoryName}
                    onClick={() => setSelectedCategory(categoryName)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      selectedCategory === categoryName
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-600'
                    }`}
                  >
                    {categoryName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Section */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <p className="text-xl text-gray-600">Loading amazing pets...</p>
          </div>
        ) : pets && pets.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory ? `${selectedCategory}` : 'All Products'}{' '}
                <span className="text-gray-500 text-base">({pets.length})</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <ProductCard
                  key={pet.id}
                  pet={pet}
                  onAddToCart={handleAddToCart}
                  onSeeDetails={handleSeeDetails}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-xl text-gray-600 mb-2">
              {searchTerm ? 'No pets found matching your search' : 'No products available'}
            </p>
            <p className="text-gray-500">Try adjusting your filters or search term</p>
          </div>
        )}
      </main>
    </div>
  );
};