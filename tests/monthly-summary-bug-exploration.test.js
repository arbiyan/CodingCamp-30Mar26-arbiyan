// Bug Condition Exploration Test for Monthly Summary Zero Display Bug
// **Validates: Requirements 1.1, 1.2, 1.3, 2.1, 2.2**
//
// CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
// DO NOT attempt to fix the test or the code when it fails
// This test encodes the expected behavior - it will validate the fix when it passes after implementation
//
// Property 1: Bug Condition - Monthly Summary Shows Zero on Initial Switch
// Test that when user switches to Monthly Summary view with transactions present,
// the most recent month is automatically selected and its total is displayed (not $0.00)
//
// NOTE: This test file is designed to run in a browser environment with app.js loaded
// Run this test by opening test-monthly-summary-bug.html in a browser

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
  // Clear localStorage to start fresh
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
      id: `${Date.now()}-${i}`,
      itemName: `Item ${i + 1}`,
      amount: baseAmount + i,
      category: 'Food',
      date: date.toISOString(),
      timestamp: date.getTime()
    };
    transactionManager.transactions.push(transaction);
    transactions.push(transaction);
  }
  return transactions;
}

console.log('Running Bug Condition Exploration Tests...\n');
console.log('EXPECTED OUTCOME: These tests SHOULD FAIL on unfixed code');
console.log('Failure confirms the bug exists and helps understand the root cause\n');

// Property 1: Bug Condition - Monthly Summary Shows Zero on Initial Switch
// Scoped PBT: Test concrete failing cases - switching to Monthly Summary view when transactions exist

test('Bug Condition: Single month with transactions - should auto-select month and show correct total', () => {
  const { transactionManager, monthlyViewManager } = createAppInstance();
  
  // Add transactions for January 2024
  const transactions = addTransactionsForMonth(transactionManager, 2024, 0, 3, 100);
  const expectedTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Get available months
  const availableMonths = monthlyViewManager.getAvailableMonths();
  assert(availableMonths.length > 0, 'Should have available months');
  
  // Simulate user clicking "Monthly Summary" button
  // This is what _handleViewChange does when view === 'monthly'
  monthlyViewManager.showMonthlyView();
  
  // Check bug condition: selectedMonth should NOT be null (but it is on unfixed code)
  const selectedMonth = monthlyViewManager.getSelectedMonth();
  
  // EXPECTED BEHAVIOR: Most recent month should be auto-selected
  assert(selectedMonth !== null, 
    `Bug detected: selectedMonth is null after switching to monthly view. Expected: {year: 2024, month: 0}, Got: null`);
  
  // EXPECTED BEHAVIOR: Selected month should be the most recent (first in list)
  const mostRecentMonth = availableMonths[0];
  assertEqual(selectedMonth.year, mostRecentMonth.year, 
    `Bug detected: Wrong year selected. Expected: ${mostRecentMonth.year}, Got: ${selectedMonth.year}`);
  assertEqual(selectedMonth.month, mostRecentMonth.month,
    `Bug detected: Wrong month selected. Expected: ${mostRecentMonth.month}, Got: ${selectedMonth.month}`);
  
  // EXPECTED BEHAVIOR: Monthly total should show correct amount (not $0.00)
  const summary = monthlyViewManager.getMonthSummary(selectedMonth.year, selectedMonth.month);
  assert(summary.total > 0, 
    `Bug detected: Monthly total is $0.00 when it should be $${expectedTotal.toFixed(2)}`);
  assertEqual(summary.total, expectedTotal,
    `Bug detected: Monthly total is incorrect. Expected: $${expectedTotal.toFixed(2)}, Got: $${summary.total.toFixed(2)}`);
});

test('Bug Condition: Multiple months with transactions - should auto-select most recent month', () => {
  const { transactionManager, monthlyViewManager } = createAppInstance();
  
  // Add transactions for January 2024
  addTransactionsForMonth(transactionManager, 2024, 0, 2, 50);
  
  // Add transactions for February 2024 (more recent)
  const febTransactions = addTransactionsForMonth(transactionManager, 2024, 1, 3, 150);
  const expectedFebTotal = febTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Get available months
  const availableMonths = monthlyViewManager.getAvailableMonths();
  assert(availableMonths.length === 2, 'Should have 2 available months');
  
  // Most recent should be February (month 1)
  const mostRecentMonth = availableMonths[0];
  assertEqual(mostRecentMonth.year, 2024, 'Most recent year should be 2024');
  assertEqual(mostRecentMonth.month, 1, 'Most recent month should be February (1)');
  
  // Simulate user clicking "Monthly Summary" button
  monthlyViewManager.showMonthlyView();
  
  // Check bug condition
  const selectedMonth = monthlyViewManager.getSelectedMonth();
  
  // EXPECTED BEHAVIOR: Most recent month (February) should be auto-selected
  assert(selectedMonth !== null,
    `Bug detected: selectedMonth is null. Expected: {year: 2024, month: 1}, Got: null`);
  assertEqual(selectedMonth.year, 2024,
    `Bug detected: Wrong year. Expected: 2024, Got: ${selectedMonth.year}`);
  assertEqual(selectedMonth.month, 1,
    `Bug detected: Wrong month. Expected: 1 (February), Got: ${selectedMonth.month}`);
  
  // EXPECTED BEHAVIOR: Should show February's total, not $0.00
  const summary = monthlyViewManager.getMonthSummary(selectedMonth.year, selectedMonth.month);
  assert(summary.total > 0,
    `Bug detected: Total is $0.00 when it should be $${expectedFebTotal.toFixed(2)}`);
  assertEqual(summary.total, expectedFebTotal,
    `Bug detected: Total is incorrect. Expected: $${expectedFebTotal.toFixed(2)}, Got: $${summary.total.toFixed(2)}`);
});

