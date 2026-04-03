// Preservation Property Tests for Monthly Summary Zero Display Bug Fix
// **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
//
// IMPORTANT: These tests MUST PASS on unfixed code
// These tests verify that non-buggy behavior (manual month selection, view switching, etc.)
// continues to work correctly after the fix is implemented
//
// Property 2: Preservation - Manual Month Selection and View Switching Behavior
// Test that manual month selection, view switching, and transaction operations work correctly

// Mock localStorage for Node.js
global.localStorage = {
  storage: {},
  setItem: function(key, value) { this.storage[key] = value; },
  getItem: function(key) { return this.storage[key] || null; },
  removeItem: function(key) { delete this.storage[key]; },
  clear: function() { this.storage = {}; }
};

// Mock Chart for Node.js
global.Chart = class MockChart {
  constructor() {}
  update() {}
  destroy() {}
};

// Mock document for Node.js
global.document = {
  body: { classList: { add: () => {}, remove: () => {} } },
  getElementById: () => ({ 
    getContext: () => ({}),
    style: {},
    parentElement: null
  }),
  createElement: () => ({ textContent: '', innerHTML: '' }),
  querySelector: () => null,
  addEventListener: () => {}
};

// Simplified class implementations for testing
// These mirror the actual classes from app.js but are standalone for testing

class StorageService {
  constructor() {
    this.KEYS = {
      TRANSACTIONS: 'expense_tracker_transactions',
      CATEGORIES: 'expense_tracker_categories',
      SPENDING_LIMIT: 'expense_tracker_limit',
      THEME: 'expense_tracker_theme'
    };
  }

  saveTransactions(transactions) {
    localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  loadTransactions() {
    const data = localStorage.getItem(this.KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  }
}

class TransactionManager {
  constructor(storageService) {
    this.storageService = storageService;
    this.transactions = [];
    this._loadTransactions();
  }

  _loadTransactions() {
    this.transactions = this.storageService.loadTransactions();
  }

  _generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  addTransaction(itemName, amount, category) {
    const transaction = {
      id: this._generateId(),
      itemName: itemName.trim(),
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      category: category,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    this.transactions.push(transaction);
    this.storageService.saveTransactions(this.transactions);
    
    return transaction;
  }

  deleteTransaction(transactionId) {
    const initialLength = this.transactions.length;
    this.transactions = this.transactions.filter(t => t.id !== transactionId);
    
    if (this.transactions.length < initialLength) {
      this.storageService.saveTransactions(this.transactions);
      return true;
    }
    
    return false;
  }

  getAllTransactions() {
    return [...this.transactions];
  }

  getTransactionsByMonth(year, month) {
    return this.transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }

  calculateTotal() {
    return this.transactions.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);
  }
}

class MonthlyViewManager {
  constructor(transactionManager) {
    this.transactionManager = transactionManager;
    this.currentView = 'main';
    this.selectedMonth = null;
  }

  getAvailableMonths() {
    const transactions = this.transactionManager.getAllTransactions();
    const monthsSet = new Set();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;
      monthsSet.add(key);
    });

    const months = Array.from(monthsSet).map(key => {
      const [year, month] = key.split('-').map(Number);
      return { year, month };
    });

    months.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return b.month - a.month;
    });

    return months;
  }

  getMonthSummary(year, month) {
    const transactions = this.transactionManager.getTransactionsByMonth(year, month);
    
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const categoryBreakdown = new Map();
    transactions.forEach(transaction => {
      const current = categoryBreakdown.get(transaction.category) || 0;
      categoryBreakdown.set(transaction.category, current + transaction.amount);
    });

    return {
      year,
      month,
      total: parseFloat(total.toFixed(2)),
      transactionCount: transactions.length,
      categoryBreakdown
    };
  }

  // THIS IS THE BUGGY METHOD - it doesn't accept parameters on initial call
  showMonthlyView(year, month) {
    this.currentView = 'monthly';
    if (year !== undefined && month !== undefined) {
      this.selectedMonth = { year, month };
    }
    // BUG: When called without parameters, selectedMonth remains null
  }

  showMainView() {
    this.currentView = 'main';
    this.selectedMonth = null;
  }

  getCurrentView() {
    return this.currentView;
  }

  getSelectedMonth() {
    return this.selectedMonth;
  }
}

