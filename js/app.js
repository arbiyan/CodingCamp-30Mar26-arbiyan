// Expense & Budget Visualizer - Application
console.log('Expense & Budget Visualizer - Application Loaded');

// Storage Service - Handles all Local Storage operations
class StorageService {
  constructor() {
    // Storage keys as defined in design document
    this.KEYS = {
      TRANSACTIONS: 'expense_tracker_transactions',
      CATEGORIES: 'expense_tracker_categories',
      SPENDING_LIMIT: 'expense_tracker_limit',
      THEME: 'expense_tracker_theme'
    };
  }

  // Check if Local Storage is available
  _isStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.error('Local Storage is not available:', e);
      return false;
    }
  }

  // Save transactions to Local Storage
  saveTransactions(transactions) {
    try {
      if (!this._isStorageAvailable()) {
        throw new Error('Local Storage is not available');
      }
      const data = JSON.stringify(transactions);
      localStorage.setItem(this.KEYS.TRANSACTIONS, data);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        throw new Error('Storage limit reached. Please delete some transactions.');
      }
      throw new Error('Failed to save transactions: ' + e.message);
    }
  }

  // Load transactions from Local Storage
  loadTransactions() {
    try {
      if (!this._isStorageAvailable()) {
        console.warn('Local Storage is not available. Returning empty array.');
        return [];
      }
      const data = localStorage.getItem(this.KEYS.TRANSACTIONS);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load transactions. Data may be corrupted:', e);
      // Clear corrupted data
      localStorage.removeItem(this.KEYS.TRANSACTIONS);
      return [];
    }
  }

  // Save custom categories to Local Storage
  saveCategories(categories) {
    try {
      if (!this._isStorageAvailable()) {
        throw new Error('Local Storage is not available');
      }
      const data = JSON.stringify(categories);
      localStorage.setItem(this.KEYS.CATEGORIES, data);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        throw new Error('Storage limit reached.');
      }
      throw new Error('Failed to save categories: ' + e.message);
    }
  }

  // Load custom categories from Local Storage
  loadCategories() {
    try {
      if (!this._isStorageAvailable()) {
        console.warn('Local Storage is not available. Returning empty array.');
        return [];
      }
      const data = localStorage.getItem(this.KEYS.CATEGORIES);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load categories. Data may be corrupted:', e);
      // Clear corrupted data
      localStorage.removeItem(this.KEYS.CATEGORIES);
      return [];
    }
  }

  // Save spending limit to Local Storage
  saveSpendingLimit(limit) {
    try {
      if (!this._isStorageAvailable()) {
        throw new Error('Local Storage is not available');
      }
      const data = JSON.stringify(limit);
      localStorage.setItem(this.KEYS.SPENDING_LIMIT, data);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        throw new Error('Storage limit reached.');
      }
      throw new Error('Failed to save spending limit: ' + e.message);
    }
  }

  // Load spending limit from Local Storage
  loadSpendingLimit() {
    try {
      if (!this._isStorageAvailable()) {
        console.warn('Local Storage is not available. Returning null.');
        return null;
      }
      const data = localStorage.getItem(this.KEYS.SPENDING_LIMIT);
      if (!data) {
        return null;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load spending limit. Data may be corrupted:', e);
      // Clear corrupted data
      localStorage.removeItem(this.KEYS.SPENDING_LIMIT);
      return null;
    }
  }

  // Save theme preference to Local Storage
  saveTheme(theme) {
    try {
      if (!this._isStorageAvailable()) {
        throw new Error('Local Storage is not available');
      }
      const data = JSON.stringify(theme);
      localStorage.setItem(this.KEYS.THEME, data);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        throw new Error('Storage limit reached.');
      }
      throw new Error('Failed to save theme: ' + e.message);
    }
  }

  // Load theme preference from Local Storage
  loadTheme() {
    try {
      if (!this._isStorageAvailable()) {
        console.warn('Local Storage is not available. Returning null.');
        return null;
      }
      const data = localStorage.getItem(this.KEYS.THEME);
      if (!data) {
        return null;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load theme. Data may be corrupted:', e);
      // Clear corrupted data
      localStorage.removeItem(this.KEYS.THEME);
      return null;
    }
  }
}

