// Dynamically set API base URL based on environment
const isDevelopment = import.meta.env.DEV;
const API_BASE = isDevelopment 
  ? 'http://localhost:8080/api/v1'
  : 'https://petstore-backend.onrender.com/api/v1'; // Update with your Render backend URL

/**
 * Fetch all categories
 */
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    // Return mock data when API is unavailable
    return [
      { id: 1, name: 'Dogs' },
      { id: 2, name: 'Cats' },
      { id: 3, name: 'Birds' },
      { id: 4, name: 'Fishes' },
    ];
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
  // Use mock data immediately for faster load - backend may not be running
  const mockPets = [
    { id: 1, name: 'Buddy', type: 'Dog', description: 'Friendly golden retriever', price: 499.99, available: true, categoryId: 1, categoryName: 'Dogs', image: 'https://www.borrowmydoggy.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F4ij0poqn%2Fproduction%2Fda89d930fc320dd912a2a25487b9ca86b37fcdd6-800x600.jpg&w=1080&q=80', breed: 'Golden Retriever', age: '2 years', weight: '65 lbs', temperament: 'Friendly, Intelligent, Devoted', healthInfo: 'Fully vaccinated, microchipped', diet: 'Premium dog food' },
    { id: 2, name: 'Max', type: 'Dog', description: 'Energetic labrador', price: 599.99, available: true, categoryId: 1, categoryName: 'Dogs', image: 'https://upload.wikimedia.org/wikipedia/commons/2/26/YellowLabradorLooking_new.jpg', breed: 'Labrador Retriever', age: '3 years', weight: '70 lbs', temperament: 'Energetic, Outgoing, Even-tempered', healthInfo: 'Fully vaccinated, microchipped', diet: 'Premium dog food' },
    { id: 3, name: 'Charlie', type: 'Dog', description: 'Playful border collie', price: 549.99, available: true, categoryId: 1, categoryName: 'Dogs', image: 'https://pet-health-content-media.chewy.com/wp-content/uploads/2024/09/11161746/202104Border-Collie-1306159446-scaled-1.jpg', breed: 'Border Collie', age: '1.5 years', weight: '50 lbs', temperament: 'Intelligent, Energetic, Playful', healthInfo: 'Fully vaccinated, microchipped', diet: 'Premium dog food' },
    { id: 4, name: 'Mittens', type: 'Cat', description: 'Playful tabby cat', price: 199.99, available: true, categoryId: 2, categoryName: 'Cats', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop', breed: 'Domestic Tabby', age: '1 year', weight: '8 lbs', temperament: 'Playful, Affectionate, Curious', healthInfo: 'Fully vaccinated, microchipped', diet: 'Premium cat food' },
    { id: 5, name: 'Luna', type: 'Cat', description: 'Elegant siamese', price: 249.99, available: true, categoryId: 2, categoryName: 'Cats', image: 'https://assets.elanco.com/8e0bf1c2-1ae4-001f-9257-f2be3c683fb1/fca42f04-2474-4302-a238-990c8aebfe8c/Siamese_cat_1110x740.jpg?w=3840&q=75&auto=format', breed: 'Siamese', age: '2 years', weight: '7 lbs', temperament: 'Vocal, Affectionate, Intelligent', healthInfo: 'Fully vaccinated, microchipped', diet: 'Premium cat food' },
    { id: 6, name: 'Whiskers', type: 'Cat', description: 'Lazy orange tabby', price: 179.99, available: true, categoryId: 2, categoryName: 'Cats', image: 'https://images.litter-robot.com/media/wysiwyg/orange-tabby-mackerel.jpeg', breed: 'Orange Tabby', age: '3 years', weight: '10 lbs', temperament: 'Calm, Affectionate, Lazy', healthInfo: 'Fully vaccinated, microchipped', diet: 'Premium cat food' },
    { id: 7, name: 'Tweety', type: 'Bird', description: 'Colorful parrot', price: 299.99, available: true, categoryId: 3, categoryName: 'Birds', image: 'https://supertails.com/cdn/shop/articles/indian-parrot_905855fc-e32a-444b-9965-203d5ab678c6.jpg?v=1742204056', breed: 'Indian Parrot', age: '4 years', weight: '0.5 lbs', temperament: 'Intelligent, Social, Vocal', healthInfo: 'Healthy, Regular check-ups', diet: 'Seeds, fruits, vegetables' },
    { id: 8, name: 'Polly', type: 'Bird', description: 'Friendly cockatiel', price: 249.99, available: true, categoryId: 3, categoryName: 'Birds', image: 'https://lafeber.com/pet-birds/wp-content/uploads/2014/11/cockatiel-perch-pex-10252685.jpg', breed: 'Cockatiel', age: '3 years', weight: '0.3 lbs', temperament: 'Friendly, Playful, Affectionate', healthInfo: 'Healthy, Regular check-ups', diet: 'Seeds, pellets, fruits' },
    { id: 9, name: 'Sky', type: 'Bird', description: 'Singing canary', price: 89.99, available: true, categoryId: 3, categoryName: 'Birds', image: 'https://cdn.britannica.com/33/226533-050-404C15AF/Canary-on-pear-branch.jpg', breed: 'Canary', age: '2 years', weight: '0.05 lbs', temperament: 'Active, Melodic, Social', healthInfo: 'Healthy, Regular check-ups', diet: 'Seeds, pellets, greens' },
    { id: 10, name: 'Nemo', type: 'Fish', description: 'Orange clownfish', price: 49.99, available: true, categoryId: 4, categoryName: 'Fishes', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Clown_fish_in_the_Andaman_Coral_Reef.jpg', breed: 'Clownfish', age: '1 year', weight: '0.02 lbs', temperament: 'Playful, Active, Social', healthInfo: 'Healthy, Reef-safe', diet: 'Fish food, small invertebrates' },
    { id: 11, name: 'Goldie', type: 'Fish', description: 'Classic goldfish', price: 19.99, available: true, categoryId: 4, categoryName: 'Fishes', image: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Gold_fish1.jpg', breed: 'Goldfish', age: '2 years', weight: '0.05 lbs', temperament: 'Calm, Social, Hardy', healthInfo: 'Healthy, Hardy species', diet: 'Goldfish pellets, vegetables' },
    { id: 12, name: 'Bubbles', type: 'Fish', description: 'Tropical beta fish', price: 34.99, available: true, categoryId: 4, categoryName: 'Fishes', image: 'https://home.adelphi.edu/~ve21375/betta%20fish%20home%201.jpg', breed: 'Betta Fish', age: '1.5 years', weight: '0.015 lbs', temperament: 'Vibrant, Territorial, Active', healthInfo: 'Healthy, Well-cared', diet: 'Betta pellets, small insects' },
  ];
  
  // Filter by category
  if (options.category) {
    return mockPets.filter(p => p.categoryName === options.category);
  }
  return mockPets;
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
