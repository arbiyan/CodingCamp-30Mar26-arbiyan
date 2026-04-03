# Bugfix Requirements Document

## Introduction

The Monthly Summary view always displays $0.00 as the total, even when transactions exist for the displayed month. This occurs because when switching to the Monthly Summary view, no month is actually selected programmatically, despite a month appearing in the dropdown. Users must manually change the dropdown selection to see the correct total. This bugfix ensures that when switching to Monthly Summary view, the most recent month (first in the dropdown) is automatically selected and its total is displayed.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the user clicks the "Monthly Summary" button THEN the system displays $0.00 as the monthly total even though transactions exist

1.2 WHEN the Monthly Summary view is shown THEN the system does not programmatically select any month, leaving selectedMonth as null

1.3 WHEN selectedMonth is null THEN the system displays $0.00 in the monthly total display

### Expected Behavior (Correct)

2.1 WHEN the user clicks the "Monthly Summary" button THEN the system SHALL automatically select the most recent month (first in the dropdown)

2.2 WHEN the most recent month is automatically selected THEN the system SHALL display the correct total for that month

2.3 WHEN no months are available (no transactions exist) THEN the system SHALL display $0.00 as the monthly total

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the user manually changes the month selection in the dropdown THEN the system SHALL CONTINUE TO update the monthly total correctly

3.2 WHEN the user switches back to Main View THEN the system SHALL CONTINUE TO display the overall total correctly

3.3 WHEN transactions are added or deleted THEN the system SHALL CONTINUE TO update the monthly selector dropdown with available months

3.4 WHEN the user is in Main View THEN the system SHALL CONTINUE TO display all transactions and the overall total
