# Implementation Plan: Expense & Budget Visualizer

## Overview

This implementation plan breaks down the expense tracking web application into discrete coding tasks. The application will be built with vanilla HTML, CSS, and JavaScript, using Local Storage for persistence and Chart.js for visualization. Tasks are organized to build incrementally, validating core functionality early through code.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create index.html with semantic HTML5 structure
  - Set up folder structure: css/, js/ directories
  - Add meta tags for mobile responsiveness
  - Include Chart.js CDN link in HTML
  - Create basic page layout with containers for form, transaction list, chart, and summary
  - _Requirements: TC-1, NFR-3_

- [x] 2. Implement core data models and storage service
  - [x] 2.1 Create StorageService class with Local Storage operations
    - Implement saveTransactions(), loadTransactions() methods
    - Implement saveCategories(), loadCategories() methods
    - Implement saveSpendingLimit(), loadSpendingLimit() methods
    - Implement saveTheme(), loadTheme() methods
    - Add error handling for storage quota and unavailability
    - _Requirements: 6.1, 6.2, 6.3, 7.3, 10.2, 11.4_
  
  - [ ]* 2.2 Write property test for transaction storage round-trip
    - **Property 23: Transaction storage round-trip**
    - **Validates: Requirements 6.3**
  
  - [ ]* 2.3 Write property test for custom category storage round-trip
    - **Property 26: Custom category storage round-trip**
    - **Validates: Requirements 7.4**
  
  - [ ]* 2.4 Write property test for spending limit storage round-trip
    - **Property 36: Spending limit storage round-trip**
    - **Validates: Requirements 10.5**
  
  - [ ]* 2.5 Write property test for theme storage round-trip
    - **Property 40: Theme storage round-trip**
    - **Validates: Requirements 11.5**

- [x] 3. Implement validation service
  - [x] 3.1 Create ValidationService class
    - Implement validateTransaction() method with all validation rules
    - Implement validateAmount() for numeric and range validation
    - Implement validateRequired() for empty field checks
    - Implement validateCategory() for category existence checks
    - Return ValidationResult objects with errors array
    - _Requirements: 1.4, 1.6, 1.7_
  
  - [ ]* 3.2 Write property test for empty field validation
    - **Property 2: Empty field validation**
    - **Validates: Requirements 1.4**
  
  - [ ]* 3.3 Write property test for amount validation
    - **Property 4: Amount validation**
    - **Validates: Requirements 1.6, 1.7**

- [x] 4. Implement transaction manager
  - [x] 4.1 Create TransactionManager class
    - Implement addTransaction() to create transactions with unique IDs
    - Implement deleteTransaction() to remove by ID
    - Implement getAllTransactions() to retrieve all transactions
    - Implement getTransactionsByMonth() for monthly filtering
    - Implement calculateTotal() for sum calculation
    - Implement getCategoryTotals() for chart data
    - Integrate with StorageService for persistence
    - _Requirements: 1.3, 2.1, 3.2, 4.1, 5.1, 6.1, 6.2, 8.2_
  
  - [ ]* 4.2 Write property test for valid transaction creation
    - **Property 1: Valid transaction creation**
    - **Validates: Requirements 1.3**
  
  - [ ]* 4.3 Write property test for transaction list completeness
    - **Property 5: Transaction list completeness**
    - **Validates: Requirements 2.1**
  
  - [ ]* 4.4 Write property test for transaction deletion
    - **Property 10: Transaction deletion**
    - **Validates: Requirements 3.2**
  
  - [ ]* 4.5 Write property test for total calculation accuracy
    - **Property 14: Total calculation accuracy**
    - **Validates: Requirements 4.1**
  
  - [ ]* 4.6 Write property test for transaction persistence on addition
    - **Property 21: Transaction persistence on addition**
    - **Validates: Requirements 6.1**
  
  - [ ]* 4.7 Write property test for transaction persistence on deletion
    - **Property 22: Transaction persistence on deletion**
    - **Validates: Requirements 6.2**

- [x] 5. Checkpoint - Ensure core transaction logic works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement category manager
  - [x] 6.1 Create CategoryManager class
    - Define default categories array: Food, Transport, Fun
    - Implement getAllCategories() combining default and custom
    - Implement addCustomCategory() with uniqueness check
    - Implement getDefaultCategories() method
    - Implement categoryExists() validation method
    - Integrate with StorageService for custom category persistence
    - _Requirements: 1.2, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 6.2 Write property test for custom category addition
    - **Property 24: Custom category addition**
    - **Validates: Requirements 7.2**
  
  - [ ]* 6.3 Write property test for custom category persistence
    - **Property 25: Custom category persistence**
    - **Validates: Requirements 7.3**
  
  - [ ]* 6.4 Write property test for category selector completeness
    - **Property 27: Category selector completeness**
    - **Validates: Requirements 7.5**

