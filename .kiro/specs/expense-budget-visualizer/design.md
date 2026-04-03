# Design Document: Expense & Budget Visualizer

## Overview

The Expense & Budget Visualizer is a client-side web application built with vanilla HTML, CSS, and JavaScript that enables users to track and visualize their spending patterns. The application operates entirely in the browser using Local Storage for data persistence, requiring no backend infrastructure.

### Key Design Principles

1. **Simplicity First**: Clean, minimal interface with intuitive interactions
2. **Client-Side Architecture**: All logic and data storage handled in the browser
3. **Progressive Enhancement**: Core functionality works without external dependencies
4. **Mobile-First Responsive**: Designed for touch devices with desktop enhancement
5. **Data Integrity**: Robust validation and error handling for user inputs

### Technology Stack

- **HTML5**: Semantic markup for structure
- **CSS3**: Modern styling with CSS Grid and Flexbox for responsive layouts
- **Vanilla JavaScript (ES6+)**: No frameworks or libraries for core functionality
- **Chart.js**: Lightweight library for pie chart visualization
- **Local Storage API**: Browser-native persistence layer

## Architecture

### System Architecture

The application follows a modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Input   │  │Transaction│  │  Chart   │  │ Summary │ │
│  │  Form    │  │   List    │  │Component │  │  View   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Transaction  │  │   Category   │  │    Theme     │  │
│  │   Manager    │  │   Manager    │  │   Manager    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Budget     │  │    Sort      │  │  Validation  │  │
│  │   Manager    │  │   Manager    │  │   Service    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Storage Layer                          │
│              ┌──────────────────────┐                    │
│              │  Local Storage API   │                    │
│              └──────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input → Validation → Storage → UI Update**
   - User enters transaction data
   - Validation service checks input integrity
   - Transaction manager stores to Local Storage
   - All UI components refresh to reflect changes

2. **Application Load → Storage Retrieval → State Hydration → Render**
   - Application initializes
   - Storage layer retrieves persisted data
   - Application state is hydrated
   - UI components render with loaded data

### Module Responsibilities

**Transaction Manager**
- Create, read, update, delete (CRUD) operations for transactions
- Coordinate with storage layer
- Emit events for UI updates
- Calculate total expenses

**Category Manager**
- Manage default and custom categories
- Persist custom categories
- Provide category options to UI

**Theme Manager**
- Toggle between light and dark themes
- Persist theme preference
- Apply theme classes to DOM

**Budget Manager**
- Store and retrieve spending limit
- Check if current spending exceeds limit
- Trigger alerts when limit exceeded

**Sort Manager**
- Sort transactions by amount, category, or date
- Maintain current sort state
- Return sorted transaction arrays

**Validation Service**
- Validate transaction inputs
- Check for required fields
- Validate numeric amounts
- Return validation errors

## Components and Interfaces

### Core Components

#### 1. TransactionManager

```javascript
class TransactionManager {
  constructor(storageService)
  
  // Create a new transaction
  addTransaction(itemName, amount, category) → Transaction
  
  // Remove a transaction by ID
  deleteTransaction(transactionId) → boolean
  
  // Get all transactions
  getAllTransactions() → Transaction[]
  
  // Get transactions filtered by month
  getTransactionsByMonth(year, month) → Transaction[]
  
  // Calculate total of all transactions
  calculateTotal() → number
  
  // Group transactions by category with totals
  getCategoryTotals() → Map<string, number>
}
```

#### 2. StorageService

```javascript
class StorageService {
  // Save transactions to Local Storage
  saveTransactions(transactions) → void
  
  // Load transactions from Local Storage
  loadTransactions() → Transaction[]
  
  // Save custom categories
  saveCategories(categories) → void
  
  // Load custom categories
  loadCategories() → string[]
  
  // Save spending limit
  saveSpendingLimit(limit) → void
  
  // Load spending limit
  loadSpendingLimit() → number | null
  
  // Save theme preference
  saveTheme(theme) → void
  
  // Load theme preference
  loadTheme() → string | null
}
```

#### 3. UIController

