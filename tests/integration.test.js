// Integration Tests for Expense & Budget Visualizer
// Task 18.1: Wire all components together

/**
 * These integration tests verify that all components work together correctly:
 * - Form submission creates transaction, updates list, chart, and total
 * - Deletion removes transaction, updates list, chart, and total
 * - Custom category creation appears in selector
 * - Sort controls reorder transaction list correctly
 * - Monthly view filters and displays correct data
 * - Budget alert appears when limit exceeded
 * - Theme toggle switches all UI components
 * - All data persists across page reloads
 */

// This is a manual integration test checklist
// Run the application in a browser and verify each scenario

console.log('Integration Test Checklist for Task 18.1\n');
console.log('=========================================\n');

const testScenarios = [
  {
    id: 1,
    name: 'Form submission creates transaction and updates all UI components',
    steps: [
      '1. Open index.html in a browser',
      '2. Fill in the form: Item Name="Grocery Shopping", Amount="45.50", Category="Food"',
      '3. Click "Add Transaction" button',
      '4. Verify transaction appears in the transaction list with correct details',
      '5. Verify total expense display shows "$45.50"',
      '6. Verify chart updates to show Food category',
      '7. Verify form fields are cleared after submission',
      '8. Open browser DevTools > Application > Local Storage',
      '9. Verify "expense_tracker_transactions" contains the new transaction'
    ],
    expected: 'Transaction is created, list shows it, total updates, chart updates, form clears, data persists'
  },
  {
    id: 2,
    name: 'Deletion removes transaction and updates all UI components',
    steps: [
      '1. Add a transaction (e.g., "Coffee", "$5.00", "Food")',
      '2. Verify transaction appears in the list',
      '3. Verify total shows "$5.00"',
      '4. Click the delete button (×) on the transaction',
      '5. Verify transaction is removed from the list',
      '6. Verify total updates to "$0.00"',
      '7. Verify chart updates (should show empty state)',
      '8. Check Local Storage - transaction should be removed'
    ],
    expected: 'Transaction is deleted, list updates, total updates, chart updates, data removed from storage'
  },
  {
    id: 3,
    name: 'Custom category creation appears in selector',
    steps: [
      '1. Scroll to "Add Custom Category" section',
      '2. Enter "Healthcare" in the custom category input',
      '3. Click "Add Category" button',
      '4. Verify input field is cleared',
      '5. Check the Category dropdown in the transaction form',
      '6. Verify "Healthcare" appears as an option',
      '7. Check Local Storage for "expense_tracker_categories"',
      '8. Verify "Healthcare" is stored',
      '9. Try adding a duplicate category - should show error'
    ],
    expected: 'Custom category is added, appears in dropdown, persists in storage, duplicates rejected'
  },
  {
    id: 4,
    name: 'Sort controls reorder transaction list correctly',
    steps: [
      '1. Add multiple transactions:',
      '   - "Lunch", "$15.00", "Food"',
      '   - "Bus Ticket", "$3.50", "Transport"',
      '   - "Movie", "$12.00", "Fun"',
      '2. Verify all 3 transactions appear in the list (newest first by default)',
      '3. Change sort dropdown to "Amount (High to Low)"',
      '4. Verify transactions are reordered: Lunch ($15), Movie ($12), Bus ($3.50)',
      '5. Change sort dropdown to "Category"',
      '6. Verify transactions are grouped alphabetically: Food, Fun, Transport',
      '7. Change sort dropdown back to "Date (Newest First)"',
      '8. Verify transactions return to chronological order'
    ],
    expected: 'Sort controls correctly reorder the transaction list by amount, category, and date'
  },
  {
    id: 5,
    name: 'Monthly view filters and displays correct data',
    steps: [
      '1. Add several transactions (they will be in current month)',
      '2. Click "Monthly Summary" button',
      '3. Verify view switches to monthly summary',
      '4. Verify "Monthly Summary" button is highlighted/active',
      '5. Verify month selector dropdown shows available months',
      '6. Select a month from the dropdown',
      '7. Verify monthly total is displayed',
      '8. Verify only transactions from that month are shown',
      '9. Click "Main View" button',
      '10. Verify view switches back to main view with all transactions'
    ],
    expected: 'Monthly view correctly filters transactions by month and displays monthly totals'
  },
  {
    id: 6,
    name: 'Budget alert appears when limit exceeded',
    steps: [
      '1. Set spending limit to "$10.00" and click "Set Limit"',
      '2. Verify no alert appears initially',
      '3. Add a transaction: "Expensive Item", "$15.00", "Food"',
      '4. Verify budget alert appears with warning message',
      '5. Verify alert mentions the limit amount ($10.00)',
      '6. Verify total expense display has special styling (over-budget class)',
      '7. Check Local Storage for "expense_tracker_limit"',
      '8. Verify limit value is stored',
      '9. Delete the transaction',
      '10. Verify alert disappears when under budget'
    ],
    expected: 'Budget alert appears when spending exceeds limit, styling changes, alert disappears when under budget'
  },
  {
    id: 7,
    name: 'Theme toggle switches all UI components',
    steps: [
      '1. Note the current theme (light or dark)',
      '2. Click the theme toggle button (moon/sun icon)',
      '3. Verify background color changes',
      '4. Verify text colors change',
      '5. Verify all UI components (form, list, chart, buttons) update to new theme',
      '6. Verify theme icon changes (moon ↔ sun)',
      '7. Check Local Storage for "expense_tracker_theme"',
      '8. Verify theme preference is stored',
      '9. Toggle theme again',
      '10. Verify theme switches back'
    ],
    expected: 'Theme toggle switches between light and dark mode, all components update, preference persists'
  },
  {
    id: 8,
    name: 'All data persists across page reloads',
    steps: [
      '1. Clear all data (delete all transactions, clear storage if needed)',
      '2. Add a transaction: "Test Item", "$25.00", "Food"',
      '3. Add a custom category: "Education"',
      '4. Set spending limit: "$100.00"',
      '5. Toggle theme to dark mode',
      '6. Verify all changes are visible',
      '7. Refresh the page (F5 or Ctrl+R)',
      '8. Verify transaction is still displayed',
      '9. Verify total still shows "$25.00"',
      '10. Verify "Education" is still in category dropdown',
      '11. Verify dark theme is still applied',
      '12. Verify chart shows the transaction data'
    ],
    expected: 'All data (transactions, categories, limit, theme) persists after page reload'
  }
];

