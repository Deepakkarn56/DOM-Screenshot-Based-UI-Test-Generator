// ─────────────────────────────────────────────
//  DOM + Screenshot UI Test Generator
//  Powered by Claude API (claude-sonnet-4)
// ─────────────────────────────────────────────

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

let uploadedImageBase64 = null;
let uploadedImageType = 'image/png';
let selectedTestType = 'form validation';

// ── Test type selector ──────────────────────
document.querySelectorAll('#test-types .type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#test-types .type-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedTestType = btn.dataset.val;
  });
});

// ── Image upload ────────────────────────────
document.getElementById('file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  uploadedImageType = file.type || 'image/png';

  const reader = new FileReader();
  reader.onload = (ev) => {
    uploadedImageBase64 = ev.target.result.split(',')[1];

    const preview = document.getElementById('preview-img');
    preview.src = ev.target.result;
    preview.style.display = 'block';

    const zone = document.getElementById('upload-zone');
    zone.classList.add('has-image');
    zone.querySelector('.upload-text').textContent = file.name;
    zone.querySelector('.upload-sub').textContent = `${(file.size / 1024).toFixed(0)} KB`;

    markStep(2);
  };
  reader.readAsDataURL(file);
});

// ── DOM input progress tracking ─────────────
document.getElementById('dom-input').addEventListener('input', () => {
  const val = document.getElementById('dom-input').value.trim();
  if (val.length > 20) markStep(1);
});

// ── Step marker ─────────────────────────────
function markStep(num) {
  document.getElementById(`step${num}`).classList.add('done');
}

// ── Main generate function ──────────────────
async function generateTests() {
  const domInput = document.getElementById('dom-input').value.trim();
  const extraContext = document.getElementById('extra-context').value.trim();

  if (!domInput) {
    showError('Please paste a DOM snippet first. Open DevTools, right-click an element, and choose "Copy > Copy outerHTML".');
    return;
  }

  const btn = document.getElementById('generate-btn');
  const outputCard = document.getElementById('output-card');
  const placeholder = document.getElementById('output-placeholder');
  const loadingBar = document.getElementById('loading-bar');
  const errorBox = document.getElementById('error-box');

  // UI: loading state
  btn.disabled = true;
  btn.textContent = '⏳ Generating...';
  errorBox.style.display = 'none';
  outputCard.style.display = 'block';
  placeholder.style.display = 'none';
  loadingBar.style.display = 'block';
  document.getElementById('output-code').textContent = '';

  try {
    // Build message content
    const userContent = [];

    if (uploadedImageBase64) {
      userContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: uploadedImageType,
          data: uploadedImageBase64
        }
      });
    }

    userContent.push({
      type: 'text',
      text: buildPrompt(domInput, extraContext)
    });

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        system: `You are a senior QA automation engineer specializing in Playwright (JavaScript).
Your job is to generate clean, production-ready Playwright test code.
Output ONLY valid JavaScript code — no markdown fences, no explanations, no preamble.
Start directly with the import statement.`,
        messages: [{ role: 'user', content: userContent }]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const rawCode = data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .replace(/```javascript\n?/gi, '')
      .replace(/```js\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim();

    document.getElementById('output-code').textContent = rawCode;
    loadingBar.style.display = 'none';
    markStep(3);

  } catch (err) {
    loadingBar.style.display = 'none';
    outputCard.style.display = 'none';
    placeholder.style.display = 'block';
    showError('Error: ' + err.message + '\n\nMake sure you are using this tool via the Claude.ai Artifacts feature where the API key is handled automatically.');
  } finally {
    btn.disabled = false;
    btn.textContent = '✨ Generate Playwright Tests';
  }
}

// ── Prompt builder ──────────────────────────
function buildPrompt(domInput, extraContext) {
  return `Analyze the provided DOM structure${uploadedImageBase64 ? ' and screenshot' : ''} and generate production-ready Playwright tests in JavaScript.

DOM Structure:
${domInput}

Test focus: ${selectedTestType}
${extraContext ? `Additional context: ${extraContext}` : ''}

Rules:
1. Use @playwright/test syntax with import at the top
2. Prefer getByRole(), getByLabel(), getByText() over CSS/XPath for resilience
3. Use CSS selectors only when semantic selectors are not available
4. Include positive tests (happy path) AND negative tests (error cases, edge cases)
5. Use descriptive test names inside test.describe() blocks
6. Add proper expect() assertions for every interaction
7. Keep tests independent — no shared state between tests
8. Add brief inline comments explaining test intent
9. Use async/await correctly throughout
10. Generate at least 4-6 meaningful test cases`;
}

// ── Copy code ────────────────────────────────
function copyCode() {
  const code = document.getElementById('output-code').textContent;
  if (!code) return;

  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = '✅ Copied!';
    btn.classList.add('copied');
    markStep(4);
    setTimeout(() => {
      btn.textContent = '📋 Copy';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    alert('Could not copy automatically. Please select the code and copy manually.');
  });
}

// ── Download code ────────────────────────────
function downloadCode() {
  const code = document.getElementById('output-code').textContent;
  if (!code) return;

  const blob = new Blob([code], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'generated.spec.js';
  a.click();
  URL.revokeObjectURL(url);
}

// ── Error display ────────────────────────────
function showError(msg) {
  const box = document.getElementById('error-box');
  box.textContent = msg;
  box.style.display = 'block';
}