```javascript
class UIController {
  constructor(transactionManager, categoryManager, themeManager, budgetManager)
  
  // Initialize all UI components
  init() → void
  
  // Render transaction list
  renderTransactionList(transactions) → void
  
  // Update total expense display
  updateTotalDisplay(total) → void
  
  // Update chart with category data
  updateChart(categoryTotals) → void
  
  // Show validation error
  showError(message) → void
  
  // Clear input form
  clearForm() → void
  
  // Apply theme to UI
  applyTheme(theme) → void
  
  // Show budget alert
  showBudgetAlert() → void
}
```

#### 4. CategoryManager

```javascript
class CategoryManager {
  constructor(storageService)
  
  // Get all categories (default + custom)
  getAllCategories() → string[]
  
  // Add a custom category
  addCustomCategory(categoryName) → boolean
  
  // Get default categories
  getDefaultCategories() → string[]
  
  // Check if category exists
  categoryExists(categoryName) → boolean
}
```

#### 5. ChartComponent

```javascript
class ChartComponent {
  constructor(canvasElement)
  
  // Initialize Chart.js instance
  init() → void
  
  // Update chart with new data
  update(categoryTotals) → void
  
  // Show empty state
  showEmptyState() → void
  
  // Destroy and recreate chart
  reset() → void
}
```

#### 6. ValidationService

```javascript
class ValidationService {
  // Validate transaction input
  validateTransaction(itemName, amount, category) → ValidationResult
  
  // Validate amount is numeric and positive
  validateAmount(amount) → boolean
  
  // Validate required fields are not empty
  validateRequired(value) → boolean
  
  // Validate category exists
  validateCategory(category, availableCategories) → boolean
}
```

#### 7. SortManager

```javascript
class SortManager {
  // Sort transactions by amount (high to low)
  sortByAmount(transactions) → Transaction[]
  
  // Sort transactions by category
  sortByCategory(transactions) → Transaction[]
  
  // Sort transactions by date (newest first)
  sortByDate(transactions) → Transaction[]
  
  // Get current sort mode
  getCurrentSort() → string
  
  // Set sort mode
  setSortMode(mode) → void
}
```

#### 8. MonthlyViewManager

```javascript
class MonthlyViewManager {
  constructor(transactionManager)
  
  // Get list of months with transactions
  getAvailableMonths() → Array<{year: number, month: number}>
  
  // Get summary for specific month
  getMonthSummary(year, month) → MonthlySummary
  
  // Switch to monthly view
  showMonthlyView() → void
  
  // Switch to main view
  showMainView() → void
}
```

### Data Models

#### Transaction

```javascript
{
  id: string,           // Unique identifier (timestamp-based)
  itemName: string,     // Name of the expense item
  amount: number,       // Expense amount (positive number)
  category: string,     // Category name
  date: string,         // ISO 8601 date string
  timestamp: number     // Unix timestamp for sorting
}
```

#### ValidationResult

```javascript
{
  isValid: boolean,     // Overall validation status
  errors: string[]      // Array of error messages
}
```

#### MonthlySummary

```javascript
{
  year: number,
  month: number,
  total: number,
  transactionCount: number,
  categoryBreakdown: Map<string, number>
}
```

### Event System

The application uses a simple event-driven architecture for component communication:

```javascript
// Custom events for decoupled communication
Events = {
  TRANSACTION_ADDED: 'transaction:added',
  TRANSACTION_DELETED: 'transaction:deleted',
  TRANSACTIONS_LOADED: 'transactions:loaded',
  CATEGORY_ADDED: 'category:added',
  THEME_CHANGED: 'theme:changed',
  SORT_CHANGED: 'sort:changed',
  VIEW_CHANGED: 'view:changed'
}
```

## Data Models

### Local Storage Schema

#### Transactions Storage Key: `expense_tracker_transactions`

```json
[
  {
    "id": "1704067200000",
    "itemName": "Grocery Shopping",
    "amount": 45.50,
    "category": "Food",
    "date": "2024-01-01T00:00:00.000Z",
    "timestamp": 1704067200000
  }
]
```

#### Categories Storage Key: `expense_tracker_categories`