console.log('MANUAL INTEGRATION TEST SCENARIOS');
console.log('==================================\n');

testScenarios.forEach(scenario => {
  console.log(`\nTest ${scenario.id}: ${scenario.name}`);
  console.log('-'.repeat(80));
  console.log('\nSteps:');
  scenario.steps.forEach(step => console.log(`  ${step}`));
  console.log(`\nExpected Result:`);
  console.log(`  ${scenario.expected}`);
  console.log('\n');
});

console.log('\n' + '='.repeat(80));
console.log('AUTOMATED VERIFICATION');
console.log('='.repeat(80) + '\n');

// Simple automated checks that can run in Node.js
console.log('Running automated component integration checks...\n');

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

// Test that all required classes exist in app.js
const fs = require('fs');
const path = require('path');

try {
  const appJs = fs.readFileSync(path.resolve(__dirname, '../js/app.js'), 'utf8');

  test('StorageService class exists', () => {
    assert(appJs.includes('class StorageService'), 'StorageService class should exist');
  });

  test('ValidationService class exists', () => {
    assert(appJs.includes('class ValidationService'), 'ValidationService class should exist');
  });

  test('TransactionManager class exists', () => {
    assert(appJs.includes('class TransactionManager'), 'TransactionManager class should exist');
  });

  test('CategoryManager class exists', () => {
    assert(appJs.includes('class CategoryManager'), 'CategoryManager class should exist');
  });

  test('SortManager class exists', () => {
    assert(appJs.includes('class SortManager'), 'SortManager class should exist');
  });

  test('BudgetManager class exists', () => {
    assert(appJs.includes('class BudgetManager'), 'BudgetManager class should exist');
  });

  test('MonthlyViewManager class exists', () => {
    assert(appJs.includes('class MonthlyViewManager'), 'MonthlyViewManager class should exist');
  });

  test('ThemeManager class exists', () => {
    assert(appJs.includes('class ThemeManager'), 'ThemeManager class should exist');
  });

  test('ChartComponent class exists', () => {
    assert(appJs.includes('class ChartComponent'), 'ChartComponent class should exist');
  });

  test('UIController class exists', () => {
    assert(appJs.includes('class UIController'), 'UIController class should exist');
  });

  test('DOMContentLoaded event listener exists', () => {
    assert(appJs.includes('DOMContentLoaded'), 'DOMContentLoaded listener should exist');
  });

  test('All managers are instantiated in main entry point', () => {
    assert(appJs.includes('new StorageService()'), 'StorageService should be instantiated');
    assert(appJs.includes('new TransactionManager'), 'TransactionManager should be instantiated');
    assert(appJs.includes('new CategoryManager'), 'CategoryManager should be instantiated');
    assert(appJs.includes('new ThemeManager'), 'ThemeManager should be instantiated');
    assert(appJs.includes('new BudgetManager'), 'BudgetManager should be instantiated');
    assert(appJs.includes('new SortManager'), 'SortManager should be instantiated');
    assert(appJs.includes('new MonthlyViewManager'), 'MonthlyViewManager should be instantiated');
    assert(appJs.includes('new ChartComponent'), 'ChartComponent should be instantiated');
    assert(appJs.includes('new UIController'), 'UIController should be instantiated');
  });

  test('UIController.init() is called', () => {
    assert(appJs.includes('uiController.init()'), 'UIController.init() should be called');
  });

} catch (error) {
  console.log(`✗ Failed to read app.js: ${error.message}`);
}

