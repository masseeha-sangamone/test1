/**
 * Unit Test Suite for Dubai School Admission Quiz App
 * Verifies core logic constraints, edge cases, boundary conditions, and sanitization.
 */

const assert = require("assert");
const app = require("./app.js");

console.log("=== RUNNING DUBAI SCHOOL ADMISSION QUIZ TEST SUITE ===\n");

function run_test(name, fn) {
    try {
        fn();
        console.log(`[PASS] ${name}`);
    } catch (err) {
        console.error(`[FAIL] ${name}`);
        console.error(err);
        process.exit(1);
    }
}

// Test Case 1: Question 2 Non-Negative Subtraction Constraint
run_test("Constraint Check: Q2 generated numbers must always satisfy Num1 >= Num2", () => {
    for (let i = 0; i < 1000; i++) {
        app.generate_questions();
        const q2 = app.get_q2_nums();
        assert.ok(q2[0] >= q2[1], `Failed constraint: ${q2[0]} - ${q2[1]} would result in a negative number`);
    }
});

// Test Case 2: Boundary Values (Subtract to exactly 0, multiply by 0)
run_test("Boundary Values: Verify subtraction to 0 and multiplication by 0", () => {
    // Force specific numbers for subtraction to 0
    app.set_q1_nums([3, 5]);
    app.set_q2_nums([7, 7]); // A - B = 0
    app.set_q3_nums([6, 0]); // A * B = 0
    
    // Evaluate with correct answers (8, 0, 0)
    assert.strictEqual(app.evaluate_results(8, 0, 0), true, "Should pass with correct results including zeros");
    
    // Check failure with incorrect values
    assert.strictEqual(app.evaluate_results(8, 0, 1), false, "Should fail with wrong answers");
});

// Test Case 3: Empty/Null/Undefined Inputs
run_test("Empty Inputs: Blank inputs must default to incorrect and NOT crash", () => {
    app.set_q1_nums([2, 2]);
    app.set_q2_nums([4, 1]);
    app.set_q3_nums([3, 3]);
    
    // Test empty strings
    assert.strictEqual(app.evaluate_results("", 3, 9), false, "Should fail with empty first answer");
    assert.strictEqual(app.evaluate_results(4, "", 9), false, "Should fail with empty second answer");
    assert.strictEqual(app.evaluate_results(4, 3, ""), false, "Should fail with empty third answer");
    
    // Test null/undefined values
    assert.strictEqual(app.evaluate_results(null, 3, 9), false, "Should fail with null value");
    assert.strictEqual(app.evaluate_results(4, undefined, 9), false, "Should fail with undefined value");
});

// Test Case 4: Non-Numeric Inputs
run_test("Non-Numeric Inputs: Safe handling of invalid strings (e.g. letters)", () => {
    app.set_q1_nums([1, 1]);
    app.set_q2_nums([2, 1]);
    app.set_q3_nums([2, 2]);
    
    // Test string containing letters
    assert.strictEqual(app.evaluate_results("2a", 1, 4), false, "Should fail with invalid string characters");
    assert.strictEqual(app.evaluate_results("2", "abc", 4), false, "Should fail with alphabetic answer");
    assert.strictEqual(app.evaluate_results("2", 1, "four"), false, "Should fail with word-written number");
});

console.log("\n=== ALL TESTS PASSED SUCCESSFULLY! ===");