```json
["Food", "Transport", "Fun", "Healthcare", "Entertainment"]
```

#### Spending Limit Storage Key: `expense_tracker_limit`

```json
500
```

#### Theme Storage Key: `expense_tracker_theme`

```json
"dark"
```

#### Sort Preference Storage Key: `expense_tracker_sort`

```json
"date"
```

### Data Validation Rules

1. **Item Name**
   - Required: Yes
   - Type: String
   - Min Length: 1
   - Max Length: 100
   - Trim whitespace

2. **Amount**
   - Required: Yes
   - Type: Number
   - Min Value: 0.01
   - Max Value: 999999.99
   - Decimal Places: 2

3. **Category**
   - Required: Yes
   - Type: String
   - Must exist in available categories list

4. **Custom Category Name**
   - Required: Yes (when adding)
   - Type: String
   - Min Length: 1
   - Max Length: 50
   - Must be unique
   - Trim whitespace

5. **Spending Limit**
   - Required: No
   - Type: Number
   - Min Value: 0
   - Max Value: 999999.99

### Data Integrity Constraints

1. **Transaction ID Uniqueness**: Each transaction must have a unique ID generated from timestamp + random suffix
2. **Category Consistency**: Deleted categories should not break existing transactions
3. **Amount Precision**: All amounts stored with 2 decimal places
4. **Date Validity**: All dates stored in ISO 8601 format
5. **Storage Quota**: Monitor Local Storage usage (typically 5-10MB limit)


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Valid transaction creation

For any valid item name (non-empty string), positive numeric amount, and existing category, submitting the transaction form should create a new transaction with those values.

**Validates: Requirements 1.3**

### Property 2: Empty field validation

For any combination of empty or whitespace-only fields in the transaction form, submitting should display a validation error and not create a transaction.

**Validates: Requirements 1.4**

### Property 3: Form clearing after submission

For any valid transaction data, after successful submission, all input form fields should be empty.

**Validates: Requirements 1.5**

### Property 4: Amount validation

For any numeric string input in the amount field, the system should accept it, and for any non-numeric string input, the system should reject it with a validation error.

**Validates: Requirements 1.6, 1.7**

### Property 5: Transaction list completeness

For any set of stored transactions, the transaction list should display all of them.

**Validates: Requirements 2.1**

### Property 6: Transaction display information

For any transaction rendered in the list, the displayed HTML should contain the item name, amount, and category.

**Validates: Requirements 2.2**

### Property 7: Transaction list updates on addition

For any transaction added to the system, the transaction list length should increase by one and include the new transaction.

**Validates: Requirements 2.4**

### Property 8: Chronological ordering

For any set of transactions with different timestamps, the transaction list should display them ordered by timestamp with newest first.

**Validates: Requirements 2.5**

### Property 9: Delete control presence

For any transaction rendered in the list, a delete control element should be present in the DOM.

**Validates: Requirements 3.1**

### Property 10: Transaction deletion

For any transaction in the system, activating its delete control should remove it from storage.

**Validates: Requirements 3.2**

### Property 11: List updates on deletion

For any transaction deleted from the system, the transaction list length should decrease by one.

**Validates: Requirements 3.3**

### Property 12: Total updates on deletion

For any transaction deleted, the total expense display should decrease by that transaction's amount.

**Validates: Requirements 3.4**

### Property 13: Chart updates on deletion

For any transaction deleted, the chart should reflect the new category totals excluding the deleted transaction.

**Validates: Requirements 3.5**

### Property 14: Total calculation accuracy

For any set of transactions, the displayed total should equal the sum of all transaction amounts.

**Validates: Requirements 4.1**

### Property 15: Total updates on addition

For any transaction added, the new total should equal the previous total plus the new transaction's amount.

**Validates: Requirements 4.2**

### Property 16: Currency formatting

For any amount displayed in the total expense display, it should include currency notation (e.g., $ symbol and 2 decimal places).

**Validates: Requirements 4.5**

### Property 17: Chart category grouping

For any set of transactions, the chart should group spending by category and display the total for each category.

**Validates: Requirements 5.1**