- [x] 7. Implement sort manager
  - [x] 7.1 Create SortManager class
    - Implement sortByAmount() for high-to-low ordering
    - Implement sortByCategory() for category grouping
    - Implement sortByDate() for chronological ordering (newest first)
    - Implement getCurrentSort() and setSortMode() for state management
    - _Requirements: 2.5, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 7.2 Write property test for chronological ordering
    - **Property 8: Chronological ordering**
    - **Validates: Requirements 2.5**
  
  - [ ]* 7.3 Write property test for sort by amount ordering
    - **Property 31: Sort by amount ordering**
    - **Validates: Requirements 9.2**
  
  - [ ]* 7.4 Write property test for sort by category grouping
    - **Property 32: Sort by category grouping**
    - **Validates: Requirements 9.3**
  
  - [ ]* 7.5 Write property test for sort state persistence
    - **Property 33: Sort state persistence**
    - **Validates: Requirements 9.4**

- [x] 8. Implement budget manager
  - [x] 8.1 Create BudgetManager class
    - Implement setSpendingLimit() method
    - Implement getSpendingLimit() method
    - Implement isOverBudget() to check if total exceeds limit
    - Integrate with StorageService for limit persistence
    - _Requirements: 10.1, 10.2, 10.3, 10.5_
  
  - [ ]* 8.2 Write property test for spending limit persistence
    - **Property 34: Spending limit persistence**
    - **Validates: Requirements 10.2**
  
  - [ ]* 8.3 Write property test for budget alert display
    - **Property 35: Budget alert display**
    - **Validates: Requirements 10.3, 10.4**

- [x] 9. Implement theme manager
  - [x] 9.1 Create ThemeManager class
    - Implement toggleTheme() to switch between light and dark
    - Implement applyTheme() to add/remove CSS classes
    - Implement getCurrentTheme() method
    - Integrate with StorageService for theme persistence
    - _Requirements: 11.2, 11.3, 11.4, 11.5_
  
  - [ ]* 9.2 Write property test for theme toggle switching
    - **Property 37: Theme toggle switching**
    - **Validates: Requirements 11.2**
  
  - [ ]* 9.3 Write property test for theme application completeness
    - **Property 38: Theme application completeness**
    - **Validates: Requirements 11.3**
  
  - [ ]* 9.4 Write property test for theme preference persistence
    - **Property 39: Theme preference persistence**
    - **Validates: Requirements 11.4**

- [x] 10. Implement monthly view manager
  - [x] 10.1 Create MonthlyViewManager class
    - Implement getAvailableMonths() to list months with transactions
    - Implement getMonthSummary() to calculate monthly totals
    - Implement showMonthlyView() and showMainView() for view switching
    - Use TransactionManager.getTransactionsByMonth() for filtering
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 10.2 Write property test for monthly transaction grouping
    - **Property 28: Monthly transaction grouping**
    - **Validates: Requirements 8.2**
  
  - [ ]* 10.3 Write property test for monthly total calculation
    - **Property 29: Monthly total calculation**
    - **Validates: Requirements 8.3**
  
  - [ ]* 10.4 Write property test for monthly filtering
    - **Property 30: Monthly filtering**
    - **Validates: Requirements 8.5**

- [x] 11. Checkpoint - Ensure all business logic is complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Implement chart component
  - [x] 12.1 Create ChartComponent class with Chart.js integration
    - Implement init() to create Chart.js pie chart instance
    - Implement update() to refresh chart with new category data
    - Implement showEmptyState() for zero transactions
    - Implement reset() to destroy and recreate chart
    - Configure chart colors, labels, and responsive options
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 12.2 Write property test for chart category grouping
    - **Property 17: Chart category grouping**
    - **Validates: Requirements 5.1**
  
  - [ ]* 12.3 Write property test for chart updates on addition
    - **Property 18: Chart updates on addition**
    - **Validates: Requirements 5.2**
  
  - [ ]* 12.4 Write property test for chart color uniqueness
    - **Property 19: Chart color uniqueness**
    - **Validates: Requirements 5.4**
  
  - [ ]* 12.5 Write property test for chart label completeness
    - **Property 20: Chart label completeness**
    - **Validates: Requirements 5.5**

