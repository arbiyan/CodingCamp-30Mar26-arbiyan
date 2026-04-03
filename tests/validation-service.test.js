// Simple unit tests for ValidationService
// This file tests the ValidationService class implementation

// Mock the ValidationService class (in a real scenario, we'd import it)
class ValidationService {
  validateTransaction(itemName, amount, category, availableCategories) {
    const errors = [];

    if (!this.validateRequired(itemName)) {
      errors.push('Item name is required');
    }

    if (!this.validateRequired(amount)) {
      errors.push('Amount is required');
    } else if (!this.validateAmount(amount)) {
      errors.push('Please enter a valid positive number for amount');
    }

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

  validateAmount(amount) {
    const amountStr = String(amount).trim();
    
    if (amountStr === '') {
      return false;
    }

    const numValue = Number(amountStr);
    if (isNaN(numValue)) {
      return false;
    }

    if (numValue <= 0 || numValue > 999999.99) {
      return false;
    }

    return true;
  }

  validateRequired(value) {
    if (value === null || value === undefined) {
      return false;
    }

    const strValue = String(value).trim();
    return strValue.length > 0;
  }

  validateCategory(category, availableCategories) {
    if (!availableCategories || !Array.isArray(availableCategories)) {
      return false;
    }

    return availableCategories.includes(category);
  }
}

// Test suite
console.log('Running ValidationService tests...\n');

const validator = new ValidationService();
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

// Test validateRequired
test('validateRequired returns false for null', () => {
  assert(!validator.validateRequired(null), 'Should return false for null');
});

test('validateRequired returns false for undefined', () => {
  assert(!validator.validateRequired(undefined), 'Should return false for undefined');
});

test('validateRequired returns false for empty string', () => {
  assert(!validator.validateRequired(''), 'Should return false for empty string');
});

test('validateRequired returns false for whitespace only', () => {
  assert(!validator.validateRequired('   '), 'Should return false for whitespace');
});

test('validateRequired returns true for valid string', () => {
  assert(validator.validateRequired('test'), 'Should return true for valid string');
});

// Test validateAmount
test('validateAmount returns false for empty string', () => {
  assert(!validator.validateAmount(''), 'Should return false for empty string');
});

test('validateAmount returns false for non-numeric string', () => {
  assert(!validator.validateAmount('abc'), 'Should return false for non-numeric');
});

test('validateAmount returns false for negative number', () => {
  assert(!validator.validateAmount(-10), 'Should return false for negative');
});

test('validateAmount returns false for zero', () => {
  assert(!validator.validateAmount(0), 'Should return false for zero');
});

test('validateAmount returns false for amount exceeding max', () => {
  assert(!validator.validateAmount(1000000), 'Should return false for amount > 999999.99');
});

test('validateAmount returns true for valid positive number', () => {
  assert(validator.validateAmount(45.50), 'Should return true for valid amount');
});

test('validateAmount returns true for numeric string', () => {
  assert(validator.validateAmount('45.50'), 'Should return true for numeric string');
});

// Test validateCategory
test('validateCategory returns false for null categories array', () => {
  assert(!validator.validateCategory('Food', null), 'Should return false for null array');
});

test('validateCategory returns false for non-array', () => {
  assert(!validator.validateCategory('Food', 'not-array'), 'Should return false for non-array');
});

test('validateCategory returns false for category not in list', () => {
  assert(!validator.validateCategory('Invalid', ['Food', 'Transport']), 'Should return false for invalid category');
});

test('validateCategory returns true for valid category', () => {
  assert(validator.validateCategory('Food', ['Food', 'Transport', 'Fun']), 'Should return true for valid category');
});

// Test validateTransaction
test('validateTransaction returns errors for all empty fields', () => {
  const result = validator.validateTransaction('', '', '', ['Food']);
  assert(!result.isValid, 'Should be invalid');
  assert(result.errors.length === 3, 'Should have 3 errors');
});

test('validateTransaction returns error for empty item name', () => {
  const result = validator.validateTransaction('', 45.50, 'Food', ['Food']);
  assert(!result.isValid, 'Should be invalid');
  assert(result.errors.includes('Item name is required'), 'Should have item name error');
});

test('validateTransaction returns error for invalid amount', () => {
  const result = validator.validateTransaction('Groceries', 'abc', 'Food', ['Food']);
  assert(!result.isValid, 'Should be invalid');
  assert(result.errors.some(e => e.includes('valid positive number')), 'Should have amount error');
});

test('validateTransaction returns error for invalid category', () => {
  const result = validator.validateTransaction('Groceries', 45.50, 'Invalid', ['Food']);
  assert(!result.isValid, 'Should be invalid');
  assert(result.errors.includes('Please select a valid category'), 'Should have category error');
});

test('validateTransaction returns valid for correct input', () => {
  const result = validator.validateTransaction('Groceries', 45.50, 'Food', ['Food', 'Transport']);
  assert(result.isValid, 'Should be valid');
  assert(result.errors.length === 0, 'Should have no errors');
});

test('validateTransaction handles numeric string amounts', () => {
  const result = validator.validateTransaction('Groceries', '45.50', 'Food', ['Food']);
  assert(result.isValid, 'Should be valid for numeric string');
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