### Property 18: Chart updates on addition

For any transaction added, the chart should update to reflect the new category totals including the added transaction.

**Validates: Requirements 5.2**

### Property 19: Chart color uniqueness

For any set of categories displayed in the chart, each category should have a distinct color.

**Validates: Requirements 5.4**

### Property 20: Chart label completeness

For any category segment in the chart, the chart should display the category label and either percentage or amount value.

**Validates: Requirements 5.5**

### Property 21: Transaction persistence on addition

For any transaction added to the system, retrieving data from Local Storage should include that transaction.

**Validates: Requirements 6.1**

### Property 22: Transaction persistence on deletion

For any transaction deleted from the system, retrieving data from Local Storage should not include that transaction.

**Validates: Requirements 6.2**

### Property 23: Transaction storage round-trip

For any set of transactions stored in Local Storage, loading the application should retrieve all of them with identical data.

**Validates: Requirements 6.3**

### Property 24: Custom category addition

For any valid custom category name (non-empty, unique string), adding it should make it appear in the available category options.

**Validates: Requirements 7.2**

### Property 25: Custom category persistence

For any custom category added, retrieving data from Local Storage should include that category.

**Validates: Requirements 7.3**

### Property 26: Custom category storage round-trip

For any set of custom categories stored in Local Storage, loading the application should retrieve all of them.

**Validates: Requirements 7.4**

### Property 27: Category selector completeness

For any set of default and custom categories, all should appear as options in the category selector.

**Validates: Requirements 7.5**

### Property 28: Monthly transaction grouping

For any set of transactions with various dates, grouping by month should place each transaction in the correct month based on its creation date.

**Validates: Requirements 8.2**

### Property 29: Monthly total calculation

For any month with transactions, the displayed monthly total should equal the sum of all transaction amounts from that month.

**Validates: Requirements 8.3**

### Property 30: Monthly filtering

For any month selected in the monthly view, only transactions with dates in that month should be displayed.

**Validates: Requirements 8.5**

### Property 31: Sort by amount ordering

For any set of transactions, sorting by amount should reorder them from highest to lowest amount.

**Validates: Requirements 9.2**

### Property 32: Sort by category grouping

For any set of transactions, sorting by category should group transactions with the same category together.

**Validates: Requirements 9.3**

### Property 33: Sort state persistence

For any sort mode selected, the transaction list should maintain that sort order until a different sort mode is explicitly selected.

**Validates: Requirements 9.4**

### Property 34: Spending limit persistence

For any spending limit value set, retrieving data from Local Storage should return that same limit value.

**Validates: Requirements 10.2**

### Property 35: Budget alert display

For any total expense amount that exceeds the set spending limit, the application should display a visual alert or warning and apply different styling to the total display.

**Validates: Requirements 10.3, 10.4**

### Property 36: Spending limit storage round-trip

For any spending limit stored in Local Storage, loading the application should retrieve and apply that limit.

**Validates: Requirements 10.5**

### Property 37: Theme toggle switching

For any current theme state (light or dark), activating the theme toggle should switch to the opposite theme.

**Validates: Requirements 11.2**

### Property 38: Theme application completeness

For any theme selected (light or dark), all visual components should have the appropriate theme classes applied.

**Validates: Requirements 11.3**

### Property 39: Theme preference persistence

For any theme selected, retrieving data from Local Storage should return that theme preference.

**Validates: Requirements 11.4**

### Property 40: Theme storage round-trip

For any theme preference stored in Local Storage, loading the application should apply that theme to the UI.

**Validates: Requirements 11.5**

## Error Handling

### Input Validation Errors

**Empty Field Errors**
- Error Message: "Please fill in all required fields"
- Trigger: Any required field (item name, amount, category) is empty or whitespace-only
- Action: Display error message, prevent form submission, maintain current state

**Invalid Amount Errors**
- Error Message: "Please enter a valid positive number for amount"
- Trigger: Amount field contains non-numeric characters or negative/zero values
- Action: Display error message, prevent form submission, highlight amount field