// Test that HTML has all required elements
try {
  const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

  test('HTML has transaction form', () => {
    assert(html.includes('id="transaction-form"'), 'Transaction form should exist');
  });

  test('HTML has item name input', () => {
    assert(html.includes('id="item-name"'), 'Item name input should exist');
  });

  test('HTML has amount input', () => {
    assert(html.includes('id="amount"'), 'Amount input should exist');
  });

  test('HTML has category select', () => {
    assert(html.includes('id="category"'), 'Category select should exist');
  });

  test('HTML has transaction list container', () => {
    assert(html.includes('id="transaction-list"'), 'Transaction list should exist');
  });

  test('HTML has total amount display', () => {
    assert(html.includes('id="total-amount"'), 'Total amount display should exist');
  });

  test('HTML has chart canvas', () => {
    assert(html.includes('id="expense-chart"'), 'Chart canvas should exist');
  });

  test('HTML has theme toggle button', () => {
    assert(html.includes('id="theme-toggle"'), 'Theme toggle should exist');
  });

  test('HTML has spending limit input', () => {
    assert(html.includes('id="spending-limit"'), 'Spending limit input should exist');
  });

  test('HTML has custom category input', () => {
    assert(html.includes('id="custom-category-input"'), 'Custom category input should exist');
  });

  test('HTML has sort select', () => {
    assert(html.includes('id="sort-select"'), 'Sort select should exist');
  });

  test('HTML has monthly view button', () => {
    assert(html.includes('id="monthly-view-btn"'), 'Monthly view button should exist');
  });

  test('HTML has month select', () => {
    assert(html.includes('id="month-select"'), 'Month select should exist');
  });

  test('HTML includes Chart.js CDN', () => {
    assert(html.includes('chart.js'), 'Chart.js CDN should be included');
  });

} catch (error) {
  console.log(`✗ Failed to read index.html: ${error.message}`);
}

// Test that CSS file exists and has required styles
try {
  const css = fs.readFileSync(path.resolve(__dirname, '../css/styles.css'), 'utf8');

  test('CSS has light theme variables', () => {
    assert(css.includes(':root'), 'CSS should have root variables');
  });

  test('CSS has dark theme class', () => {
    assert(css.includes('.dark-theme'), 'CSS should have dark theme class');
  });

  test('CSS has transaction item styles', () => {
    assert(css.includes('.transaction-item'), 'CSS should have transaction item styles');
  });

  test('CSS has budget alert styles', () => {
    assert(css.includes('.budget-alert'), 'CSS should have budget alert styles');
  });

  test('CSS has over-budget styles', () => {
    assert(css.includes('.over-budget'), 'CSS should have over-budget styles');
  });

  test('CSS has responsive breakpoints', () => {
    assert(css.includes('@media'), 'CSS should have media queries for responsiveness');
  });

} catch (error) {
  console.log(`✗ Failed to read styles.css: ${error.message}`);
}

console.log(`\n${passedTests}/${totalTests} automated checks passed\n`);

