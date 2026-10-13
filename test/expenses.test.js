import { test } from "node:test";
import assert from "node:assert/strict";
import { createExpense, totalsByEntity, grandTotal, toCSV } from "../src/expenses.js";

test("createExpense validates and normalizes input", () => {
  const x = createExpense({ description: "  Fuel  ", amount: "1234.567", entity: "TRS", date: "2026-10-13" });
  assert.equal(x.description, "Fuel");
  assert.equal(x.amount, 1234.57);
  assert.equal(x.entity, "TRS");
  assert.equal(x.date, "2026-10-13");
});

test("createExpense rejects bad input", () => {
  assert.throws(() => createExpense({ description: "", amount: 10, entity: "TRS" }), /Description/);
  assert.throws(() => createExpense({ description: "x", amount: 0, entity: "TRS" }), /Amount/);
  assert.throws(() => createExpense({ description: "x", amount: "abc", entity: "TRS" }), /Amount/);
  assert.throws(() => createExpense({ description: "x", amount: 5, entity: "Other" }), /Entity/);
});

test("createExpense defaults date to today", () => {
  const x = createExpense({ description: "x", amount: 1, entity: "Trace" });
  assert.match(x.date, /^\d{4}-\d{2}-\d{2}$/);
});

test("totals per entity and overall", () => {
  const list = [
    { entity: "TRS", amount: 0.1 },
    { entity: "TRS", amount: 0.2 },
    { entity: "AI Lab", amount: 500 },
  ];
  assert.deepEqual(totalsByEntity(list), { TRS: 0.3, Trace: 0, "AI Lab": 500 });
  assert.equal(grandTotal(list), 500.3);
});

test("toCSV writes a header, escapes text, and neutralizes formulas", () => {
  const csv = toCSV([
    { date: "2026-10-13", description: 'Tires, "soft"', entity: "TRS", amount: 4500 },
    { date: "2026-10-14", description: "=HYPERLINK(1)", entity: "AI Lab", amount: 12.5 },
  ]);
  assert.equal(
    csv,
    'Date,Description,Entity,Amount (PHP)\r\n' +
      '2026-10-13,"Tires, ""soft""",TRS,4500.00\r\n' +
      "2026-10-14,'=HYPERLINK(1),AI Lab,12.50\r\n"
  );
});