**Amount Range Errors**
- Error Message: "Amount must be between $0.01 and $999,999.99"
- Trigger: Amount is outside acceptable range
- Action: Display error message, prevent form submission

**Duplicate Category Errors**
- Error Message: "This category already exists"
- Trigger: User attempts to add a custom category that already exists
- Action: Display error message, prevent category creation

### Storage Errors

**Local Storage Quota Exceeded**
- Error Message: "Storage limit reached. Please delete some transactions."
- Trigger: Local Storage quota exceeded when saving data
- Action: Display error message, prevent new transaction creation, suggest deletion
- Recovery: Allow user to delete transactions to free space

**Local Storage Unavailable**
- Error Message: "Browser storage is not available. Data will not be saved."
- Trigger: Local Storage API is not supported or disabled
- Action: Display warning on app load, allow app to function in memory-only mode
- Recovery: Suggest enabling Local Storage or using a different browser

**Data Corruption**
- Error Message: "Saved data is corrupted. Starting fresh."
- Trigger: JSON parsing fails when loading from Local Storage
- Action: Clear corrupted data, initialize with empty state, log error
- Recovery: User starts with clean slate

### Chart Rendering Errors

**Chart.js Load Failure**
- Error Message: "Unable to load chart visualization"
- Trigger: Chart.js library fails to load
- Action: Display error message in chart area, app remains functional without chart
- Recovery: Suggest page refresh or check internet connection

**Invalid Chart Data**
- Error Message: "Unable to display chart with current data"
- Trigger: Category totals contain invalid values
- Action: Display error message, show data in table format instead
- Recovery: Validate and fix transaction data

### General Error Handling Strategy

1. **Graceful Degradation**: Core functionality continues even if non-critical features fail
2. **User-Friendly Messages**: All error messages are clear and actionable
3. **Error Logging**: Console logging for debugging (development mode)
4. **State Recovery**: Application maintains consistent state even after errors
5. **Validation First**: Prevent errors through input validation before they occur

### Error Display Patterns

**Inline Errors**: Display next to the relevant form field
**Toast Notifications**: Temporary messages for non-critical errors
**Modal Dialogs**: For critical errors requiring user acknowledgment
**Console Logging**: Technical details for developers (not shown to users)

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific scenarios and property-based tests for comprehensive validation of universal behaviors. This ensures both concrete correctness and general robustness across all possible inputs.

### Testing Framework Selection

**Unit Testing**: Jest (or Vitest for faster execution)
- Lightweight, fast execution
- Built-in mocking capabilities
- Good browser API mocking support
- Excellent assertion library

**Property-Based Testing**: fast-check
- JavaScript/TypeScript native library
- Integrates seamlessly with Jest/Vitest
- Powerful arbitrary generators
- Shrinking capabilities for minimal failing examples

### Unit Testing Approach

Unit tests focus on specific examples, edge cases, and integration points. They should be used judiciously to complement property-based tests, not duplicate their coverage.

**Focus Areas for Unit Tests:**
1. Specific example transactions (e.g., "Grocery Shopping, $45.50, Food")
2. Edge cases (empty state, single transaction, storage quota limits)
3. Error conditions (invalid inputs, storage failures)
4. Integration between components (e.g., form submission triggers storage and UI updates)
5. Browser API mocking (Local Storage, DOM manipulation)

**Unit Test Examples:**

```javascript
// Example: Specific transaction creation
test('creates a grocery transaction correctly', () => {
  const transaction = createTransaction('Groceries', 45.50, 'Food');
  expect(transaction.itemName).toBe('Groceries');
  expect(transaction.amount).toBe(45.50);
  expect(transaction.category).toBe('Food');
});

// Edge case: Empty state
test('displays zero when no transactions exist', () => {
  const total = calculateTotal([]);
  expect(total).toBe(0);
});

// Error condition: Storage failure
test('handles Local Storage quota exceeded gracefully', () => {
  mockLocalStorage.setItem.mockImplementation(() => {
    throw new Error('QuotaExceededError');
  });
  const result = saveTransaction(transaction);
  expect(result.error).toBe('Storage limit reached');
});
```

### Property-Based Testing Approach

