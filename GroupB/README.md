# ERC20 Token Factory Platform

A web platform where anyone can deploy their own ERC20 token through a Factory Contract, test all its functions, and receive the deployed contract address — all without writing any code.

---

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router
- Solidity (^0.8.3)

---


## Getting Started (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/gharneeyart/GroupB-Frontend.git
cd groupb-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and update the following:

```env
VITE_FACTORY_CONTRACT_ADDRESS=0xYourFactoryAddressHere
VITE_RPC_URL=https://your-rpc-url-here
VITE_CHAIN_ID=11155111
```

### 4. Start the development server

```bash
npm run dev
```

The app will be running at `http://localhost:5173`


### 5.  Create a branch

Always create a new branch for your work. Never commit directly to `main`.

Use this naming convention for your branch:

```bash
# For a new feature
git checkout -b feat/your-feature-name

# For a bug fix
git checkout -b fix/what-you-are-fixing

# For documentation
git checkout -b docs/what-you-are-documenting
```

Examples:

```bash
git checkout -b feat/token-registry-table
git checkout -b fix/modal-close-on-backdrop
git checkout -b docs/update-setup-steps
```

### 6. Make your changes

Write your code, then stage and commit your changes:

```bash
git add .
git commit -m "feat: add token registry table with deploy date"
```

Follow this commit message format:

| Prefix | When to use |
|---|---|
| `feat:` | Adding a new feature |
| `fix:` | Fixing a bug |
| `docs:` | Documentation changes only |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructure, no feature change |
| `chore:` | Dependency updates, config changes |

### 7. Sync with main before pushing

Before pushing, make sure your branch is up to date with the latest `main`:

```bash
git pull origin main
```

Resolve any conflicts if they come up

### 8. Push your branch

```bash
git push origin feat/your-feature-name
```

### 9. Open a Pull Request

1. Go to the original repository on GitHub
2. Click **"Compare & pull request"**
3. Set the base branch to `main`
4. Fill in the PR template:
   - **What does this PR do?** — brief description
   - **How to test it?** — steps to reproduce or verify
   - **Screenshots** — if UI changes are involved
5. Request a review from a maintainer
6. Wait for approval before merging

---

## Branch Rules

- `main` — production-ready code only, protected
- `feat/*` — new features
- `fix/*` — bug fixes
- `docs/*` — documentation updates

Do not push directly to `main`. All changes go through a Pull Request.

---

## Project Structure

```
erc20-token-factory/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level pages
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Helper functions and validation
│   ├── constants/        # ABI, addresses, mock data
│   └── main.jsx          # App entry point
├── contracts/            # Solidity source files
├── public/
├── .env.example
├── index.html
└── README.md
```