// Validation Service - Handles input validation
class ValidationService {
  // Validate transaction input
  validateTransaction(itemName, amount, category, availableCategories) {
    const errors = [];

    // Validate item name
    if (!this.validateRequired(itemName)) {
      errors.push('Item name is required');
    }

    // Validate amount
    if (!this.validateRequired(amount)) {
      errors.push('Amount is required');
    } else if (!this.validateAmount(amount)) {
      errors.push('Please enter a valid positive number for amount');
    }

    // Validate category
    if (!this.validateRequired(category)) {
      errors.push('Category is required');
    } else if (availableCategories && !this.validateCategory(category, availableCategories)) {
      errors.push('Please select a valid category');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Validate amount is numeric and positive
  validateAmount(amount) {
    // Convert to string for validation
    const amountStr = String(amount).trim();
    
    // Check if empty
    if (amountStr === '') {
      return false;
    }

    // Check if numeric
    const numValue = Number(amountStr);
    if (isNaN(numValue)) {
      return false;
    }

    // Check if positive and within range
    if (numValue <= 0 || numValue > 999999.99) {
      return false;
    }

    return true;
  }

  // Validate required fields are not empty
  validateRequired(value) {
    if (value === null || value === undefined) {
      return false;
    }

    // Convert to string and trim
    const strValue = String(value).trim();
    return strValue.length > 0;
  }

  // Validate category exists
  validateCategory(category, availableCategories) {
    if (!availableCategories || !Array.isArray(availableCategories)) {
      return false;
    }

    return availableCategories.includes(category);
  }
}

// Transaction Manager - Handles transaction CRUD operations
class TransactionManager {
  constructor(storageService) {
    this.storageService = storageService;
    this.transactions = [];
    this._loadTransactions();
  }

  // Load transactions from storage on initialization
  _loadTransactions() {
    this.transactions = this.storageService.loadTransactions();
  }

  // Generate unique ID for transaction
  _generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Add a new transaction
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

  // Delete a transaction by ID
  deleteTransaction(transactionId) {
    const initialLength = this.transactions.length;
    this.transactions = this.transactions.filter(t => t.id !== transactionId);
    
    if (this.transactions.length < initialLength) {
      this.storageService.saveTransactions(this.transactions);
      return true;
    }
    
    return false;
  }

  // Get all transactions
  getAllTransactions() {
    return [...this.transactions];
  }

  // Get transactions filtered by month
  getTransactionsByMonth(year, month) {
    return this.transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }

  // Calculate total of all transactions
  calculateTotal() {
    return this.transactions.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);
  }

  // Group transactions by category with totals
  getCategoryTotals() {
    const totals = new Map();
    
    this.transactions.forEach(transaction => {
      const current = totals.get(transaction.category) || 0;
      totals.set(transaction.category, current + transaction.amount);
    });
    
    return totals;
  }
}

// Category Manager - Handles category operations
class CategoryManager {
  constructor(storageService) {
    this.storageService = storageService;
    this.defaultCategories = ['Food', 'Transport', 'Fun'];
    this.customCategories = [];
    this._loadCustomCategories();
  }

  // Load custom categories from storage on initialization
  _loadCustomCategories() {
    this.customCategories = this.storageService.loadCategories();
  }

  // Get default categories
  getDefaultCategories() {
    return [...this.defaultCategories];
  }

  // Get all categories (default + custom)
  getAllCategories() {
    return [...this.defaultCategories, ...this.customCategories];
  }

  // Check if category exists
  categoryExists(categoryName) {
    const allCategories = this.getAllCategories();
    return allCategories.includes(categoryName);
  }

