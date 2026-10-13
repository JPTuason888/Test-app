import { ENTITIES, createExpense, totalsByEntity, grandTotal, formatPHP, toCSV } from "./expenses.js";

const STORAGE_KEY = "expense-tracker:v1";
const form = document.querySelector("#expense-form");
const error = document.querySelector("#error");
const list = document.querySelector("#list");
const totals = document.querySelector("#totals");

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function save(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // Storage unavailable (private mode etc.) — app still works for this session.
  }
}

let expenses = load();

function render() {
  const byEntity = totalsByEntity(expenses);
  totals.innerHTML = [
    ...ENTITIES.map((e) => `<div class="tile"><span>${e}</span><strong>${formatPHP(byEntity[e])}</strong></div>`),
    `<div class="tile total"><span>Total</span><strong>${formatPHP(grandTotal(expenses))}</strong></div>`,
  ].join("");

  list.replaceChildren(
    ...expenses.map((x) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="date"></span><span class="desc"></span><span class="tag"></span><span class="amt"></span><button aria-label="Delete">×</button>`;
      li.querySelector(".date").textContent = x.date;
      li.querySelector(".desc").textContent = x.description;
      li.querySelector(".tag").textContent = x.entity;
      li.querySelector(".amt").textContent = formatPHP(x.amount);
      li.querySelector("button").addEventListener("click", () => {
        expenses = expenses.filter((y) => y.id !== x.id);
        save(expenses);
        render();
      });
      return li;
    })
  );
  if (!expenses.length) list.innerHTML = `<li class="empty">No expenses yet.</li>`;
  exportButton.disabled = !expenses.length;
}

const exportButton = document.querySelector("#export");
exportButton.addEventListener("click", () => {
  // BOM so Excel opens the file as UTF-8 (accented names stay intact).
  const blob = new Blob(["﻿" + toCSV(expenses)], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  try {
    expenses = [createExpense(data), ...expenses];
    save(expenses);
    form.reset();
    error.textContent = "";
    render();
  } catch (err) {
    error.textContent = err.message;
  }
});

render();