Property-based tests validate universal properties across randomly generated inputs. Each test runs a minimum of 100 iterations to ensure comprehensive coverage.

**Configuration:**
- Minimum iterations: 100 per property test
- Timeout: 5000ms per test
- Shrinking: Enabled (to find minimal failing examples)

**Property Test Structure:**

Each property test must:
1. Reference the design document property number and text in a comment
2. Generate random valid inputs using fast-check arbitraries
3. Execute the operation under test
4. Assert the property holds for all generated inputs

**Property Test Examples:**

```javascript
// Feature: expense-budget-visualizer, Property 1: Valid transaction creation
test('property: valid transaction creation', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 1, maxLength: 100 }),  // item name
      fc.float({ min: 0.01, max: 999999.99 }),      // amount
      fc.constantFrom('Food', 'Transport', 'Fun'),   // category
      (itemName, amount, category) => {
        const transaction = createTransaction(itemName, amount, category);
        expect(transaction).toBeDefined();
        expect(transaction.itemName).toBe(itemName);
        expect(transaction.amount).toBeCloseTo(amount, 2);
        expect(transaction.category).toBe(category);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: expense-budget-visualizer, Property 14: Total calculation accuracy
test('property: total calculation accuracy', () => {
  fc.assert(
    fc.property(
      fc.array(transactionArbitrary, { minLength: 0, maxLength: 50 }),
      (transactions) => {
        const expectedTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
        const actualTotal = calculateTotal(transactions);
        expect(actualTotal).toBeCloseTo(expectedTotal, 2);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: expense-budget-visualizer, Property 23: Transaction storage round-trip
test('property: transaction storage round-trip', () => {
  fc.assert(
    fc.property(
      fc.array(transactionArbitrary, { minLength: 0, maxLength: 20 }),
      (transactions) => {
        saveTransactions(transactions);
        const loaded = loadTransactions();
        expect(loaded).toEqual(transactions);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Custom Arbitraries

Define reusable generators for domain objects:

```javascript
const transactionArbitrary = fc.record({
  id: fc.string(),
  itemName: fc.string({ minLength: 1, maxLength: 100 }),
  amount: fc.float({ min: 0.01, max: 999999.99 }),
  category: fc.constantFrom('Food', 'Transport', 'Fun'),
  date: fc.date().map(d => d.toISOString()),
  timestamp: fc.integer({ min: 1000000000000, max: 9999999999999 })
});

const categoryArbitrary = fc.string({ minLength: 1, maxLength: 50 });

const themeArbitrary = fc.constantFrom('light', 'dark');
```

### Test Organization

```
tests/
├── unit/
│   ├── transaction-manager.test.js
│   ├── storage-service.test.js
│   ├── validation-service.test.js
│   ├── category-manager.test.js
│   ├── theme-manager.test.js
│   └── ui-controller.test.js
├── properties/
│   ├── transaction-properties.test.js
│   ├── storage-properties.test.js
│   ├── calculation-properties.test.js
│   ├── sorting-properties.test.js
│   └── persistence-properties.test.js
└── integration/
    ├── form-submission.test.js
    ├── deletion-flow.test.js
    └── monthly-view.test.js
```

### Coverage Goals

- **Unit Test Coverage**: Focus on critical paths and error handling
- **Property Test Coverage**: All 40 correctness properties must have corresponding tests
- **Integration Test Coverage**: Key user workflows (add transaction, delete transaction, view monthly summary)

### Testing Best Practices

1. **Avoid Over-Testing**: Don't write unit tests that duplicate property test coverage
2. **Fast Execution**: Keep test suite under 10 seconds for rapid feedback
3. **Isolated Tests**: Each test should be independent and not rely on others
4. **Mock External Dependencies**: Mock Local Storage, Chart.js, and DOM APIs
5. **Readable Assertions**: Use descriptive test names and clear assertion messages
6. **Property Test Tagging**: Always include the feature name and property reference in comments

### Continuous Integration

- Run all tests on every commit
- Fail build if any test fails
- Generate coverage reports
- Run property tests with increased iterations (1000) in CI for deeper validation