  // Add a custom category with uniqueness check
  addCustomCategory(categoryName) {
    // Trim and validate
    const trimmedName = categoryName.trim();
    
    if (!trimmedName) {
      return false;
    }

    // Check if category already exists
    if (this.categoryExists(trimmedName)) {
      return false;
    }

    // Add to custom categories
    this.customCategories.push(trimmedName);
    this.storageService.saveCategories(this.customCategories);
    
    return true;
  }
}

// Sort Manager - Handles transaction sorting operations
class SortManager {
  constructor() {
    this.currentSort = 'date'; // Default sort mode: date (newest first)
  }

  // Sort transactions by amount (high to low)
  sortByAmount(transactions) {
    // Create a copy to avoid mutating the original array
    return [...transactions].sort((a, b) => b.amount - a.amount);
  }

  // Sort transactions by category (alphabetical grouping)
  sortByCategory(transactions) {
    // Create a copy to avoid mutating the original array
    return [...transactions].sort((a, b) => {
      // First sort by category name alphabetically
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare !== 0) {
        return categoryCompare;
      }
      // Within same category, sort by date (newest first)
      return b.timestamp - a.timestamp;
    });
  }

  // Sort transactions by date (newest first - chronological order)
  sortByDate(transactions) {
    // Create a copy to avoid mutating the original array
    return [...transactions].sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get current sort mode
  getCurrentSort() {
    return this.currentSort;
  }

  // Set sort mode
  setSortMode(mode) {
    // Validate mode is one of the supported options
    const validModes = ['date', 'amount', 'category'];
    if (validModes.includes(mode)) {
      this.currentSort = mode;
    } else {
      console.warn(`Invalid sort mode: ${mode}. Using default 'date'.`);
      this.currentSort = 'date';
    }
  }
}

// Budget Manager - Handles spending limit operations
class BudgetManager {
  constructor(storageService) {
    this.storageService = storageService;
    this.spendingLimit = null;
    this._loadSpendingLimit();
  }

  // Load spending limit from storage on initialization
  _loadSpendingLimit() {
    this.spendingLimit = this.storageService.loadSpendingLimit();
  }

  // Set spending limit
  setSpendingLimit(limit) {
    // Validate limit is a positive number or null (to clear limit)
    if (limit === null || limit === undefined) {
      this.spendingLimit = null;
      this.storageService.saveSpendingLimit(null);
      return true;
    }

    const numLimit = parseFloat(limit);
    
    // Validate numeric and within range
    if (isNaN(numLimit) || numLimit < 0 || numLimit > 999999.99) {
      return false;
    }

    this.spendingLimit = parseFloat(numLimit.toFixed(2));
    this.storageService.saveSpendingLimit(this.spendingLimit);
    return true;
  }

  // Get spending limit
  getSpendingLimit() {
    return this.spendingLimit;
  }

  // Check if total exceeds spending limit
  isOverBudget(total) {
    // If no limit is set, never over budget
    if (this.spendingLimit === null || this.spendingLimit === undefined) {
      return false;
    }

    return total > this.spendingLimit;
  }
}

// Monthly View Manager - Handles monthly transaction views and summaries
class MonthlyViewManager {
  constructor(transactionManager) {
    this.transactionManager = transactionManager;
    this.currentView = 'main'; // 'main' or 'monthly'
    this.selectedMonth = null; // { year: number, month: number }
  }

  // Get list of months with transactions
  getAvailableMonths() {
    const transactions = this.transactionManager.getAllTransactions();
    const monthsSet = new Set();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11
      const key = `${year}-${month}`;
      monthsSet.add(key);
    });

    // Convert set to array of objects and sort by date (newest first)
    const months = Array.from(monthsSet).map(key => {
      const [year, month] = key.split('-').map(Number);
      return { year, month };
    });

    // Sort by year and month (newest first)
    months.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return b.month - a.month;
    });

    return months;
  }

  // Get summary for specific month
  getMonthSummary(year, month) {
    const transactions = this.transactionManager.getTransactionsByMonth(year, month);
    
    // Calculate total
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate category breakdown
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

  // Switch to monthly view
  showMonthlyView(year, month) {
    this.currentView = 'monthly';
    this.selectedMonth = { year, month };
  }

  // Switch to main view
  showMainView() {
    this.currentView = 'main';
    this.selectedMonth = null;
  }

  // Get current view state
  getCurrentView() {
    return this.currentView;
  }

  // Get selected month
  getSelectedMonth() {
    return this.selectedMonth;
  }
}

