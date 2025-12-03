# Vote D-21: Secure Two-Vote Solana Voting System

## 🌐 Live Demo

🚀 **Try it now**: [https://frontend-54kls5lho-serge92s-projects.vercel.app/](https://frontend-54kls5lho-serge92s-projects.vercel.app/)

**Network**: Solana Devnet  
**Program ID**: `7qsdAz3ta9gg3eikuzQuJMj928zFnPUB8C4rb42pr6RN`  
🔍 [View on Solana Explorer](https://explorer.solana.com/address/7qsdAz3ta9gg3eikuzQuJMj928zFnPUB8C4rb42pr6RN?cluster=devnet)

---

## 🎯 Project Description

**Vote D-21** is a secure Solana voting program built with Anchor framework that implements a two-vote system with 4 fixed candidates. Each voter can cast up to 2 votes for distinct candidates, with strong security guarantees following IH21 (Initiative for Honest 21) security and design guidelines.

### Key Features
- ✅ **Two-vote system**: Each voter can vote for exactly 2 different candidates
- ✅ **Four fixed candidates**: Alice, Bob, Charlie, and Diana
- ✅ **PDA-based accounts**: All accounts use Program Derived Addresses with deterministic seeds
- ✅ **Double-voting prevention**: Strict enforcement prevents voters from voting twice
- ✅ **Duplicate candidate prevention**: Cannot vote for the same candidate twice
- ✅ **Authority verification**: Only authorized signers can cast votes
- ✅ **Event emission**: All important actions emit events for transparency
- ✅ **Custom error codes**: Clear, actionable error messages

