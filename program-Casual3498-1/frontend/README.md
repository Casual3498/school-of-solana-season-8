# Vote D-21 Frontend

## 🌐 Live Application

🚀 **Try it now**: [https://frontend-54kls5lho-serge92s-projects.vercel.app/](https://frontend-54kls5lho-serge92s-projects.vercel.app/)

**Deployed on**: Vercel  
**Network**: Solana Devnet  
**Status**: ✅ Live

---

Modern, responsive frontend for the Vote D-21 Solana voting dApp built with Next.js 15, React 19, and Tailwind CSS.

## 🚀 Features

- ✅ **Phantom Wallet Integration** - Seamless wallet connection
- ✅ **Real-time Updates** - Automatic vote count refresh
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Modern UI** - Beautiful gradient backgrounds and animations
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Dark Mode Ready** - Supports system dark mode preference

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Phantom Wallet browser extension
- Running Solana localnet or devnet with deployed Vote D-21 program

## 🛠️ Installation

```bash
cd /home/serge/program-Casual3498-1/frontend
npm install
```

## 🔧 Configuration

The app is configured to connect to **Solana Devnet** by default. To change the network, edit `components/WalletProvider.tsx`:

```typescript
const network = WalletAdapterNetwork.Devnet; // or Testnet, Mainnet-Beta
```

## 🏃 Running the App

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── WalletProvider.tsx  # Wallet adapter provider
│   ├── VotingInterface.tsx # Main voting UI
│   └── CandidateCard.tsx   # Candidate display card
├── contexts/
│   └── VoteContext.tsx     # Vote state management
├── types/
│   └── vote_d_21.ts        # TypeScript types
├── utils/
│   └── anchor.ts           # Anchor program utilities
├── idl/
│   └── vote_d_21.json      # Program IDL
└── next.config.ts          # Next.js configuration
```

## 🎨 UI Components

### VotingInterface
Main component that handles:
- Wallet connection status
- Voter account initialization
- Candidate selection (max 2)
- Vote submission
- Real-time results display

### CandidateCard
Displays candidate information:
- Name with avatar
- Current vote count
- Selection state with animations
- Hover effects

### WalletProvider
Configures Solana wallet adapter with:
- Phantom wallet support
- Auto-connect functionality
- Network configuration

## 🔄 Vote Flow

1. **Connect Wallet**
   - User clicks "Select Wallet" and connects Phantom

2. **Initialize Voter Account** (first time only)
   - Click "Initialize Voter Account"
   - Approve transaction in Phantom
   - Account created on-chain

3. **Select Candidates**
   - Click on 2 different candidates
   - Selection highlighted with purple border

4. **Cast Vote**
   - Click "Cast Your Vote" button
   - Approve transaction in Phantom
   - Vote recorded on-chain

5. **View Results**
   - Real-time vote counts displayed
   - Auto-refreshes every 10 seconds

## 🎯 Key Features Explained

### Wallet Integration
```typescript
// Uses Solana Wallet Adapter
import { useWallet } from '@solana/wallet-adapter-react';

const { connected, publicKey } = useWallet();
```

### Program Interaction
```typescript
// Anchor program integration
const program = getProgram(connection, wallet);
const tx = await program.methods
  .vote([candidate1PDA, candidate2PDA])
  .accounts({ ... })
  .rpc();
```

### State Management
```typescript
// React Context for global state
const { candidates, voterAccount, vote } = useVote();
```

## 🛡️ Security Features

- ✅ **Wallet Authentication** - Only connected wallet can vote
- ✅ **Transaction Signing** - All transactions require user approval
- ✅ **Duplicate Prevention** - Cannot select same candidate twice
- ✅ **Double Voting Prevention** - Enforced by smart contract
- ✅ **PDA Validation** - All accounts verified on-chain

## 🎨 Styling

Built with **Tailwind CSS** featuring:
- Gradient backgrounds
- Smooth animations
- Responsive grid layouts
- Dark mode support
- Custom color palette (purple/pink theme)

## 📱 Responsive Design

- **Mobile**: Single column layout
- **Tablet**: 2-column grid
- **Desktop**: 4-column grid
- Touch-friendly buttons and cards

## 🐛 Troubleshooting

### Wallet Not Connecting
1. Ensure Phantom is installed
2. Check if you're on the correct network
3. Try refreshing the page

### Transaction Failing
1. Ensure you have SOL for transaction fees
2. Check if voter account is initialized
3. Verify program is deployed on the network

### Candidates Not Loading
1. Check if program is deployed
2. Verify candidates are initialized on-chain
3. Check browser console for errors

## 🔗 Dependencies

### Core
- Next.js 15
- React 19
- TypeScript 5

### Solana
- @solana/web3.js
- @coral-xyz/anchor
- @solana/wallet-adapter-react
- @solana/wallet-adapter-wallets

### UI
- Tailwind CSS
- @solana/wallet-adapter-react-ui

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Cloudflare Pages

## 🎯 TODO / Future Enhancements

- [ ] Add vote delegation feature
- [ ] Implement time-bounded voting
- [ ] Add vote history view
- [ ] Show transaction explorer links
- [ ] Add confetti animation on successful vote
- [ ] Implement vote weight visualization
- [ ] Add candidate profiles/descriptions
- [ ] Multi-language support

## 📄 License

ISC

---

**Built with ❤️ on Solana**