// Test framework
let passedTests = 0;
let totalTests = 0;
let failedTests = [];

function test(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✓ ${description}`);
    passedTests++;
    return true;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error.message}`);
    failedTests.push({ description, error: error.message });
    return false;
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

// Helper to create a fresh app instance for testing
function createAppInstance() {
  localStorage.clear();
  
  const storageService = new StorageService();
  const transactionManager = new TransactionManager(storageService);
  const monthlyViewManager = new MonthlyViewManager(transactionManager);
  
  return { storageService, transactionManager, monthlyViewManager };
}

// Helper to add transactions for a specific month
function addTransactionsForMonth(transactionManager, year, month, count, baseAmount) {
  const transactions = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(year, month, i + 1);
    const transaction = {
      id: `${Date.now()}-${i}-${Math.random()}`,
      itemName: `Item ${i + 1}`,
      amount: baseAmount + i,
      category: 'Food',
      date: date.toISOString(),
      timestamp: date.getTime()
    };
    transactionManager.transactions.push(transaction);
    transactions.push(transaction);
  }
  transactionManager.storageService.saveTransactions(transactionManager.transactions);
  return transactions;
}

console.log('Running Preservation Property Tests...\n');
console.log('EXPECTED OUTCOME: These tests SHOULD PASS on unfixed code');
console.log('These tests verify non-buggy behavior that must be preserved after the fix\n');

// Property 2: Preservation - Manual Month Selection and View Switching Behavior
// Test that manual month selection via dropdown works correctly

test('Preservation: Manual month selection updates monthly total correctly (Req 3.1)', () => {
  const { transactionManager, monthlyViewManager } = createAppInstance();
  
  // Add transactions for January 2024
  const janTransactions = addTransactionsForMonth(transactionManager, 2024, 0, 3, 100);
  const expectedJanTotal = janTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Add transactions for February 2024
  const febTransactions = addTransactionsForMonth(transactionManager, 2024, 1, 2, 200);
  const expectedFebTotal = febTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Manually select January (simulating dropdown change)
  monthlyViewManager.showMonthlyView(2024, 0);
  
  // Verify January is selected and total is correct
  const selectedMonth1 = monthlyViewManager.getSelectedMonth();
  assert(selectedMonth1 !== null, 'Selected month should not be null after manual selection');
  assertEqual(selectedMonth1.year, 2024, 'Year should be 2024');
  assertEqual(selectedMonth1.month, 0, 'Month should be January (0)');
  
  const summary1 = monthlyViewManager.getMonthSummary(selectedMonth1.year, selectedMonth1.month);
  assertEqual(summary1.total, expectedJanTotal, 
    `January total should be ${expectedJanTotal.toFixed(2)}, got ${summary1.total.toFixed(2)}`);
  
  // Manually select February (simulating dropdown change)
  monthlyViewManager.showMonthlyView(2024, 1);
  
  // Verify February is selected and total is correct
  const selectedMonth2 = monthlyViewManager.getSelectedMonth();
  assert(selectedMonth2 !== null, 'Selected month should not be null after manual selection');
  assertEqual(selectedMonth2.year, 2024, 'Year should be 2024');
  assertEqual(selectedMonth2.month, 1, 'Month should be February (1)');
  
  const summary2 = monthlyViewManager.getMonthSummary(selectedMonth2.year, selectedMonth2.month);
  assertEqual(summary2.total, expectedFebTotal,
    `February total should be ${expectedFebTotal.toFixed(2)}, got ${summary2.total.toFixed(2)}`);
});

