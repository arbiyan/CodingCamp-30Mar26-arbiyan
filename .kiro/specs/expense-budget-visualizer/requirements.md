# Requirements Document

## Introduction

The Expense & Budget Visualizer is a mobile-friendly web application that enables users to track their daily spending through an intuitive interface. The application displays total expenses, maintains a transaction history, and provides visual analytics of spending patterns by category. Built with vanilla web technologies (HTML, CSS, JavaScript) and utilizing browser Local Storage, the application operates entirely client-side without requiring backend infrastructure.

## Glossary

- **Application**: The Expense & Budget Visualizer web application
- **Transaction**: A single spending record containing item name, amount, and category
- **Category**: A classification label for transactions (e.g., Food, Transport, Fun)
- **Local_Storage**: Browser-based persistent storage mechanism for client-side data
- **Transaction_List**: The scrollable display of all recorded transactions
- **Input_Form**: The user interface component for adding new transactions
- **Total_Expense_Display**: The visual component showing the sum of all transaction amounts
- **Chart_Component**: The visual pie chart displaying spending distribution by category
- **Custom_Category**: A user-defined category beyond the default set

## Technical Constraints

- **TC-1**: Technology Stack - HTML for structure, CSS for styling, Vanilla JavaScript (no frameworks), No backend server required
- **TC-2**: Data Storage - Use browser Local Storage API, All data stored client-side only
- **TC-3**: Browser Compatibility - Must work in modern browsers (Chrome, Firefox, Edge, Safari)

## Non-Functional Requirements

- **NFR-1**: Simplicity - Clean minimal interface, Easy to understand and use, No complex setup required
- **NFR-2**: Performance - Fast load time, Responsive UI interactions, No noticeable lag when updating data
- **NFR-3**: Visual Design - User-friendly aesthetic, Clear visual hierarchy, Readable typography

## Folder Structure Requirements

- Only 1 CSS file inside css/ directory
- Only 1 JavaScript file inside js/ directory
- Keep code clean and readable

## Requirements

### Requirement 1: Transaction Input

**User Story:** As a user, I want to add spending transactions with item name, amount, and category, so that I can track my expenses.

#### Acceptance Criteria

1. THE Input_Form SHALL display fields for Item Name, Amount, and Category
2. THE Input_Form SHALL provide at least three default categories: Food, Transport, and Fun
3. WHEN all required fields are filled and the form is submitted, THE Application SHALL create a new Transaction
4. WHEN the form is submitted with empty fields, THE Application SHALL display a validation error message
5. WHEN a Transaction is successfully created, THE Application SHALL clear the Input_Form fields
6. THE Input_Form SHALL accept numeric values for the Amount field
7. WHEN a non-numeric value is entered in the Amount field, THE Application SHALL display a validation error message

### Requirement 2: Transaction List Display

**User Story:** As a user, I want to view all my transactions in a scrollable list, so that I can review my spending history.

#### Acceptance Criteria

1. THE Transaction_List SHALL display all stored transactions
2. FOR EACH Transaction, THE Transaction_List SHALL display the item name, amount, and category
3. WHEN the number of transactions exceeds the visible area, THE Transaction_List SHALL be scrollable
4. WHEN a new Transaction is added, THE Transaction_List SHALL update to include the new entry
5. THE Transaction_List SHALL display transactions in chronological order with newest first

### Requirement 3: Transaction Deletion

**User Story:** As a user, I want to delete individual transactions, so that I can remove incorrect or unwanted entries.

#### Acceptance Criteria

1. FOR EACH Transaction in the Transaction_List, THE Application SHALL provide a delete control
2. WHEN a user activates the delete control, THE Application SHALL remove the corresponding Transaction
3. WHEN a Transaction is deleted, THE Transaction_List SHALL update to reflect the removal
4. WHEN a Transaction is deleted, THE Total_Expense_Display SHALL recalculate and update
5. WHEN a Transaction is deleted, THE Chart_Component SHALL update to reflect the new distribution

### Requirement 4: Total Expense Calculation

**User Story:** As a user, I want to see my total spending amount, so that I can understand my overall expenses.

#### Acceptance Criteria

1. THE Total_Expense_Display SHALL show the sum of all Transaction amounts
2. WHEN a Transaction is added, THE Total_Expense_Display SHALL recalculate and update automatically
3. WHEN a Transaction is deleted, THE Total_Expense_Display SHALL recalculate and update automatically
4. WHEN no transactions exist, THE Total_Expense_Display SHALL show zero
5. THE Total_Expense_Display SHALL format amounts with appropriate currency notation

### Requirement 5: Visual Spending Chart

**User Story:** As a user, I want to see a pie chart of my spending by category, so that I can visualize my spending patterns.

#### Acceptance Criteria

