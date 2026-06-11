# DOM-Screenshot-Based-UI-Test-Generator
AI-powered tool that scans any webpage's DOM,  analyzes UI elements, and auto-generates  Playwright test code using Claude API.
# ⚡ DOM + Screenshot UI Test Generator

> An AI-powered tool that analyzes DOM structure and screenshots to automatically generate production-ready **Playwright test scripts** using the Claude API.

![Project Banner](https://img.shields.io/badge/Powered%20by-Claude%20API-purple?style=flat-square)
![Playwright](https://img.shields.io/badge/Output-Playwright%20JS-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)

---

## 🎯 What It Does

Traditional test writing is slow and fragile — selectors break, tests are repetitive, and junior QAs miss edge cases.

This tool solves that by:
- Accepting a **DOM snippet** (copied from browser DevTools)
- Optionally accepting a **page screenshot** for visual context
- Sending both to **Claude AI** with a smart QA-focused prompt
- Returning **ready-to-run Playwright test code** with resilient selectors and assertions

---

## 🚀 How It Works

```
User pastes DOM HTML
        ↓
(Optional) Upload page screenshot
        ↓
Select test focus (form, auth, navigation, etc.)
        ↓
Claude API analyzes DOM + screenshot
        ↓
Generates Playwright tests with:
  - getByRole / getByLabel / getByText selectors
  - Happy path + negative test cases
  - Proper expect() assertions
  - test.describe() grouping
        ↓
Copy or download the .spec.js file
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| AI Engine | Claude API (`claude-sonnet-4`) |
| Test Output | Playwright (JavaScript) |
| Vision Input | Base64 image via Claude Vision |

---

## 📁 Project Structure

```
dom-screenshot-ui-test-generator/
├── index.html      → Main UI layout
├── style.css       → Styling and responsive design
├── app.js          → Core logic, API calls, DOM handling
└── README.md       → Project documentation
```

---

## 💻 How to Run Locally

1. Clone this repo:
```bash
git clone https://github.com/Deepakkarn56/dom-screenshot-ui-test-generator.git
cd dom-screenshot-ui-test-generator
```

2. Open in browser:
```bash
# Simply open index.html in your browser
# OR use Live Server in VS Code
```

> **Note:** This tool uses the Claude API via the Claude.ai Artifacts environment where API access is handled automatically. To run standalone, you would need to add your own Anthropic API key in `app.js`.

---

## 📸 Example Usage

1. Open any webpage (e.g. SauceDemo login page)
2. Right-click the login form → Inspect → Copy outerHTML
3. Paste into the DOM input field
4. Optionally take a screenshot and upload it
5. Select "Auth flow" as test focus
6. Click **Generate Playwright Tests**
7. Copy the output → paste into your Playwright project as `login.spec.js`

---

## 🧪 Sample Output

```javascript
import { test, expect } from '@playwright/test';

test.describe('Login Form - Authentication Tests', () => {

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByLabel('Username').fill('standard_user');
    await page.getByLabel('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByLabel('Username').fill('wrong_user');
    await page.getByLabel('Password').fill('wrong_pass');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Username and password do not match')).toBeVisible();
  });

});
```

---

## 🔑 Key Features

- ✅ **AI-powered** — Claude understands context, not just syntax
- ✅ **Vision support** — Screenshot gives layout context for better selectors
- ✅ **Resilient selectors** — Prefers `getByRole`, `getByLabel` over fragile CSS
- ✅ **Negative tests** — Automatically covers error cases and edge cases
- ✅ **Download support** — Save output as `.spec.js` directly
- ✅ **Zero setup** — No Node.js required to run the generator itself

---

## 👨‍💻 Author

**Deepak Kumar** — QA Automation Engineer  
📂 [GitHub Portfolio](https://github.com/Deepakkarn56)

---

## 📄 License

MIT License — free to use and modify.