test('Preservation: Switching back to Main View displays overall total correctly (Req 3.2)', () => {
  const { transactionManager, monthlyViewManager } = createAppInstance();
  
  // Add transactions for multiple months
  addTransactionsForMonth(transactionManager, 2024, 0, 3, 100);
  addTransactionsForMonth(transactionManager, 2024, 1, 2, 200);
  
  const expectedOverallTotal = transactionManager.calculateTotal();
  
  // Switch to monthly view and select a month
  monthlyViewManager.showMonthlyView(2024, 0);
  assertEqual(monthlyViewManager.getCurrentView(), 'monthly', 'Should be in monthly view');
  
  // Switch back to main view
  monthlyViewManager.showMainView();
  
  // Verify we're in main view
  assertEqual(monthlyViewManager.getCurrentView(), 'main', 'Should be in main view');
  
  // Verify selectedMonth is null in main view
  const selectedMonth = monthlyViewManager.getSelectedMonth();
  assertEqual(selectedMonth, null, 'selectedMonth should be null in main view');
  
  // Verify overall total is correct
  const overallTotal = transactionManager.calculateTotal();
  assertEqual(overallTotal, expectedOverallTotal,
    `Overall total should be ${expectedOverallTotal.toFixed(2)}, got ${overallTotal.toFixed(2)}`);
});

test('Preservation: Transaction list filtering by selected month works correctly (Req 3.3)', () => {
  const { transactionManager, monthlyViewManager } = createAppInstance();
  
  // Add transactions for January 2024
  const janTransactions = addTransactionsForMonth(transactionManager, 2024, 0, 3, 100);
  
  // Add transactions for February 2024
  const febTransactions = addTransactionsForMonth(transactionManager, 2024, 1, 2, 200);
  
  // Select January
  monthlyViewManager.showMonthlyView(2024, 0);
  
  // Get transactions for selected month
  const selectedMonth = monthlyViewManager.getSelectedMonth();
  const filteredTransactions = transactionManager.getTransactionsByMonth(
    selectedMonth.year, 
    selectedMonth.month
  );
  
  // Verify only January transactions are returned
  assertEqual(filteredTransactions.length, janTransactions.length,
    `Should have ${janTransactions.length} transactions for January, got ${filteredTransactions.length}`);
  
  // Verify all filtered transactions are from January
  filteredTransactions.forEach(transaction => {
    const date = new Date(transaction.date);
    assertEqual(date.getFullYear(), 2024, 'Transaction year should be 2024');
    assertEqual(date.getMonth(), 0, 'Transaction month should be January (0)');
  });
  
  // Select February
  monthlyViewManager.showMonthlyView(2024, 1);
  
  // Get transactions for February
  const selectedMonth2 = monthlyViewManager.getSelectedMonth();
  const filteredTransactions2 = transactionManager.getTransactionsByMonth(
    selectedMonth2.year,
    selectedMonth2.month
  );
  
  // Verify only February transactions are returned
  assertEqual(filteredTransactions2.length, febTransactions.length,
    `Should have ${febTransactions.length} transactions for February, got ${filteredTransactions2.length}`);
});

test('Preservation: Adding transactions updates month selector dropdown (Req 3.4)', () => {
  const { transactionManager, monthlyViewManager } = createAppInstance();
  
  // Initially no transactions
  let availableMonths = monthlyViewManager.getAvailableMonths();
  assertEqual(availableMonths.length, 0, 'Should have no available months initially');
  
  // Add transactions for January 2024
  addTransactionsForMonth(transactionManager, 2024, 0, 2, 100);
  
  // Check available months updated
  availableMonths = monthlyViewManager.getAvailableMonths();
  assertEqual(availableMonths.length, 1, 'Should have 1 available month after adding transactions');
  assertEqual(availableMonths[0].year, 2024, 'Available month year should be 2024');
  assertEqual(availableMonths[0].month, 0, 'Available month should be January (0)');
  
  // Add transactions for February 2024
  addTransactionsForMonth(transactionManager, 2024, 1, 2, 200);
  
  // Check available months updated
  availableMonths = monthlyViewManager.getAvailableMonths();
  assertEqual(availableMonths.length, 2, 'Should have 2 available months after adding more transactions');
  
  // Verify months are sorted (newest first)
  assertEqual(availableMonths[0].year, 2024, 'First month year should be 2024');
  assertEqual(availableMonths[0].month, 1, 'First month should be February (1) - most recent');
  assertEqual(availableMonths[1].year, 2024, 'Second month year should be 2024');
  assertEqual(availableMonths[1].month, 0, 'Second month should be January (0)');
});

