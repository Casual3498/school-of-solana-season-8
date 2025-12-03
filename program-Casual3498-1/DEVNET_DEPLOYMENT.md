# Vote D-21 - Devnet Deployment

## 🌐 Live Application

🚀 **Frontend**: [https://frontend-54kls5lho-serge92s-projects.vercel.app/](https://frontend-54kls5lho-serge92s-projects.vercel.app/)

**Status**: ✅ Live on Vercel  
**Network**: Solana Devnet

---

## 🚀 Deployment Information

### Program Details
- **Program ID**: `7qsdAz3ta9gg3eikuzQuJMj928zFnPUB8C4rb42pr6RN`
- **Network**: Solana Devnet
- **Deployed**: November 26, 2025
- **Authority**: `brGP1hzM7qTvNv9ftEfaNCCUWZTaBMsoUg8AZmHcuQp`

### Solana Explorer Links

#### Program
🔗 [View Program on Solana Explorer](https://explorer.solana.com/address/7qsdAz3ta9gg3eikuzQuJMj928zFnPUB8C4rb42pr6RN?cluster=devnet)

#### Initialized Candidates

1. **Alice**
   - PDA: `GXEdHrfvD2CD4hWxDHEskdCmTWqdTDPzFbwDcyRaYDhH`
   - 🔗 [View on Explorer](https://explorer.solana.com/address/GXEdHrfvD2CD4hWxDHEskdCmTWqdTDPzFbwDcyRaYDhH?cluster=devnet)
   - ✅ Transaction: `PKeKXhnZKBztetn9RMPJ5gd9Tiu1ZXY3o1aSJcivKxsXrb6rX4LvCMuPmyax2jnMyNPtzaan2JUsJ8pjyZyv12E`

2. **Bob**
   - PDA: `Gf7CzByoNPJbtqqSyim6yFVma13jE3UGLaM19FY7w8D9`
   - 🔗 [View on Explorer](https://explorer.solana.com/address/Gf7CzByoNPJbtqqSyim6yFVma13jE3UGLaM19FY7w8D9?cluster=devnet)
   - ✅ Transaction: `3DnaGBQTxyfCtfomLs2ycbXnHQyQbqZ7zCm8FWrfDVf5RaaVi6hxdhJ2tUcD5iFRLMGDBAg1rjKtMn7GuNqyig2d`

3. **Charlie**
   - PDA: `Ebki35ukqxKby3p3LD7NmhcTq383oCBg6taTL28Ag6La`
   - 🔗 [View on Explorer](https://explorer.solana.com/address/Ebki35ukqxKby3p3LD7NmhcTq383oCBg6taTL28Ag6La?cluster=devnet)
   - ✅ Transaction: `2ygYLpBro6mirY6JHrV3vPujJJyczwmPUE8UUSMrVHdS1bYEjBrkLBjfJDrGbNx9ok9WEBsn7Gv78ohcbpnaTDdj`

4. **Diana**
   - PDA: `GSgnjKu6CMuaiUUUMurQv3YfZv86XAfqFR9EHevfbxKs`
   - 🔗 [View on Explorer](https://explorer.solana.com/address/GSgnjKu6CMuaiUUUMurQv3YfZv86XAfqFR9EHevfbxKs?cluster=devnet)
   - ✅ Transaction: `4GteLPuNjMHfU2BymCuUAQTtFkhLB1er68UYjmJtA5xdwPseb9L9bDRW7y5DLKpCVXH5iA1wxmAA1oykBejmsvoJ`

---

## 📱 Frontend Configuration

The frontend is now configured to connect to **Devnet**.

### Testing the dApp

1. **Open the frontend**: http://localhost:3000
2. **Configure Phantom Wallet**:
   - Open Phantom
   - Go to Settings → Change Network
   - Select **Devnet**
3. **Get Devnet SOL**:
   - Use the built-in "🪂 Get SOL" button in the UI
   - Or request from: https://faucet.solana.com/
4. **Initialize your voter account**
5. **Vote for 2 candidates**

---

## 🔧 Commands

### Deploy to Devnet
```bash
cd anchor_project
anchor deploy --provider.cluster devnet
```

### Initialize Candidates
```bash
cd anchor_project
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=$HOME/.config/solana/id.json \
npx tsx scripts/initialize-candidates.ts
```

### Check Program
```bash
solana program show 7qsdAz3ta9gg3eikuzQuJMj928zFnPUB8C4rb42pr6RN --url devnet
```

### Check Balance
```bash
solana balance --url devnet
```

### Get Devnet SOL
```bash
solana airdrop 2 --url devnet
```

---

## 🎯 What's Next?

- ✅ Program deployed to devnet
- ✅ All 4 candidates initialized
- ✅ Frontend configured for devnet
- 🔄 Ready for public testing!

Share your frontend URL with others to let them test voting on devnet!

---

## 📊 Program Stats

- **Size**: 257,272 bytes (251 KB)
- **Rent**: 1.79 SOL
- **Cluster**: Devnet
- **Upgradeable**: Yes
- **Authority**: Your wallet

---

## 🛡️ Security Features

- ✅ Two-vote system (D-21)
- ✅ Duplicate candidate prevention
- ✅ Double-voting prevention
- ✅ PDA-based accounts
- ✅ Authority verification
- ✅ Event emission for transparency

---

**Deployed by**: Anchor Framework  
**Build Date**: November 26, 2025  
**Network**: Solana Devnet