// Theme Manager - Handles theme switching and persistence
class ThemeManager {
  constructor(storageService) {
    this.storageService = storageService;
    this.currentTheme = 'light'; // Default theme
    this._loadTheme();
  }

  // Load theme from storage on initialization
  _loadTheme() {
    const savedTheme = this.storageService.loadTheme();
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
  }

  // Get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Toggle between light and dark themes
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.storageService.saveTheme(this.currentTheme);
    this.applyTheme();
    return this.currentTheme;
  }

  // Apply theme by adding/removing CSS classes
  applyTheme() {
    const body = document.body;
    
    // Remove both theme classes first
    body.classList.remove('light-theme', 'dark-theme');
    
    // Add the current theme class
    body.classList.add(`${this.currentTheme}-theme`);
  }
}

// Chart Component - Handles Chart.js pie chart visualization
class ChartComponent {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.chart = null;
    this.colors = [
      '#FF6384', // Pink
      '#36A2EB', // Blue
      '#FFCE56', // Yellow
      '#4BC0C0', // Teal
      '#9966FF', // Purple
      '#FF9F40', // Orange
      '#FF6384', // Pink (repeat for more categories)
      '#C9CBCF', // Gray
      '#4BC0C0', // Teal (repeat)
      '#FF9F40'  // Orange (repeat)
    ];
  }

  // Initialize Chart.js pie chart instance
  init() {
    try {
      // Check if Chart.js is loaded
      if (typeof Chart === 'undefined') {
        throw new Error('Chart.js library is not loaded');
      }

      // Check if canvas element exists
      if (!this.canvas) {
        throw new Error('Canvas element not found');
      }

      // Get 2D context
      const ctx = this.canvas.getContext('2d');

      // Create Chart.js pie chart
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [],
            borderColor: '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                }
              }
            }
          }
        }
      });

      // Initially show empty state
      this.showEmptyState();

    } catch (error) {
      console.error('Failed to initialize chart:', error);
      // Display error message in chart container
      const chartContainer = this.canvas.parentElement;
      if (chartContainer) {
        chartContainer.innerHTML = '<p class="error-message">Unable to load chart visualization. Please refresh the page.</p>';
      }
    }
  }

  // Update chart with new category data
  update(categoryTotals) {
    try {
      // Check if chart exists
      if (!this.chart) {
        console.warn('Chart not initialized. Call init() first.');
        return;
      }

      // Check if categoryTotals is valid
      if (!categoryTotals || !(categoryTotals instanceof Map)) {
        console.error('Invalid category totals data');
        return;
      }

      // If no data, show empty state
      if (categoryTotals.size === 0) {
        this.showEmptyState();
        return;
      }

      // Hide empty state message
      const emptyState = document.getElementById('chart-empty-state');
      if (emptyState) {
        emptyState.style.display = 'none';
      }

      // Show canvas
      this.canvas.style.display = 'block';

      // Convert Map to arrays for Chart.js
      const labels = [];
      const data = [];
      const colors = [];

      let colorIndex = 0;
      categoryTotals.forEach((total, category) => {
        labels.push(category);
        data.push(parseFloat(total.toFixed(2)));
        colors.push(this.colors[colorIndex % this.colors.length]);
        colorIndex++;
      });

      // Update chart data
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.data.datasets[0].backgroundColor = colors;

      // Refresh chart
      this.chart.update();

    } catch (error) {
      console.error('Failed to update chart:', error);
    }
  }

  // Show empty state when no transactions exist
  showEmptyState() {
    try {
      // Hide canvas
      if (this.canvas) {
        this.canvas.style.display = 'none';
      }

      // Show empty state message
      const emptyState = document.getElementById('chart-empty-state');
      if (emptyState) {
        emptyState.style.display = 'block';
      }

      // Clear chart data if chart exists
      if (this.chart) {
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.chart.data.datasets[0].backgroundColor = [];
        this.chart.update();
      }

    } catch (error) {
      console.error('Failed to show empty state:', error);
    }
  }

  // Destroy and recreate chart
  reset() {
    try {
      // Destroy existing chart
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }

      // Reinitialize chart
      this.init();

    } catch (error) {
      console.error('Failed to reset chart:', error);
    }
  }
}