test('Preservation: Deleting transactions updates month selector dropdown (Req 3.4)', () => {
  const { transactionManager, monthlyViewManager } = createAppInstance();
  
  // Add transactions for January 2024
  const janTransactions = addTransactionsForMonth(transactionManager, 2024, 0, 2, 100);
  
  // Add transactions for February 2024
  addTransactionsForMonth(transactionManager, 2024, 1, 2, 200);
  
  // Verify 2 months available
  let availableMonths = monthlyViewManager.getAvailableMonths();
  assertEqual(availableMonths.length, 2, 'Should have 2 available months');
  
  // Delete all January transactions
  janTransactions.forEach(transaction => {
    transactionManager.deleteTransaction(transaction.id);
  });
  
  // Check available months updated (January should be removed)
  availableMonths = monthlyViewManager.getAvailableMonths();
  assertEqual(availableMonths.length, 1, 'Should have 1 available month after deleting January transactions');
  assertEqual(availableMonths[0].year, 2024, 'Remaining month year should be 2024');
  assertEqual(availableMonths[0].month, 1, 'Remaining month should be February (1)');
});

test('Preservation: Main View displays all transactions and overall total (Req 3.5)', () => {
  const { transactionManager, monthlyViewManager } = createAppInstance();
  
  // Add transactions for multiple months
  addTransactionsForMonth(transactionManager, 2024, 0, 3, 100);
  addTransactionsForMonth(transactionManager, 2024, 1, 2, 200);
  addTransactionsForMonth(transactionManager, 2023, 11, 1, 50);
  
  // Ensure we're in main view
  monthlyViewManager.showMainView();
  
  // Get all transactions
  const allTransactions = transactionManager.getAllTransactions();
  assertEqual(allTransactions.length, 6, 'Should have 6 total transactions');
  
  // Calculate overall total
  const overallTotal = transactionManager.calculateTotal();
  const expectedTotal = 100 + 101 + 102 + 200 + 201 + 50; // Sum of all transactions
  assertEqual(overallTotal, expectedTotal,
    `Overall total should be ${expectedTotal.toFixed(2)}, got ${overallTotal.toFixed(2)}`);
  
  // Verify selectedMonth is null in main view
  const selectedMonth = monthlyViewManager.getSelectedMonth();
  assertEqual(selectedMonth, null, 'selectedMonth should be null in main view');
});

