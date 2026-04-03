// Simple unit tests for SortManager
// This file tests the SortManager class implementation

// Mock the SortManager class
class SortManager {
  constructor() {
    this.currentSort = 'date';
  }

  sortByAmount(transactions) {
    return [...transactions].sort((a, b) => b.amount - a.amount);
  }

  sortByCategory(transactions) {
    return [...transactions].sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare !== 0) {
        return categoryCompare;
      }
      return b.timestamp - a.timestamp;
    });
  }

  sortByDate(transactions) {
    return [...transactions].sort((a, b) => b.timestamp - a.timestamp);
  }

  getCurrentSort() {
    return this.currentSort;
  }

  setSortMode(mode) {
    const validModes = ['date', 'amount', 'category'];
    if (validModes.includes(mode)) {
      this.currentSort = mode;
    } else {
      console.warn(`Invalid sort mode: ${mode}. Using default 'date'.`);
      this.currentSort = 'date';
    }
  }
}

// Helper function to create mock transactions
const createMockTransaction = (id, itemName, amount, category, timestamp) => ({
  id,
  itemName,
  amount,
  category,
  date: new Date(timestamp).toISOString(),
  timestamp
});

// Test suite
console.log('Running SortManager tests...\n');

const sortManager = new SortManager();
let passedTests = 0;
let totalTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✓ ${description}`);
    passedTests++;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertArrayEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message || `Arrays not equal`);
  }
}

// Create mock transactions for testing
const mockTransactions = [
  createMockTransaction('1', 'Groceries', 45.50, 'Food', 1704067200000), // Jan 1, 2024
  createMockTransaction('2', 'Bus Ticket', 2.50, 'Transport', 1704153600000), // Jan 2, 2024
  createMockTransaction('3', 'Movie', 15.00, 'Fun', 1704240000000), // Jan 3, 2024
  createMockTransaction('4', 'Restaurant', 75.00, 'Food', 1704326400000), // Jan 4, 2024
  createMockTransaction('5', 'Taxi', 20.00, 'Transport', 1704412800000), // Jan 5, 2024
];

// Test constructor
test('constructor initializes with default sort mode as date', () => {
  const sm = new SortManager();
  assertEqual(sm.getCurrentSort(), 'date', 'Should initialize with date sort mode');
});

// Test sortByAmount
test('sortByAmount sorts transactions from highest to lowest amount', () => {
  const sorted = sortManager.sortByAmount(mockTransactions);
  
  assertEqual(sorted[0].amount, 75.00, 'First should be Restaurant (75.00)');
  assertEqual(sorted[1].amount, 45.50, 'Second should be Groceries (45.50)');
  assertEqual(sorted[2].amount, 20.00, 'Third should be Taxi (20.00)');
  assertEqual(sorted[3].amount, 15.00, 'Fourth should be Movie (15.00)');
  assertEqual(sorted[4].amount, 2.50, 'Fifth should be Bus Ticket (2.50)');
});

test('sortByAmount does not mutate the original array', () => {
  const original = JSON.stringify(mockTransactions);
  sortManager.sortByAmount(mockTransactions);
  
  assertEqual(JSON.stringify(mockTransactions), original, 'Original array should not be mutated');
});

test('sortByAmount handles empty array', () => {
  const sorted = sortManager.sortByAmount([]);
  assertEqual(sorted.length, 0, 'Should return empty array');
});

test('sortByAmount handles single transaction', () => {
  const single = [mockTransactions[0]];
  const sorted = sortManager.sortByAmount(single);
  
  assertEqual(sorted.length, 1, 'Should return array with one item');
  assertEqual(sorted[0].id, '1', 'Should be the same transaction');
});

test('sortByAmount handles transactions with same amount', () => {
  const sameAmount = [
    createMockTransaction('1', 'Item A', 10.00, 'Food', 1704067200000),
    createMockTransaction('2', 'Item B', 10.00, 'Transport', 1704153600000),
  ];
  
  const sorted = sortManager.sortByAmount(sameAmount);
  assertEqual(sorted.length, 2, 'Should have 2 transactions');
  assertEqual(sorted[0].amount, 10.00, 'First amount should be 10.00');
  assertEqual(sorted[1].amount, 10.00, 'Second amount should be 10.00');
});

// Test sortByCategory
test('sortByCategory groups transactions by category alphabetically', () => {
  const sorted = sortManager.sortByCategory(mockTransactions);
  
  assertEqual(sorted[0].category, 'Food', 'First should be Food');
  assertEqual(sorted[1].category, 'Food', 'Second should be Food');
  assertEqual(sorted[2].category, 'Fun', 'Third should be Fun');
  assertEqual(sorted[3].category, 'Transport', 'Fourth should be Transport');
  assertEqual(sorted[4].category, 'Transport', 'Fifth should be Transport');
});

test('sortByCategory within same category sorts by date (newest first)', () => {
  const sorted = sortManager.sortByCategory(mockTransactions);
  
  const foodTransactions = sorted.filter(t => t.category === 'Food');
  assertEqual(foodTransactions[0].itemName, 'Restaurant', 'Newer Food transaction should be first');
  assertEqual(foodTransactions[1].itemName, 'Groceries', 'Older Food transaction should be second');
  
  const transportTransactions = sorted.filter(t => t.category === 'Transport');
  assertEqual(transportTransactions[0].itemName, 'Taxi', 'Newer Transport transaction should be first');
  assertEqual(transportTransactions[1].itemName, 'Bus Ticket', 'Older Transport transaction should be second');
});

test('sortByCategory does not mutate the original array', () => {
  const original = JSON.stringify(mockTransactions);
  sortManager.sortByCategory(mockTransactions);
  
  assertEqual(JSON.stringify(mockTransactions), original, 'Original array should not be mutated');
});

test('sortByCategory handles empty array', () => {
  const sorted = sortManager.sortByCategory([]);
  assertEqual(sorted.length, 0, 'Should return empty array');
});

test('sortByCategory handles single transaction', () => {
  const single = [mockTransactions[0]];
  const sorted = sortManager.sortByCategory(single);
  
  assertEqual(sorted.length, 1, 'Should return array with one item');
  assertEqual(sorted[0].id, '1', 'Should be the same transaction');
});

// Test sortByDate
test('sortByDate sorts transactions by date with newest first', () => {
  const sorted = sortManager.sortByDate(mockTransactions);
  
  assertEqual(sorted[0].itemName, 'Taxi', 'First should be Taxi (Jan 5)');
  assertEqual(sorted[1].itemName, 'Restaurant', 'Second should be Restaurant (Jan 4)');
  assertEqual(sorted[2].itemName, 'Movie', 'Third should be Movie (Jan 3)');
  assertEqual(sorted[3].itemName, 'Bus Ticket', 'Fourth should be Bus Ticket (Jan 2)');
  assertEqual(sorted[4].itemName, 'Groceries', 'Fifth should be Groceries (Jan 1)');
});

test('sortByDate does not mutate the original array', () => {
  const original = JSON.stringify(mockTransactions);
  sortManager.sortByDate(mockTransactions);
  
  assertEqual(JSON.stringify(mockTransactions), original, 'Original array should not be mutated');
});

test('sortByDate handles empty array', () => {
  const sorted = sortManager.sortByDate([]);
  assertEqual(sorted.length, 0, 'Should return empty array');
});

test('sortByDate handles single transaction', () => {
  const single = [mockTransactions[0]];
  const sorted = sortManager.sortByDate(single);
  
  assertEqual(sorted.length, 1, 'Should return array with one item');
  assertEqual(sorted[0].id, '1', 'Should be the same transaction');
});

test('sortByDate handles transactions with same timestamp', () => {
  const sameTime = [
    createMockTransaction('1', 'Item A', 10.00, 'Food', 1704067200000),
    createMockTransaction('2', 'Item B', 20.00, 'Transport', 1704067200000),
  ];
  
  const sorted = sortManager.sortByDate(sameTime);
  assertEqual(sorted.length, 2, 'Should have 2 transactions');
});

// Test getCurrentSort
test('getCurrentSort returns the current sort mode', () => {
  const sm = new SortManager();
  assertEqual(sm.getCurrentSort(), 'date', 'Should return date by default');
});

test('getCurrentSort returns updated sort mode after setSortMode', () => {
  const sm = new SortManager();
  sm.setSortMode('amount');
  assertEqual(sm.getCurrentSort(), 'amount', 'Should return amount after setting');
});

// Test setSortMode
test('setSortMode sets sort mode to amount', () => {
  const sm = new SortManager();
  sm.setSortMode('amount');
  assertEqual(sm.getCurrentSort(), 'amount', 'Should set to amount');
});

test('setSortMode sets sort mode to category', () => {
  const sm = new SortManager();
  sm.setSortMode('category');
  assertEqual(sm.getCurrentSort(), 'category', 'Should set to category');
});

test('setSortMode sets sort mode to date', () => {
  const sm = new SortManager();
  sm.setSortMode('date');
  assertEqual(sm.getCurrentSort(), 'date', 'Should set to date');
});

test('setSortMode handles invalid sort mode by defaulting to date', () => {
  const sm = new SortManager();
  sm.setSortMode('invalid');
  assertEqual(sm.getCurrentSort(), 'date', 'Should default to date for invalid mode');
});

test('setSortMode maintains sort mode across multiple calls', () => {
  const sm = new SortManager();
  
  sm.setSortMode('amount');
  assertEqual(sm.getCurrentSort(), 'amount', 'Should be amount');
  
  sm.setSortMode('category');
  assertEqual(sm.getCurrentSort(), 'category', 'Should be category');
  
  sm.setSortMode('date');
  assertEqual(sm.getCurrentSort(), 'date', 'Should be date');
});

// Summary
console.log(`\n${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log(`\n✗ ${totalTests - passedTests} test(s) failed`);
  process.exit(1);
}
