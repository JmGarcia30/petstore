const API_BASE = 'http://localhost:8080/api/v1';

/**
 * Fetch all categories
 */
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};

/**
 * Fetch all pets with optional filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 0)
 * @param {number} options.pageSize - Results per page (default: 20)
 * @param {string} options.category - Filter by category name
 * @param {string} options.search - Search term for name/description
 */
export const getPets = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    if (options.page !== undefined) params.append('page', options.page);
    if (options.pageSize !== undefined) params.append('pageSize', options.pageSize);
    if (options.category) params.append('category', options.category);
    if (options.search) params.append('search', options.search);

    const url = `${API_BASE}/pets${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch pets:', error);
    return [];
  }
};

/**
 * Fetch a single pet by ID
 */
export const getPetById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/pets/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch pet ${id}:`, error);
    return null;
  }
};