1. THE Chart_Component SHALL display a pie chart showing spending distribution by Category
2. WHEN a Transaction is added, THE Chart_Component SHALL update automatically
3. WHEN a Transaction is deleted, THE Chart_Component SHALL update automatically
4. THE Chart_Component SHALL use distinct colors for each Category
5. THE Chart_Component SHALL display category labels and percentage or amount values
6. WHEN no transactions exist, THE Chart_Component SHALL display an empty or placeholder state

### Requirement 6: Data Persistence

**User Story:** As a user, I want my transaction data to persist between sessions, so that I don't lose my spending history when I close the browser.

#### Acceptance Criteria

1. WHEN a Transaction is added, THE Application SHALL store it in Local_Storage
2. WHEN a Transaction is deleted, THE Application SHALL update Local_Storage
3. WHEN the Application loads, THE Application SHALL retrieve all stored transactions from Local_Storage
4. WHEN the Application loads, THE Application SHALL populate the Transaction_List with retrieved data
5. WHEN the Application loads, THE Application SHALL update the Total_Expense_Display with retrieved data
6. WHEN the Application loads, THE Application SHALL update the Chart_Component with retrieved data

### Requirement 7: Custom Categories

**User Story:** As a user, I want to create custom spending categories, so that I can organize my expenses according to my personal needs.

#### Acceptance Criteria

1. THE Application SHALL provide a mechanism to add Custom_Category entries
2. WHEN a Custom_Category is created, THE Application SHALL add it to the available category options
3. WHEN a Custom_Category is created, THE Application SHALL store it in Local_Storage
4. WHEN the Application loads, THE Application SHALL retrieve and display all Custom_Category entries
5. THE Input_Form SHALL display both default and Custom_Category options in the category selector

### Requirement 8: Monthly Summary View

**User Story:** As a user, I want to view a summary of my spending for each month, so that I can track my expenses over time.

#### Acceptance Criteria

1. THE Application SHALL provide a monthly summary view component
2. THE Application SHALL group transactions by month based on creation date
3. FOR EACH month with transactions, THE Application SHALL display the total spending amount
4. THE Application SHALL allow users to switch between the main view and monthly summary view
5. WHEN viewing a specific month, THE Application SHALL display only transactions from that month

### Requirement 9: Transaction Sorting

**User Story:** As a user, I want to sort my transactions by amount or category, so that I can analyze my spending more effectively.

#### Acceptance Criteria

1. THE Application SHALL provide sorting controls for the Transaction_List
2. WHEN the user selects sort by amount, THE Transaction_List SHALL reorder transactions from highest to lowest amount
3. WHEN the user selects sort by category, THE Transaction_List SHALL group transactions by Category
4. THE Application SHALL maintain the selected sort order until changed by the user
5. THE Application SHALL provide a way to return to the default chronological order

### Requirement 10: Spending Limit Alert

**User Story:** As a user, I want to set a spending limit and be alerted when I exceed it, so that I can stay within my budget.

#### Acceptance Criteria

1. THE Application SHALL provide a mechanism to set a spending limit value
2. WHEN the spending limit is set, THE Application SHALL store it in Local_Storage
3. WHEN the Total_Expense_Display exceeds the spending limit, THE Application SHALL display a visual alert or warning
4. THE Application SHALL highlight the Total_Expense_Display differently when the limit is exceeded
5. WHEN the Application loads, THE Application SHALL retrieve the stored spending limit from Local_Storage

### Requirement 11: Theme Toggle

**User Story:** As a user, I want to switch between dark and light modes, so that I can use the app comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Application SHALL provide a theme toggle control
2. WHEN the user activates the theme toggle, THE Application SHALL switch between dark mode and light mode
3. THE Application SHALL apply the selected theme to all visual components
4. WHEN a theme is selected, THE Application SHALL store the preference in Local_Storage
5. WHEN the Application loads, THE Application SHALL apply the stored theme preference
6. WHEN no theme preference is stored, THE Application SHALL use a default theme

### Requirement 12: Browser Compatibility

**User Story:** As a user, I want the application to work consistently across different browsers, so that I can use it on any device.

#### Acceptance Criteria

1. THE Application SHALL function correctly in Chrome browser
2. THE Application SHALL function correctly in Firefox browser
3. THE Application SHALL function correctly in Edge browser
4. THE Application SHALL function correctly in Safari browser
5. THE Application SHALL display consistently across all supported browsers

### Requirement 13: Mobile Responsiveness

**User Story:** As a user, I want the application to work well on mobile devices, so that I can track expenses on the go.

#### Acceptance Criteria

1. THE Application SHALL adapt its layout for mobile screen sizes
2. THE Application SHALL maintain full functionality on touch-enabled devices
3. THE Input_Form SHALL be easily usable on mobile devices
4. THE Chart_Component SHALL be readable and interactive on mobile screens
5. THE Application SHALL respond to touch gestures appropriately