// UI Controller - Coordinates all UI interactions and updates
class UIController {
  constructor(transactionManager, categoryManager, themeManager, budgetManager, sortManager, monthlyViewManager, chartComponent, validationService) {
    this.transactionManager = transactionManager;
    this.categoryManager = categoryManager;
    this.themeManager = themeManager;
    this.budgetManager = budgetManager;
    this.sortManager = sortManager;
    this.monthlyViewManager = monthlyViewManager;
    this.chartComponent = chartComponent;
    this.validationService = validationService;
  }

  // Initialize all event listeners and components
  init() {
    try {
      // Initialize chart component
      this.chartComponent.init();

      // Apply saved theme
      this.applyTheme();

      // Load and render initial data
      this.renderTransactionList();
      this.updateTotalDisplay();
      this.updateChart();

      // Set up form submission handler
      const form = document.getElementById('transaction-form');
      if (form) {
        form.addEventListener('submit', (e) => this._handleFormSubmit(e));
      }

      // Set up theme toggle button
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => this._handleThemeToggle());
      }

      // Set up sort controls
      const sortSelect = document.getElementById('sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => this._handleSortChange(e));
      }

      // Set up spending limit button
      const setLimitBtn = document.getElementById('set-limit-btn');
      if (setLimitBtn) {
        setLimitBtn.addEventListener('click', () => this._handleSetSpendingLimit());
      }

