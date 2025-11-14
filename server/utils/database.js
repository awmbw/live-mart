const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/database.json');

// Initialize database if it doesn't exist
const initDatabase = () => {
  const defaultData = {
    users: [],
    products: [],
    orders: [],
    feedback: [],
    categories: [
      { id: '1', name: 'Groceries', icon: '🛒' },
      { id: '2', name: 'Electronics', icon: '📱' },
      { id: '3', name: 'Clothing', icon: '👕' },
      { id: '4', name: 'Home & Kitchen', icon: '🏠' },
      { id: '5', name: 'Health & Beauty', icon: '💄' },
      { id: '6', name: 'Local Products', icon: '🌾' }
    ]
  };

  if (!fs.existsSync(dbPath)) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  }
};

// Read database
const readDB = () => {
  initDatabase();
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Write to database
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Generic CRUD operations
const db = {
  // Users
  getUsers: () => readDB().users,
  getUserById: (id) => readDB().users.find(u => u.id === id),
  getUserByEmail: (email) => readDB().users.find(u => u.email === email),
  addUser: (user) => {
    const data = readDB();
    data.users.push(user);
    writeDB(data);
    return user;
  },
  updateUser: (id, updates) => {
    const data = readDB();
    const index = data.users.findIndex(u => u.id === id);
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...updates };
      writeDB(data);
      return data.users[index];
    }
    return null;
  },

  // Products
  getProducts: () => readDB().products,
  getProductById: (id) => readDB().products.find(p => p.id === id),
  getProductsByRetailer: (retailerId) => readDB().products.filter(p => p.retailerId === retailerId),
  getProductsByWholesaler: (wholesalerId) => readDB().products.filter(p => p.wholesalerId === wholesalerId),
  addProduct: (product) => {
    const data = readDB();
    data.products.push(product);
    writeDB(data);
    return product;
  },
  updateProduct: (id, updates) => {
    const data = readDB();
    const index = data.products.findIndex(p => p.id === id);
    if (index !== -1) {
      data.products[index] = { ...data.products[index], ...updates };
      writeDB(data);
      return data.products[index];
    }
    return null;
  },
  deleteProduct: (id) => {
    const data = readDB();
    data.products = data.products.filter(p => p.id !== id);
    writeDB(data);
    return true;
  },

  // Orders
  getOrders: () => readDB().orders,
  getOrderById: (id) => readDB().orders.find(o => o.id === id),
  getOrdersByCustomer: (customerId) => readDB().orders.filter(o => o.customerId === customerId),
  getOrdersByRetailer: (retailerId) => readDB().orders.filter(o => o.retailerId === retailerId),
  getOrdersByWholesaler: (wholesalerId) => readDB().orders.filter(o => o.wholesalerId === wholesalerId),
  addOrder: (order) => {
    const data = readDB();
    data.orders.push(order);
    writeDB(data);
    return order;
  },
  updateOrder: (id, updates) => {
    const data = readDB();
    const index = data.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      data.orders[index] = { ...data.orders[index], ...updates };
      writeDB(data);
      return data.orders[index];
    }
    return null;
  },

  // Feedback
  getFeedback: () => readDB().feedback,
  getFeedbackByProduct: (productId) => readDB().feedback.filter(f => f.productId === productId),
  addFeedback: (feedback) => {
    const data = readDB();
    data.feedback.push(feedback);
    writeDB(data);
    return feedback;
  },

  // Categories
  getCategories: () => readDB().categories
};

module.exports = db;