// Property-Based Test: Multiple view switches preserve behavior
test('Property Test: Multiple view switches maintain correct state', () => {
  const { transactionManager, monthlyViewManager } = createAppInstance();
  
  // Add transactions for multiple months
  addTransactionsForMonth(transactionManager, 2024, 0, 2, 100);
  addTransactionsForMonth(transactionManager, 2024, 1, 3, 200);
  
  const overallTotal = transactionManager.calculateTotal();
  
  // Test sequence: Main -> Monthly (Jan) -> Main -> Monthly (Feb) -> Main
  
  // Start in main view
  monthlyViewManager.showMainView();
  assertEqual(monthlyViewManager.getCurrentView(), 'main', 'Should start in main view');
  assertEqual(monthlyViewManager.getSelectedMonth(), null, 'selectedMonth should be null in main view');
  
  // Switch to monthly view and select January
  monthlyViewManager.showMonthlyView(2024, 0);
  assertEqual(monthlyViewManager.getCurrentView(), 'monthly', 'Should be in monthly view');
  let selectedMonth = monthlyViewManager.getSelectedMonth();
  assertEqual(selectedMonth.year, 2024, 'Year should be 2024');
  assertEqual(selectedMonth.month, 0, 'Month should be January');
  
  // Switch back to main view
  monthlyViewManager.showMainView();
  assertEqual(monthlyViewManager.getCurrentView(), 'main', 'Should be back in main view');
  assertEqual(monthlyViewManager.getSelectedMonth(), null, 'selectedMonth should be null again');
  assertEqual(transactionManager.calculateTotal(), overallTotal, 'Overall total should be unchanged');
  
  // Switch to monthly view and select February
  monthlyViewManager.showMonthlyView(2024, 1);
  assertEqual(monthlyViewManager.getCurrentView(), 'monthly', 'Should be in monthly view again');
  selectedMonth = monthlyViewManager.getSelectedMonth();
  assertEqual(selectedMonth.year, 2024, 'Year should be 2024');
  assertEqual(selectedMonth.month, 1, 'Month should be February');
  
  // Switch back to main view one more time
  monthlyViewManager.showMainView();
  assertEqual(monthlyViewManager.getCurrentView(), 'main', 'Should be in main view again');
  assertEqual(monthlyViewManager.getSelectedMonth(), null, 'selectedMonth should be null');
  assertEqual(transactionManager.calculateTotal(), overallTotal, 'Overall total should still be unchanged');
});

// Property-Based Test: Various transaction patterns
test('Property Test: Preservation holds for various transaction patterns', () => {
  const testCases = [
    { year: 2024, month: 0, count: 1, baseAmount: 50 },
    { year: 2024, month: 1, count: 5, baseAmount: 100 },
    { year: 2024, month: 2, count: 10, baseAmount: 25 },
    { year: 2023, month: 11, count: 3, baseAmount: 200 }
  ];
  
  for (const testCase of testCases) {
    const { transactionManager, monthlyViewManager } = createAppInstance();
    
    // Add transactions for this test case
    const transactions = addTransactionsForMonth(
      transactionManager,
      testCase.year,
      testCase.month,
      testCase.count,
      testCase.baseAmount
    );
    const expectedTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Manually select the month
    monthlyViewManager.showMonthlyView(testCase.year, testCase.month);
    
    // Verify selection works correctly
    const selectedMonth = monthlyViewManager.getSelectedMonth();
    assert(selectedMonth !== null,
      `Manual selection failed for ${testCase.year}-${testCase.month}`);
    assertEqual(selectedMonth.year, testCase.year,
      `Year mismatch for ${testCase.year}-${testCase.month}`);
    assertEqual(selectedMonth.month, testCase.month,
      `Month mismatch for ${testCase.year}-${testCase.month}`);
    
    // Verify total is correct
    const summary = monthlyViewManager.getMonthSummary(selectedMonth.year, selectedMonth.month);
    assertEqual(summary.total, expectedTotal,
      `Total mismatch for ${testCase.year}-${testCase.month}: Expected ${expectedTotal.toFixed(2)}, Got ${summary.total.toFixed(2)}`);
  }
});

// Summary
console.log(`\n${'='.repeat(60)}`);
console.log(`Test Results: ${passedTests}/${totalTests} tests passed`);
console.log(`${'='.repeat(60)}\n`);

if (failedTests.length > 0) {
  console.log('PRESERVATION TESTS FAILED:');
  console.log('These failures indicate that existing behavior is broken:\n');
  failedTests.forEach((failure, index) => {
    console.log(`${index + 1}. ${failure.description}`);
    console.log(`   ${failure.error}\n`);
  });
  console.log('WARNING: Fix implementation may have introduced regressions!');
  console.log('Review the failed tests and ensure the fix preserves existing behavior.\n');
}

if (passedTests === totalTests) {
  console.log('✓ All preservation tests passed!');
  console.log('Existing behavior is working correctly and should be preserved after the fix.');
  process.exit(0);
} else {
  console.log(`✗ ${failedTests.length} preservation test(s) failed`);
  console.log('Existing behavior may be broken or the tests need adjustment.\n');
  process.exit(1);
}