if (passedTests === totalTests) {
  console.log('✓ All automated component integration checks passed!');
  console.log('\nNext Steps:');
  console.log('1. Open index.html in a web browser');
  console.log('2. Follow the manual test scenarios above');
  console.log('3. Verify each expected result');
  console.log('4. Report any issues found\n');
  process.exit(0);
} else {
  console.log(`✗ ${totalTests - passedTests} automated check(s) failed`);
  console.log('\nPlease fix the issues before proceeding with manual testing.\n');
  process.exit(1);
}

describe('Integration Tests - All Components Working Together', () => {
  let dom;
  let window;
  let document;
  let localStorage;

  beforeEach(() => {
    // Create a fresh DOM for each test
    dom = new JSDOM(html, {
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable',
      beforeParse(window) {
        // Mock Chart.js
        window.Chart = class {
          constructor(ctx, config) {
            this.ctx = ctx;
            this.config = config;
            this.data = config.data;
          }
          update() {}
          destroy() {}
        };
      }
    });

    window = dom.window;
    document = window.document;
    localStorage = window.localStorage;

    // Clear localStorage
    localStorage.clear();

    // Execute the application JavaScript
    const scriptEl = document.createElement('script');
    scriptEl.textContent = appJs;
    document.body.appendChild(scriptEl);

    // Trigger DOMContentLoaded
    const event = new window.Event('DOMContentLoaded');
    document.dispatchEvent(event);
  });

  afterEach(() => {
    dom.window.close();
  });

  test('form submission creates transaction and updates all UI components', () => {
    // Fill in the form
    document.getElementById('item-name').value = 'Grocery Shopping';
    document.getElementById('amount').value = '45.50';
    document.getElementById('category').value = 'Food';

    // Submit the form
    const form = document.getElementById('transaction-form');
    const submitEvent = new window.Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    // Verify transaction list is updated
    const transactionList = document.getElementById('transaction-list');
    expect(transactionList.querySelector('.transaction-item')).toBeTruthy();
    expect(transactionList.textContent).toContain('Grocery Shopping');
    expect(transactionList.textContent).toContain('45.50');
    expect(transactionList.textContent).toContain('Food');

    // Verify total is updated
    const totalAmount = document.getElementById('total-amount');
    expect(totalAmount.textContent).toContain('45.50');

    // Verify form is cleared
    expect(document.getElementById('item-name').value).toBe('');
    expect(document.getElementById('amount').value).toBe('');
    expect(document.getElementById('category').value).toBe('');

    // Verify data is persisted in localStorage
    const storedTransactions = JSON.parse(localStorage.getItem('expense_tracker_transactions'));
    expect(storedTransactions).toHaveLength(1);
    expect(storedTransactions[0].itemName).toBe('Grocery Shopping');
    expect(storedTransactions[0].amount).toBe(45.50);
    expect(storedTransactions[0].category).toBe('Food');
  });

  test('deletion removes transaction and updates all UI components', () => {
    // Add a transaction first
    document.getElementById('item-name').value = 'Coffee';
    document.getElementById('amount').value = '5.00';
    document.getElementById('category').value = 'Food';
    
    const form = document.getElementById('transaction-form');
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    // Verify transaction exists
    let transactionList = document.getElementById('transaction-list');
    expect(transactionList.querySelector('.transaction-item')).toBeTruthy();
    expect(document.getElementById('total-amount').textContent).toContain('5.00');

    // Delete the transaction
    const deleteBtn = transactionList.querySelector('.btn-delete');
    deleteBtn.click();

    // Verify transaction is removed from list
    transactionList = document.getElementById('transaction-list');
    expect(transactionList.querySelector('.transaction-item')).toBeFalsy();
    expect(transactionList.textContent).toContain('No transactions yet');

    // Verify total is updated to zero
    const totalAmount = document.getElementById('total-amount');
    expect(totalAmount.textContent).toContain('0.00');

    // Verify data is removed from localStorage
    const storedTransactions = JSON.parse(localStorage.getItem('expense_tracker_transactions'));
    expect(storedTransactions).toHaveLength(0);
  });

  test('custom category creation appears in selector', () => {
    // Add a custom category
    const customCategoryInput = document.getElementById('custom-category-input');
    customCategoryInput.value = 'Healthcare';

    const addCategoryBtn = document.getElementById('add-category-btn');
    addCategoryBtn.click();

    // Verify category appears in dropdown
    const categorySelect = document.getElementById('category');
    const options = Array.from(categorySelect.options).map(opt => opt.value);
    expect(options).toContain('Healthcare');

    // Verify category is persisted
    const storedCategories = JSON.parse(localStorage.getItem('expense_tracker_categories'));
    expect(storedCategories).toContain('Healthcare');

    // Verify input is cleared
    expect(customCategoryInput.value).toBe('');
  });

  test('sort controls reorder transaction list correctly', () => {
    // Add multiple transactions
    const transactions = [
      { name: 'Lunch', amount: '15.00', category: 'Food' },
      { name: 'Bus Ticket', amount: '3.50', category: 'Transport' },
      { name: 'Movie', amount: '12.00', category: 'Fun' }
    ];

    transactions.forEach(t => {
      document.getElementById('item-name').value = t.name;
      document.getElementById('amount').value = t.amount;
      document.getElementById('category').value = t.category;
      
      const form = document.getElementById('transaction-form');
      form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    });

    // Test sort by amount
    const sortSelect = document.getElementById('sort-select');
    sortSelect.value = 'amount';
    sortSelect.dispatchEvent(new window.Event('change', { bubbles: true }));

    let transactionItems = document.querySelectorAll('.transaction-item');
    let amounts = Array.from(transactionItems).map(item => 
      parseFloat(item.querySelector('.transaction-amount').textContent)
    );
    
    // Verify sorted by amount (high to low)
    expect(amounts[0]).toBeGreaterThanOrEqual(amounts[1]);
    expect(amounts[1]).toBeGreaterThanOrEqual(amounts[2]);

    // Test sort by category
    sortSelect.value = 'category';
    sortSelect.dispatchEvent(new window.Event('change', { bubbles: true }));

    transactionItems = document.querySelectorAll('.transaction-item');
    let categories = Array.from(transactionItems).map(item => 
      item.querySelector('.transaction-category').textContent
    );
    
    // Verify sorted by category (alphabetical)
    const sortedCategories = [...categories].sort();
    expect(categories).toEqual(sortedCategories);

    // Test sort by date (default)
    sortSelect.value = 'date';
    sortSelect.dispatchEvent(new window.Event('change', { bubbles: true }));

    // Verify list is rendered (newest first is default)
    transactionItems = document.querySelectorAll('.transaction-item');
    expect(transactionItems.length).toBe(3);
  });

  test('monthly view filters and displays correct data', () => {
    // Add transactions with different dates
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

    // Mock Date to control transaction dates
    const RealDate = window.Date;
    
    // Add transaction for current month
    window.Date = class extends RealDate {
      constructor(...args) {
        if (args.length === 0) {
          super(now);
        } else {
          super(...args);
        }
      }
    };
    window.Date.now = () => now.getTime();

    document.getElementById('item-name').value = 'Current Month Item';
    document.getElementById('amount').value = '20.00';
    document.getElementById('category').value = 'Food';
    
    const form = document.getElementById('transaction-form');
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    // Add transaction for last month
    window.Date = class extends RealDate {
      constructor(...args) {
        if (args.length === 0) {
          super(lastMonth);
        } else {
          super(...args);
        }
      }
    };
    window.Date.now = () => lastMonth.getTime();

    document.getElementById('item-name').value = 'Last Month Item';
    document.getElementById('amount').value = '30.00';
    document.getElementById('category').value = 'Transport';
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    // Restore Date
    window.Date = RealDate;

    // Switch to monthly view
    const monthlyViewBtn = document.getElementById('monthly-view-btn');
    monthlyViewBtn.click();

    // Verify view switched
    const mainView = document.getElementById('main-view');
    const monthlyView = document.getElementById('monthly-view');
    expect(mainView.classList.contains('active')).toBe(false);
    expect(monthlyView.classList.contains('active')).toBe(true);

    // Verify month selector has options
    const monthSelect = document.getElementById('month-select');
    expect(monthSelect.options.length).toBeGreaterThan(0);

    // Select a month
    if (monthSelect.options.length > 0) {
      monthSelect.value = monthSelect.options[0].value;
      monthSelect.dispatchEvent(new window.Event('change', { bubbles: true }));

      // Verify monthly total is displayed
      const monthlyTotal = document.getElementById('monthly-total-amount');
      expect(monthlyTotal.textContent).not.toBe('$0.00');
    }
  });

  test('budget alert appears when limit exceeded', () => {
    // Set spending limit
    document.getElementById('spending-limit').value = '10.00';
    document.getElementById('set-limit-btn').click();

    // Verify no alert initially
    expect(document.querySelector('.budget-alert')).toBeFalsy();

    // Add transaction that exceeds limit
    document.getElementById('item-name').value = 'Expensive Item';
    document.getElementById('amount').value = '15.00';
    document.getElementById('category').value = 'Food';
    
    const form = document.getElementById('transaction-form');
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    // Verify budget alert appears
    const budgetAlert = document.querySelector('.budget-alert');
    expect(budgetAlert).toBeTruthy();
    expect(budgetAlert.textContent).toContain('exceeded');
    expect(budgetAlert.textContent).toContain('10.00');

    // Verify total has over-budget styling
    const totalAmount = document.getElementById('total-amount');
    expect(totalAmount.classList.contains('over-budget')).toBe(true);

    // Verify limit is persisted
    const storedLimit = JSON.parse(localStorage.getItem('expense_tracker_limit'));
    expect(storedLimit).toBe(10.00);
  });

  test('theme toggle switches all UI components', () => {
    // Verify initial theme (default is light)
    const body = document.body;
    const initialTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';

    // Toggle theme
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.click();

    // Verify theme class changed
    if (initialTheme === 'light') {
      expect(body.classList.contains('dark-theme')).toBe(true);
      expect(body.classList.contains('light-theme')).toBe(false);
    } else {
      expect(body.classList.contains('light-theme')).toBe(true);
      expect(body.classList.contains('dark-theme')).toBe(false);
    }

    // Verify theme icon changed
    const themeIcon = document.querySelector('.theme-icon');
    expect(themeIcon.textContent).toBeTruthy();

    // Verify theme is persisted
    const storedTheme = JSON.parse(localStorage.getItem('expense_tracker_theme'));
    expect(storedTheme).toBeTruthy();
    expect(['light', 'dark']).toContain(storedTheme);
  });

  test('all data persists across page reloads', () => {
    // Add a transaction
    document.getElementById('item-name').value = 'Test Item';
    document.getElementById('amount').value = '25.00';
    document.getElementById('category').value = 'Food';
    
    const form = document.getElementById('transaction-form');
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    // Add a custom category
    document.getElementById('custom-category-input').value = 'Education';
    document.getElementById('add-category-btn').click();

    // Set spending limit
    document.getElementById('spending-limit').value = '100.00';
    document.getElementById('set-limit-btn').click();

    // Toggle theme
    document.getElementById('theme-toggle').click();

    // Store the localStorage data
    const storedData = {
      transactions: localStorage.getItem('expense_tracker_transactions'),
      categories: localStorage.getItem('expense_tracker_categories'),
      limit: localStorage.getItem('expense_tracker_limit'),
      theme: localStorage.getItem('expense_tracker_theme')
    };

    // Simulate page reload by creating a new DOM
    dom.window.close();
    
    dom = new JSDOM(html, {
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable',
      beforeParse(window) {
        // Mock Chart.js
        window.Chart = class {
          constructor(ctx, config) {
            this.ctx = ctx;
            this.config = config;
            this.data = config.data;
          }
          update() {}
          destroy() {}
        };
      }
    });

    window = dom.window;
    document = window.document;
    localStorage = window.localStorage;

    // Restore localStorage data
    localStorage.setItem('expense_tracker_transactions', storedData.transactions);
    localStorage.setItem('expense_tracker_categories', storedData.categories);
    localStorage.setItem('expense_tracker_limit', storedData.limit);
    localStorage.setItem('expense_tracker_theme', storedData.theme);

    // Execute the application JavaScript
    const scriptEl = document.createElement('script');
    scriptEl.textContent = appJs;
    document.body.appendChild(scriptEl);

    // Trigger DOMContentLoaded
    const event = new window.Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Verify transaction is loaded
    const transactionList = document.getElementById('transaction-list');
    expect(transactionList.textContent).toContain('Test Item');
    expect(transactionList.textContent).toContain('25.00');

    // Verify total is loaded
    const totalAmount = document.getElementById('total-amount');
    expect(totalAmount.textContent).toContain('25.00');

    // Verify custom category is loaded
    const categorySelect = document.getElementById('category');
    const options = Array.from(categorySelect.options).map(opt => opt.value);
    expect(options).toContain('Education');

    // Verify theme is loaded
    const body = document.body;
    const storedTheme = JSON.parse(storedData.theme);
    expect(body.classList.contains(`${storedTheme}-theme`)).toBe(true);
  });
});