      // Set up custom category button
      const addCategoryBtn = document.getElementById('add-category-btn');
      if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', () => this._handleAddCustomCategory());
      }

      // Set up view toggle buttons
      const mainViewBtn = document.getElementById('main-view-btn');
      const monthlyViewBtn = document.getElementById('monthly-view-btn');
      if (mainViewBtn) {
        mainViewBtn.addEventListener('click', () => this._handleViewChange('main'));
      }
      if (monthlyViewBtn) {
        monthlyViewBtn.addEventListener('click', () => this._handleViewChange('monthly'));
      }

      // Set up monthly view navigation
      const monthSelect = document.getElementById('month-select');
      if (monthSelect) {
        monthSelect.addEventListener('change', (e) => this._handleMonthChange(e));
      }

      // Update category dropdown with custom categories
      this._updateCategoryDropdown();

      // Update monthly view selector
      this._updateMonthSelector();

      // Check and display budget alert if needed
      this.showBudgetAlert();
    } catch (error) {
      console.error('Failed to initialize UI controller:', error);
      throw error; // Re-throw to be caught by main initialization
    }
  }

  // Render transaction list
  renderTransactionList() {
    const listContainer = document.getElementById('transaction-list');
    if (!listContainer) return;

    try {
      // Get transactions based on current view
      let transactions;
      if (this.monthlyViewManager.getCurrentView() === 'monthly' && this.monthlyViewManager.getSelectedMonth()) {
        const { year, month } = this.monthlyViewManager.getSelectedMonth();
        transactions = this.transactionManager.getTransactionsByMonth(year, month);
      } else {
        transactions = this.transactionManager.getAllTransactions();
      }

      // Apply current sort
      const sortMode = this.sortManager.getCurrentSort();
      if (sortMode === 'amount') {
        transactions = this.sortManager.sortByAmount(transactions);
      } else if (sortMode === 'category') {
        transactions = this.sortManager.sortByCategory(transactions);
      } else {
        transactions = this.sortManager.sortByDate(transactions);
      }

      // Clear existing content
      listContainer.innerHTML = '';

      // Show empty state if no transactions
      if (transactions.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-state';
        emptyMessage.textContent = 'No transactions yet. Add your first expense above!';
        listContainer.appendChild(emptyMessage);
        return;
      }

      // Render each transaction
      transactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        transactionItem.dataset.id = transaction.id;

        // Format date
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });

        transactionItem.innerHTML = `
          <div class="transaction-info">
            <div class="transaction-name">${this._escapeHtml(transaction.itemName)}</div>
            <div class="transaction-meta">
              <span class="transaction-category">${this._escapeHtml(transaction.category)}</span>
              <span class="transaction-date">${formattedDate}</span>
            </div>
          </div>
          <div class="transaction-actions">
            <span class="transaction-amount">$${transaction.amount.toFixed(2)}</span>
            <button class="btn-delete" data-id="${transaction.id}" aria-label="Delete transaction">×</button>
          </div>
        `;

        // Add delete button handler
        const deleteBtn = transactionItem.querySelector('.btn-delete');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', (e) => this._handleDelete(e));
        }

        listContainer.appendChild(transactionItem);
      });
    } catch (error) {
      console.error('Failed to render transaction list:', error);
      listContainer.innerHTML = '<p class="error-message">Failed to display transactions. Please refresh the page.</p>';
    }
  }

  // Update total display with currency formatting
  updateTotalDisplay() {
    const totalElement = document.getElementById('total-amount');
    if (!totalElement) return;

    try {
      const total = this.transactionManager.calculateTotal();
      totalElement.textContent = `$${total.toFixed(2)}`;

      // Check if over budget and apply styling
      const isOverBudget = this.budgetManager.isOverBudget(total);
      if (isOverBudget) {
        totalElement.classList.add('over-budget');
      } else {
        totalElement.classList.remove('over-budget');
      }
    } catch (error) {
      console.error('Failed to update total display:', error);
      totalElement.textContent = '$0.00';
    }
  }

  // Update chart component
  updateChart() {
    try {
      const categoryTotals = this.transactionManager.getCategoryTotals();
      this.chartComponent.update(categoryTotals);
    } catch (error) {
      console.error('Failed to update chart:', error);
      // Chart component will handle displaying error state
    }
  }

  // Show validation error
  showError(message) {
    const errorElement = document.getElementById('form-error');
    if (!errorElement) return;

    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }

  // Clear input form
  clearForm() {
    const form = document.getElementById('transaction-form');
    if (!form) return;

    form.reset();

    // Clear error message
    const errorElement = document.getElementById('form-error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  // Apply theme to UI
  applyTheme() {
    this.themeManager.applyTheme();

    // Update theme toggle icon
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      const currentTheme = this.themeManager.getCurrentTheme();
      themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
  }

  // Show budget alert for spending limit warnings
  showBudgetAlert() {
    const total = this.transactionManager.calculateTotal();
    const limit = this.budgetManager.getSpendingLimit();

    // Remove any existing alert
    const existingAlert = document.querySelector('.budget-alert');
    if (existingAlert) {
      existingAlert.remove();
    }

    // If no limit is set or not over budget, return
    if (!limit || !this.budgetManager.isOverBudget(total)) {
      return;
    }

    // Create and display budget alert
    const alert = document.createElement('div');
    alert.className = 'budget-alert';
    alert.innerHTML = `
      <span class="alert-icon">⚠️</span>
      <span class="alert-message">You have exceeded your spending limit of $${limit.toFixed(2)}!</span>
    `;

    // Insert alert after total section
    const totalSection = document.querySelector('.total-section');
    if (totalSection) {
      totalSection.insertAdjacentElement('afterend', alert);
    }
  }

  // Handle form submission
  _handleFormSubmit(event) {
    event.preventDefault();

    // Get form values
    const itemName = document.getElementById('item-name').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;

    // Get available categories for validation
    const availableCategories = this.categoryManager.getAllCategories();

    // Validate input
    const validation = this.validationService.validateTransaction(
      itemName,
      amount,
      category,
      availableCategories
    );

    if (!validation.isValid) {
      this.showError(validation.errors.join('. '));
      return;
    }

    // Add transaction
    try {
      this.transactionManager.addTransaction(itemName, amount, category);

      // Update UI
      this.clearForm();
      this.renderTransactionList();
      this.updateTotalDisplay();
      this.updateChart();
      this.showBudgetAlert();
      this._updateMonthSelector();
    } catch (error) {
      this.showError('Failed to add transaction: ' + error.message);
    }
  }

  // Handle delete button click
  _handleDelete(event) {
    const transactionId = event.target.dataset.id;
    
    if (!transactionId) return;

    try {
      // Delete transaction
      const success = this.transactionManager.deleteTransaction(transactionId);

      if (success) {
        // Update UI
        this.renderTransactionList();
        this.updateTotalDisplay();
        this.updateChart();
        this.showBudgetAlert();
        this._updateMonthSelector();
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      this.showError('Failed to delete transaction: ' + error.message);
    }
  }

  // Handle theme toggle
  _handleThemeToggle() {
    this.themeManager.toggleTheme();
    this.applyTheme();
  }

  // Handle sort change
  _handleSortChange(event) {
    const sortMode = event.target.value;
    this.sortManager.setSortMode(sortMode);
    this.renderTransactionList();
  }

  // Handle spending limit setting
  _handleSetSpendingLimit() {
    const limitInput = document.getElementById('spending-limit');
    if (!limitInput) return;

    const limitValue = limitInput.value.trim();

    try {
      // If empty, clear the limit
      if (limitValue === '') {
        this.budgetManager.setSpendingLimit(null);
        this.updateTotalDisplay();
        this.showBudgetAlert();
        return;
      }

      // Set the limit
      const success = this.budgetManager.setSpendingLimit(limitValue);

      if (success) {
        this.updateTotalDisplay();
        this.showBudgetAlert();
      } else {
        this.showError('Please enter a valid spending limit (0 or greater)');
      }
    } catch (error) {
      console.error('Failed to set spending limit:', error);
      this.showError('Failed to set spending limit: ' + error.message);
    }
  }

  // Handle custom category addition
  _handleAddCustomCategory() {
    const input = document.getElementById('custom-category-input');
    const errorElement = document.getElementById('category-error');
    
    if (!input) return;

    const categoryName = input.value.trim();

    if (!categoryName) {
      if (errorElement) {
        errorElement.textContent = 'Please enter a category name';
        errorElement.style.display = 'block';
      }
      return;
    }

    try {
      // Add custom category
      const success = this.categoryManager.addCustomCategory(categoryName);

      if (success) {
        // Clear input
        input.value = '';
        
        // Hide error
        if (errorElement) {
          errorElement.style.display = 'none';
        }

        // Update category dropdown
        this._updateCategoryDropdown();
      } else {
        if (errorElement) {
          errorElement.textContent = 'This category already exists';
          errorElement.style.display = 'block';
        }
      }
    } catch (error) {
      console.error('Failed to add custom category:', error);
      if (errorElement) {
        errorElement.textContent = 'Failed to add category: ' + error.message;
        errorElement.style.display = 'block';
      }
    }
  }

  // Handle view change (main vs monthly)
  _handleViewChange(view) {
    if (view === 'main') {
      this.monthlyViewManager.showMainView();
    } else if (view === 'monthly') {
      this.monthlyViewManager.showMonthlyView();
    }

    // Update UI
    this._updateViewDisplay();
    this.renderTransactionList();
    this._updateMonthlyTotal();
  }

  // Handle month selection change
  _handleMonthChange(event) {
    const value = event.target.value;
    
    if (!value) return;

    // Parse year and month from value (format: "YYYY-MM")
    const [year, month] = value.split('-').map(Number);

    // Update monthly view manager
    this.monthlyViewManager.showMonthlyView(year, month);

    // Update UI
    this.renderTransactionList();
    this._updateMonthlyTotal();
  }

  // Update category dropdown with custom categories
  _updateCategoryDropdown() {
    const categorySelect = document.getElementById('category');
    if (!categorySelect) return;

    // Get all categories
    const categories = this.categoryManager.getAllCategories();

    // Clear existing options except the first one (placeholder)
    const placeholder = categorySelect.querySelector('option[value=""]');
    categorySelect.innerHTML = '';
    if (placeholder) {
      categorySelect.appendChild(placeholder);
    }

    // Add all categories
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }

  // Update month selector dropdown
  _updateMonthSelector() {
    const monthSelect = document.getElementById('month-select');
    if (!monthSelect) return;

    // Get available months
    const months = this.monthlyViewManager.getAvailableMonths();

    // Clear existing options
    monthSelect.innerHTML = '';

    if (months.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No months available';
      monthSelect.appendChild(option);
      return;
    }

    // Add month options
    months.forEach(({ year, month }) => {
      const option = document.createElement('option');
      option.value = `${year}-${month}`;
      
      // Format month name
      const date = new Date(year, month, 1);
      const monthName = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      option.textContent = monthName;
      monthSelect.appendChild(option);
    });
  }

  // Update view display (toggle between main and monthly)
  _updateViewDisplay() {
    const mainView = document.getElementById('main-view');
    const monthlyView = document.getElementById('monthly-view');
    const mainViewBtn = document.getElementById('main-view-btn');
    const monthlyViewBtn = document.getElementById('monthly-view-btn');

    const currentView = this.monthlyViewManager.getCurrentView();

    if (currentView === 'main') {
      if (mainView) mainView.classList.add('active');
      if (monthlyView) monthlyView.classList.remove('active');
      if (mainViewBtn) mainViewBtn.classList.add('active');
      if (monthlyViewBtn) monthlyViewBtn.classList.remove('active');
    } else {
      if (mainView) mainView.classList.remove('active');
      if (monthlyView) monthlyView.classList.add('active');
      if (mainViewBtn) mainViewBtn.classList.remove('active');
      if (monthlyViewBtn) monthlyViewBtn.classList.add('active');
    }
  }

  // Update monthly total display
  _updateMonthlyTotal() {
    const monthlyTotalElement = document.getElementById('monthly-total-amount');
    if (!monthlyTotalElement) return;

    const selectedMonth = this.monthlyViewManager.getSelectedMonth();
    
    if (!selectedMonth) {
      monthlyTotalElement.textContent = '$0.00';
      return;
    }

    const { year, month } = selectedMonth;
    const summary = this.monthlyViewManager.getMonthSummary(year, month);
    
    monthlyTotalElement.textContent = `$${summary.total.toFixed(2)}`;
  }

  // Escape HTML to prevent XSS
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Main Application Entry Point
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Expense & Budget Visualizer...');

  try {
    // Instantiate storage service
    const storageService = new StorageService();

    // Instantiate all manager classes
    const transactionManager = new TransactionManager(storageService);
    const categoryManager = new CategoryManager(storageService);
    const themeManager = new ThemeManager(storageService);
    const budgetManager = new BudgetManager(storageService);
    const sortManager = new SortManager();
    const monthlyViewManager = new MonthlyViewManager(transactionManager);

    // Instantiate validation service
    const validationService = new ValidationService();

    // Instantiate chart component
    const chartCanvas = document.getElementById('expense-chart');
    const chartComponent = new ChartComponent(chartCanvas);

    // Instantiate UI controller with all dependencies
    const uiController = new UIController(
      transactionManager,
      categoryManager,
      themeManager,
      budgetManager,
      sortManager,
      monthlyViewManager,
      chartComponent,
      validationService
    );

    // Initialize the application
    uiController.init();

    console.log('Application initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    
    // Display error message to user
    const appContainer = document.querySelector('.container');
    if (appContainer) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'init-error';
      errorDiv.innerHTML = `
        <h2>Application Error</h2>
        <p>Failed to initialize the application. Please refresh the page.</p>
        <p class="error-details">${error.message}</p>
      `;
      appContainer.insertBefore(errorDiv, appContainer.firstChild);
    }
  }
});