test('Bug Condition: Transactions across multiple years - should auto-select most recent', () => {
  const { transactionManager, monthlyViewManager } = createAppInstance();
  
  // Add transactions for December 2023
  addTransactionsForMonth(transactionManager, 2023, 11, 2, 100);
  
  // Add transactions for January 2024 (more recent year)
  const jan2024Transactions = addTransactionsForMonth(transactionManager, 2024, 0, 3, 200);
  const expectedTotal = jan2024Transactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Get available months
  const availableMonths = monthlyViewManager.getAvailableMonths();
  assert(availableMonths.length === 2, 'Should have 2 available months');
  
  // Most recent should be January 2024
  const mostRecentMonth = availableMonths[0];
  assertEqual(mostRecentMonth.year, 2024, 'Most recent year should be 2024');
  assertEqual(mostRecentMonth.month, 0, 'Most recent month should be January (0)');
  
  // Simulate user clicking "Monthly Summary" button
  monthlyViewManager.showMonthlyView();
  
  // Check bug condition
  const selectedMonth = monthlyViewManager.getSelectedMonth();
  
  // EXPECTED BEHAVIOR: January 2024 should be auto-selected
  assert(selectedMonth !== null,
    `Bug detected: selectedMonth is null. Expected: {year: 2024, month: 0}, Got: null`);
  assertEqual(selectedMonth.year, 2024,
    `Bug detected: Wrong year. Expected: 2024, Got: ${selectedMonth.year}`);
  assertEqual(selectedMonth.month, 0,
    `Bug detected: Wrong month. Expected: 0 (January), Got: ${selectedMonth.month}`);
  
  // EXPECTED BEHAVIOR: Should show January 2024's total
  const summary = monthlyViewManager.getMonthSummary(selectedMonth.year, selectedMonth.month);
  assertEqual(summary.total, expectedTotal,
    `Bug detected: Total is incorrect. Expected: $${expectedTotal.toFixed(2)}, Got: $${summary.total.toFixed(2)}`);
});

test('Edge Case: No transactions - should handle gracefully (this should pass even on unfixed code)', () => {
  const { transactionManager, monthlyViewManager } = createAppInstance();
  
  // No transactions added
  const availableMonths = monthlyViewManager.getAvailableMonths();
  assertEqual(availableMonths.length, 0, 'Should have no available months');
  
  // Simulate user clicking "Monthly Summary" button
  monthlyViewManager.showMonthlyView();
  
  // Check that selectedMonth is null (this is correct behavior when no months exist)
  const selectedMonth = monthlyViewManager.getSelectedMonth();
  assertEqual(selectedMonth, null, 'selectedMonth should be null when no transactions exist');
  
  // This edge case should work correctly even on unfixed code
  console.log('  Note: This edge case works correctly - $0.00 is expected when no transactions exist');
});

// Property-Based Test: Generate multiple test cases with varying transaction counts and amounts
test('Property Test: Auto-selection works for various transaction patterns', () => {
  // Generate test cases with different patterns
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
    
    // Simulate switching to monthly view
    monthlyViewManager.showMonthlyView();
    
    // Verify bug condition
    const selectedMonth = monthlyViewManager.getSelectedMonth();
    assert(selectedMonth !== null,
      `Bug detected for case ${testCase.year}-${testCase.month}: selectedMonth is null`);
    
    const summary = monthlyViewManager.getMonthSummary(selectedMonth.year, selectedMonth.month);
    assert(summary.total === expectedTotal,
      `Bug detected for case ${testCase.year}-${testCase.month}: Expected $${expectedTotal.toFixed(2)}, Got $${summary.total.toFixed(2)}`);
  }
});

// Summary
console.log(`\n${'='.repeat(60)}`);
console.log(`Test Results: ${passedTests}/${totalTests} tests passed`);
console.log(`${'='.repeat(60)}\n`);

if (failedTests.length > 0) {
  console.log('COUNTEREXAMPLES FOUND (Bug Confirmed):');
  console.log('These failures demonstrate the bug exists:\n');
  failedTests.forEach((failure, index) => {
    console.log(`${index + 1}. ${failure.description}`);
    console.log(`   ${failure.error}\n`);
  });
  console.log('Root Cause Analysis:');
  console.log('- _handleViewChange method calls showMonthlyView() without parameters');
  console.log('- This leaves selectedMonth as null when switching to Monthly Summary view');
  console.log('- _updateMonthlyTotal displays $0.00 when selectedMonth is null');
  console.log('- Expected: Auto-select most recent month and display its total\n');
}

if (passedTests === totalTests) {
  console.log('✓ All tests passed! The bug has been fixed.');
} else {
  console.log(`✗ ${failedTests.length} test(s) failed (Expected on unfixed code)`);
  console.log('This confirms the bug exists and needs to be fixed.\n');
}