- [x] 13. Implement UI controller
  - [x] 13.1 Create UIController class
    - Implement init() to set up event listeners and initialize components
    - Implement renderTransactionList() to display all transactions
    - Implement updateTotalDisplay() with currency formatting
    - Implement updateChart() to refresh chart component
    - Implement showError() for validation error display
    - Implement clearForm() to reset input fields
    - Implement applyTheme() to update UI theme
    - Implement showBudgetAlert() for spending limit warnings
    - Wire up form submission handler with validation
    - Wire up delete button handlers for each transaction
    - Wire up sort controls
    - Wire up theme toggle button
    - Wire up monthly view navigation
    - _Requirements: 1.1, 1.5, 2.2, 2.3, 2.4, 3.1, 3.3, 3.4, 3.5, 4.2, 4.3, 4.5, 9.1_
  
  - [ ]* 13.2 Write property test for transaction display information
    - **Property 6: Transaction display information**
    - **Validates: Requirements 2.2**
  
  - [ ]* 13.3 Write property test for transaction list updates on addition
    - **Property 7: Transaction list updates on addition**
    - **Validates: Requirements 2.4**
  
  - [ ]* 13.4 Write property test for delete control presence
    - **Property 9: Delete control presence**
    - **Validates: Requirements 3.1**
  
  - [ ]* 13.5 Write property test for list updates on deletion
    - **Property 11: List updates on deletion**
    - **Validates: Requirements 3.3**
  
  - [ ]* 13.6 Write property test for total updates on deletion
    - **Property 12: Total updates on deletion**
    - **Validates: Requirements 3.4**
  
  - [ ]* 13.7 Write property test for chart updates on deletion
    - **Property 13: Chart updates on deletion**
    - **Validates: Requirements 3.5**
  
  - [ ]* 13.8 Write property test for total updates on addition
    - **Property 15: Total updates on addition**
    - **Validates: Requirements 4.2**
  
  - [ ]* 13.9 Write property test for currency formatting
    - **Property 16: Currency formatting**
    - **Validates: Requirements 4.5**
  
  - [ ]* 13.10 Write property test for form clearing after submission
    - **Property 3: Form clearing after submission**
    - **Validates: Requirements 1.5**

- [x] 14. Create main application entry point
  - [x] 14.1 Create main app.js file
    - Instantiate all manager classes (Storage, Transaction, Category, Theme, Budget, Sort, MonthlyView)
    - Instantiate ChartComponent
    - Instantiate UIController with all dependencies
    - Call UIController.init() on DOMContentLoaded
    - Load persisted data from storage on initialization
    - Render initial UI state with loaded data
    - _Requirements: 6.3, 6.4, 6.5, 6.6, 7.4, 10.5, 11.5, 11.6_

- [x] 15. Implement CSS styling
  - [x] 15.1 Create single styles.css file
    - Define CSS variables for light and dark themes
    - Style input form with responsive layout
    - Style transaction list with scrollable container
    - Style total expense display with prominent typography
    - Style chart container with responsive sizing
    - Style delete buttons and controls
    - Style sort controls and monthly view navigation
    - Style budget alert/warning states
    - Style theme toggle button
    - Implement mobile-first responsive breakpoints
    - Add touch-friendly sizing for mobile devices
    - Ensure consistent styling across browsers
    - _Requirements: NFR-1, NFR-3, 11.1, 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 16. Checkpoint - Ensure complete application works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Add error handling and edge cases
  - [x] 17.1 Implement comprehensive error handling
    - Add try-catch blocks for Local Storage operations
    - Handle storage quota exceeded errors
    - Handle Local Storage unavailable scenarios
    - Handle Chart.js load failures
    - Handle invalid chart data gracefully
    - Display user-friendly error messages
    - Log errors to console for debugging
    - _Requirements: NFR-2_
  
  - [ ]* 17.2 Write unit tests for storage error scenarios
    - Test quota exceeded handling
    - Test storage unavailable fallback
    - Test data corruption recovery
    - _Requirements: 6.1, 6.2_

- [-] 18. Final integration and polish
  - [x] 18.1 Wire all components together
    - Verify form submission creates transaction, updates list, chart, and total
    - Verify deletion removes transaction, updates list, chart, and total
    - Verify custom category creation appears in selector
    - Verify sort controls reorder transaction list correctly
    - Verify monthly view filters and displays correct data
    - Verify budget alert appears when limit exceeded
    - Verify theme toggle switches all UI components
    - Verify all data persists across page reloads
    - _Requirements: All requirements_
  
  - [ ]* 18.2 Write integration tests for key user workflows
    - Test complete add transaction flow
    - Test complete delete transaction flow
    - Test monthly view navigation flow
    - Test theme switching flow
    - _Requirements: 1.3, 3.2, 8.4, 11.2_

- [x] 19. Final checkpoint - Complete application validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout development
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and error handling scenarios
- The application uses only vanilla JavaScript with Chart.js as the single external dependency
- All code should be contained in single CSS and JS files per folder structure requirements
