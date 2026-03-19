# Multisig Wallet Frontend 🏦

Hey there! Welcome to our Multisig Wallet project. If you're new to coding and wondering what this is all about, think of it as a super secure digital piggy bank that needs multiple people to agree before spending any money. Like how some families need both parents to sign off on big purchases!

## What's This Project About? 🤔

This is the **frontend** part of a multisig (multi-signature) wallet system. The backend is a smart contract on the blockchain, but this frontend is what users see and interact with. It's built with modern web technologies to make managing shared funds safe and easy.

Imagine you and your friends want to save up for a group trip. Instead of trusting one person with all the money, you use this wallet where everyone has to approve big expenses. That's multisig in action!

## Cool Features ✨

- **Dashboard**: See all your transactions and wallet status at a glance
- **Create Transactions**: Propose new spending with details like who gets the money and how much
- **Approve Transactions**: Give your thumbs up (or down) to pending requests
- **Settings Page**: Change who can sign transactions or transfer ownership
- **Real-time Updates**: Everything updates automatically as things happen
- **Mobile Friendly**: Works great on phones and tablets too

## Tech Stack 🛠️

We're using some awesome modern tools:

- **React** - The main framework for building the user interface
- **TypeScript** - Adds superpowers to JavaScript for catching bugs early
- **Vite** - Makes development fast and building quick
- **Tailwind CSS** - For making everything look pretty and responsive
- **shadcn/ui** - Pre-built components that look professional
- **React Router** - For navigating between different pages
- **Sonner** - For those nice notification popups

## Getting Started 🚀

Ready to try it out? Here's how to get it running on your computer:

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd multisigFR/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Go to `http://localhost:8081` (or whatever port it shows)

That's it! The app should be running locally.

## How to Use It 📱

### Dashboard
- View all transactions (pending, approved, completed)
- See wallet balance and signer information
- Filter transactions by status

### Creating a Transaction
1. Click the "Create Transaction" button
2. Enter the recipient's address
3. Put in the amount
4. Submit - now it needs approvals!

### Approving Transactions
- Look for pending transactions that need your approval
- Click to approve if you agree
- Once enough people approve, the transaction executes automatically

### Settings
- Change signer addresses (replace team members)
- Transfer ownership to someone else
- Only the current owner can make these changes

## Project Structure 📁

Let me walk you through what's in each folder:

```
multisigFR/
├── contract_files/          # The smart contract (blockchain code)
│   └── MultiSig.sol        # Solidity contract for multisig logic
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI pieces
│   │   │   ├── ui/         # Basic components (buttons, forms, etc.)
│   │   │   └── [feature]/  # Feature-specific components
│   │   ├── pages/          # Main app pages (Dashboard, Settings)
│   │   ├── lib/            # Helper functions and utilities
│   │   │   ├── contract.ts # Functions to talk to blockchain
│   │   │   ├── mock-data.ts# Fake data for development
│   │   │   └── utils.ts    # General helper functions
│   │   └── hooks/          # Custom React hooks
│   ├── public/             # Static files (images, icons)
│   └── [config files]      # Build and development configs
```

## Key Files to Know 🔍

- **`Settings.tsx`** - The page where you change signers and owners
- **`contract.ts`** - Contains functions like `changeSigner()` and `changeOwner()`
- **`MultiSig.sol`** - The smart contract that handles all the blockchain logic
- **`mock-data.ts`** - Fake data so you can test without real blockchain

## Testing 🧪

We have tests to make sure everything works correctly:

```bash
npm run test          # Run all tests
npm run test:watch    # Run tests and watch for changes
```

## Building for Production 🏗️

When you're ready to share your app:

```bash
npm run build         # Create optimized production build
npm run preview       # Test the production build locally
```

## Contributing 🤝

Want to help make this better? Awesome! Here's how:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Test everything works
5. Submit a pull request

Even small improvements like better error messages or new features are welcome!

## Learning Resources 📚

If you're new to this stuff, here are some friendly places to learn:

- **React**: Start with the official tutorial
- **Blockchain**: Check out Ethereum documentation
- **TypeScript**: The handbook is great for beginners
- **Smart Contracts**: Solidity docs for the backend part

## Common Questions ❓

**Q: What's the difference between signers and owners?**
A: Signers can approve transactions. The owner can add/remove signers and change ownership.

**Q: How many approvals do I need?**
A: It depends on your threshold setting. Usually it's set to majority or 2/3 of signers.

**Q: Is this on a real blockchain?**
A: Right now it's using mock data for development. To go live, you'd deploy the smart contract and connect to a real network.

## License 📄

This project is open source and available under the MIT License. Feel free to use it for your own projects!

---

Built with ❤️ for making crypto safer and more collaborative. Happy coding! 🚀