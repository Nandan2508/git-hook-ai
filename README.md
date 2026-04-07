#  git-hook-ai

> AI-powered Git pre-commit hook that detects security vulnerabilities and logic bugs in your code diffs — **97.4% F1 Score, zero false positives**

---

## How it works

Every time you run `git commit`, the hook:

1. Extracts the staged diff for all JS/TS/JSX/TSX files
2. Sends it to **LLaMA 3.3 70B** via Groq API
3. Parses the response and either **blocks** the commit (CRITICAL) or **warns** you (WARNING)



IMG




---

## Detected vulnerability classes

| # | Type | Severity |
|---|------|----------|
| 1 | Hardcoded secrets / API keys | CRITICAL |
| 2 | SQL Injection (including ORM raw queries) | CRITICAL |
| 3 | Path Traversal | CRITICAL |
| 4 | Auth Bypass | CRITICAL |
| 5 | RCE via exec/eval | CRITICAL |
| 6 | SSRF | CRITICAL |
| 7 | Mass Assignment | CRITICAL |
| 8 | Insecure token comparison | CRITICAL |
| 9 | Off-by-one errors | WARNING |
| 10 | Unhandled promise rejections | WARNING |

---

## Benchmark results

Evaluated on **56 test cases** — hand-crafted + real-world samples from OWASP Juice Shop and DVNA.

| Metric | Score |
|--------|-------|
| **F1 Score** | **97.4%** |
| **Precision** | **100%** |
| **Recall** | **95%** |
| Accuracy | 96.4% |
| False Positive Rate | 0% |
| Avg Latency | ~500ms |

---

## Installation

### Prerequisites
- Node.js 18+
- Git repository
- Free Groq API key — [console.groq.com](https://console.groq.com)

### Steps
```bash
# 1. Clone this repo anywhere on your machine
git clone https://github.com/Nandan2508/git-hook-ai.git
cd git-hook-ai

# 2. Install dependencies
npm install

# 3. Add your Groq API key
cp .env.example .env
# edit .env and add your GROQ_API_KEY

# 4. Install the hook into your target project
cd /path/to/your/project
bash /path/to/git-hook-ai/install.sh
```

### Uninstall
```bash
rm .git/hooks/pre-commit
```

### Skip once
```bash
git commit --no-verify
```

---

## Project structure


<img width="568" height="523" alt="image" src="https://github.com/user-attachments/assets/1d64bc5b-2b60-4573-811b-b8c939885427" />

---

## Known limitations

- **JavaScript / TypeScript only** — Python, Java, Go not yet supported
- **JWT algorithm confusion** and **ReDoS** patterns are not detected — require deep static analysis beyond LLM capability
- **Context-blind** — analyzes per-file diffs only, cannot detect vulnerabilities that span multiple files
- **Groq free tier** — 100k tokens/day limit; sufficient for normal usage (~125 commits/day)
- **Non-deterministic** — temperature 0 minimizes variance but does not eliminate it

---

## Tech stack

- **Runtime** — Node.js
- **LLM** — LLaMA 3.3 70B via Groq REST API
- **Prompt Engineering** — structured multi-class prompt with explicit false-positive suppression
- **Shell** — pre-commit hook via bash

---

## License

MIT
