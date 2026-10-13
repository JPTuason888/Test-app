# Test App — Expense Tracker

A zero-dependency expense tracker. Log expenses against TRS, Trace, or AI Lab and see running totals in PHP. Data is stored in the browser (localStorage).

## Run

```sh
npm start        # serves at http://localhost:8000
```

## Test

```sh
npm test
```

## Deploy

Every push to `main` runs the tests and, if they pass, publishes the site to GitHub Pages via `.github/workflows/pages.yml`. Only `index.html` and `src/` are published.

Live at: https://jptuason888.github.io/Test-app/

## Layout

- `index.html` — page and styles
- `src/expenses.js` — pure logic (validation, totals, formatting)
- `src/app.js` — browser UI wiring
- `test/` — Node built-in test runner tests
