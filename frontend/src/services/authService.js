// Authentication service with localStorage-based user registration

const USERS_STORAGE_KEY = 'petstore_users';

// Get all registered users from localStorage
const getRegisteredUsers = () => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (err) {
    console.error('Error reading users from storage:', err);
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users to storage:', err);
  }
};

// Initialize with admin user if not exists
const initializeAdminUser = () => {
  const users = getRegisteredUsers();
  const adminExists = users.some(u => u.email === 'admin@petstore.com');
  
  if (!adminExists) {
    users.push({
      id: 999,
      name: 'Administrator',
      email: 'admin@petstore.com',
      password: 'admin', // Note: In production, this should be hashed
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
  }
};

// Initialize admin on module load
initializeAdminUser();

export const authService = {
  // Register a new user
  signup: (name, email, password) => {
    const users = getRegisteredUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // Note: In production, this should be hashed with bcrypt
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Return user data without password
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  },

  // Login user
  login: (email, password) => {
    const users = getRegisteredUsers();
    
    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Email not found. Please sign up first.');
    }
    
    // Check password
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    // Return user data without password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },

  // Get all registered users (for debugging)
  getAllUsers: () => {
    return getRegisteredUsers().map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
    }));
  },

  // Clear all users (for testing)
  clearAllUsers: () => {
    localStorage.removeItem(USERS_STORAGE_KEY);
    initializeAdminUser();
  },
};
