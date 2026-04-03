# Monthly Summary Zero Display Fix - Bugfix Design

## Overview

The Monthly Summary view displays $0.00 as the total when first opened, even when transactions exist. This occurs because the `_handleViewChange` method in UIController does not programmatically select a month when switching to Monthly Summary view, leaving `selectedMonth` as null. The fix will automatically select the most recent month (first in the dropdown) when the user switches to Monthly Summary view, ensuring the correct total is displayed immediately.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when the user switches to Monthly Summary view and no month is programmatically selected
- **Property (P)**: The desired behavior - the most recent month should be automatically selected and its total displayed
- **Preservation**: Existing manual month selection, view switching, and transaction display behaviors that must remain unchanged
- **_handleViewChange**: The method in UIController (js/app.js) that handles switching between Main View and Monthly Summary view
- **selectedMonth**: The property in MonthlyViewManager that stores the currently selected month as `{ year: number, month: number }` or null
- **_updateMonthlyTotal**: The method in UIController that displays the monthly total based on selectedMonth

## Bug Details

### Bug Condition

The bug manifests when a user clicks the "Monthly Summary" button to switch views. The `_handleViewChange` method calls `monthlyViewManager.showMonthlyView()` without any parameters, which sets the view to 'monthly' but leaves `selectedMonth` as null. When `_updateMonthlyTotal()` executes with a null `selectedMonth`, it displays $0.00 regardless of whether transactions exist.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type ViewChangeEvent
  OUTPUT: boolean
  
  RETURN input.targetView == 'monthly'
         AND availableMonths.length > 0
         AND selectedMonth == null
         AND displayedTotal == 0.00
END FUNCTION
```

### Examples

- User has transactions in January 2024 and February 2024
- User clicks "Monthly Summary" button
- Expected: February 2024 (most recent) is selected, total shows correct amount (e.g., $450.00)
- Actual: No month is selected programmatically, total shows $0.00
- User must manually change the dropdown to see the correct total

- User has no transactions
- User clicks "Monthly Summary" button
- Expected: Dropdown shows "No months available", total shows $0.00
- Actual: Same as expected (this edge case works correctly)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Manual month selection via the dropdown must continue to work exactly as before
- Switching back to Main View must continue to display the overall total correctly
- Transaction list filtering by selected month must remain unchanged
- The month selector dropdown population must remain unchanged
- Adding or deleting transactions must continue to update the month selector correctly

**Scope:**
All inputs that do NOT involve the initial switch to Monthly Summary view should be completely unaffected by this fix. This includes:
- Manual dropdown changes (month-select change events)
- Switching to Main View
- Adding transactions
- Deleting transactions
- Any other UI interactions

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is:

1. **Missing Auto-Selection Logic**: The `_handleViewChange` method in UIController (line ~1230) calls `monthlyViewManager.showMonthlyView()` without parameters when view === 'monthly'
   - The MonthlyViewManager.showMonthlyView() method accepts optional year and month parameters
   - When called without parameters, it sets currentView to 'monthly' but leaves selectedMonth as null

2. **Null Check Behavior**: The `_updateMonthlyTotal` method (line ~1350) checks if selectedMonth is null and displays $0.00
   - This is correct behavior for the null case
   - The issue is that selectedMonth should not be null when months are available

3. **Missing Integration**: The available months are retrieved via `getAvailableMonths()` but never used to auto-select the first month
   - The `_updateMonthSelector` method populates the dropdown correctly
   - However, there's no logic to programmatically select the first option and trigger the selection

## Correctness Properties

Property 1: Bug Condition - Auto-Select Most Recent Month

_For any_ view change event where the user switches to Monthly Summary view and at least one month with transactions exists, the fixed _handleViewChange method SHALL automatically select the most recent month (first in the available months list) and display its correct total.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Manual Month Selection

_For any_ month selection event that is NOT the initial switch to Monthly Summary view (manual dropdown changes, subsequent view switches), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing month selection and total display functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `js/app.js`

**Method**: `_handleViewChange` (approximately line 1230)

**Specific Changes**:
1. **Add Auto-Selection Logic**: When switching to monthly view, check if months are available
   - Call `monthlyViewManager.getAvailableMonths()` to get the list of months
   - If the list is not empty, extract the first month (most recent)
   - Call `monthlyViewManager.showMonthlyView(year, month)` with the first month's year and month

2. **Update Month Selector State**: Ensure the dropdown reflects the auto-selected month
   - After auto-selecting, set the month-select dropdown value to match the selected month
   - Format: `${year}-${month}`

3. **Preserve Null Case**: When no months are available, continue to call `showMonthlyView()` without parameters
   - This maintains the existing behavior for the empty state

**Pseudocode for Fix**:
```
FUNCTION _handleViewChange(view)
  IF view == 'main' THEN
    monthlyViewManager.showMainView()
  ELSE IF view == 'monthly' THEN
    // Get available months
    availableMonths := monthlyViewManager.getAvailableMonths()
    
    // Auto-select first (most recent) month if available
    IF availableMonths.length > 0 THEN
      firstMonth := availableMonths[0]
      monthlyViewManager.showMonthlyView(firstMonth.year, firstMonth.month)
      
      // Update dropdown to reflect selection
      monthSelect := document.getElementById('month-select')
      IF monthSelect THEN
        monthSelect.value := `${firstMonth.year}-${firstMonth.month}`
      END IF
    ELSE
      // No months available, show empty state
      monthlyViewManager.showMonthlyView()
    END IF
  END IF
  
  // Update UI (existing code)
  _updateViewDisplay()
  renderTransactionList()
  _updateMonthlyTotal()
END FUNCTION
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate clicking the "Monthly Summary" button when transactions exist. Run these tests on the UNFIXED code to observe that $0.00 is displayed and selectedMonth is null.

**Test Cases**:
1. **Single Month Test**: Add transactions for January 2024, click Monthly Summary button (will fail on unfixed code - shows $0.00)
2. **Multiple Months Test**: Add transactions for January and February 2024, click Monthly Summary button (will fail on unfixed code - shows $0.00, should show February total)
3. **No Transactions Test**: With no transactions, click Monthly Summary button (should pass - correctly shows $0.00)
4. **View Switch Test**: Switch to Monthly Summary, then back to Main, then to Monthly again (will fail on unfixed code - shows $0.00 each time)

**Expected Counterexamples**:
- Monthly total displays $0.00 when transactions exist
- selectedMonth is null after switching to Monthly Summary view
- Dropdown shows months but none is selected programmatically
- Root cause confirmed: _handleViewChange does not call showMonthlyView with parameters

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := _handleViewChange_fixed('monthly')
  ASSERT selectedMonth != null
  ASSERT selectedMonth == mostRecentMonth
  ASSERT displayedTotal == correctMonthTotal
  ASSERT dropdownValue == `${selectedMonth.year}-${selectedMonth.month}`
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT _handleViewChange_original(input) = _handleViewChange_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for manual month selection and view switching, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Manual Month Selection Preservation**: Observe that manually changing the dropdown works on unfixed code, then verify this continues after fix
2. **Main View Preservation**: Observe that switching to Main View works correctly on unfixed code, then verify this continues after fix
3. **Transaction Display Preservation**: Observe that transaction filtering by month works on unfixed code, then verify this continues after fix
4. **Subsequent View Switches**: Observe that switching views multiple times works on unfixed code, then verify this continues after fix

### Unit Tests

- Test _handleViewChange with no transactions (should show $0.00, no month selected)
- Test _handleViewChange with one month of transactions (should auto-select that month)
- Test _handleViewChange with multiple months (should auto-select most recent)
- Test that dropdown value is set correctly after auto-selection
- Test that manual month selection still works after auto-selection
- Test switching between views multiple times

### Property-Based Tests

- Generate random transaction sets with various dates and verify auto-selection always picks the most recent month
- Generate random sequences of view switches and month selections, verify behavior is consistent
- Generate random transaction additions/deletions and verify month selector updates correctly

### Integration Tests

- Test full user flow: add transactions, switch to Monthly Summary, verify correct total displayed
- Test edge case: switch to Monthly Summary with no transactions, add transaction, switch back to Monthly Summary
- Test that visual feedback (dropdown selection, total display) matches internal state
- Test that switching views preserves transaction list filtering correctly
