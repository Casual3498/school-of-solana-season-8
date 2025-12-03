# Project Description

**Deployed Frontend URL:** https://frontend-54kls5lho-serge92s-projects.vercel.app/

**Solana Program ID:** 7qsdAz3ta9gg3eikuzQuJMj928zFnPUB8C4rb42pr6RN

## Project Overview

### Description
Vote D-21 is a secure decentralized voting application built on Solana that implements the D21 (Janeček method) two-vote system. Users can cast exactly two votes for distinct candidates from a pool of four fixed candidates (Alice, Bob, Charlie, and Diana). The dApp enforces strong security guarantees including duplicate candidate prevention, double-voting prevention, and authority verification. Each voter has a unique PDA-based account that tracks their voting status and choices, ensuring transparency and preventing manipulation.

### Key Features
- **Two-Vote System**: Each voter can cast exactly 2 votes for different candidates (D-21 voting method)
- **Four Fixed Candidates**: Alice, Bob, Charlie, and Diana
- **Duplicate Prevention**: Cannot vote for the same candidate twice
- **Double-Voting Prevention**: Each voter can only vote once
- **Authority Verification**: Only the account owner can vote with their voter account
- **Real-Time Results**: Live vote count updates displayed in the frontend
- **Event Emission**: All actions emit events for transparency and auditing
- **Modern UI**: Responsive design with Phantom wallet integration

### How to Use the dApp
1. **Connect Wallet** - Open the app and connect your Phantom wallet (set to Devnet)
2. **Get Devnet SOL** - Click the "🪂 Get SOL" button to request devnet tokens for transaction fees
3. **Initialize Voter Account** - Click "Initialize Voter Account" to create your PDA-based voter account on-chain
4. **Select Candidates** - Click on exactly 2 different candidates from the grid (Alice, Bob, Charlie, Diana)
5. **Cast Vote** - Click "Cast Your Vote" button and approve the transaction in Phantom
6. **View Results** - See real-time vote counts displayed on candidate cards, automatically refreshing every 10 seconds

## Program Architecture
Vote D-21 uses a robust architecture with two main account types (Candidate and Voter) and three core instructions. The program leverages Program Derived Addresses (PDAs) for deterministic account creation and implements comprehensive security checks to prevent voting fraud.

### PDA Usage
The program uses Program Derived Addresses for all on-chain accounts to ensure deterministic addresses and proper access control.

**PDAs Used:**
- **Candidate PDA**: Derived from seeds `["candidate", candidate_name_bytes]` - creates unique accounts for each of the 4 candidates (Alice, Bob, Charlie, Diana)
- **Voter PDA**: Derived from seeds `["voter", authority_pubkey]` - ensures each wallet has exactly one voter account that only they can control

### Program Instructions
**Instructions Implemented:**
- **initialize_candidate**: Creates a new candidate account with initial vote count of 0. Must provide unique candidate name. Seeds: `["candidate", name]`
- **initialize_voter**: Creates a voter account for a specific wallet authority with `voted = false`. Seeds: `["voter", authority]`
- **vote**: Accepts array of 2 candidate PDAs, validates authority, prevents duplicates, increments vote counts, marks voter as voted. Emits VoteCast event.

### Account Structure
```rust
// Candidate account storing vote data
#[account]
pub struct CandidateAccount {
    pub name: String,       // Candidate name (max 32 chars)
    pub votes: u64,         // Current vote count
    pub bump: u8,           // PDA bump seed
}
// Space: 8 + 36 + 8 + 1 = 53 bytes

// Voter account tracking voting status
#[account]
pub struct VoterAccount {
    pub authority: Pubkey,  // Wallet that owns this voter account
    pub voted: bool,        // Has this voter cast their votes?
    pub votes: [Pubkey; 2], // Array of 2 candidate PDAs voted for
    pub bump: u8,           // PDA bump seed
}
// Space: 8 + 32 + 1 + 64 + 1 = 106 bytes
```

## Testing

### Test Coverage
Comprehensive TypeScript test suite covering all instructions with both successful operations and error conditions. The tests validate security constraints, PDA derivation, vote counting, and access control.

**Happy Path Tests:**
- **Initialize Candidates**: Successfully creates all 4 candidate accounts (Alice, Bob, Charlie, Diana) with unique PDAs, verifying name, votes=0, and bump values
- **Initialize Voter**: Creates voter PDA for wallet authority, verifying authority pubkey, voted=false, and bump
- **Cast Vote**: Successfully votes for two distinct candidates (Alice and Charlie), verifies vote counts increment by 1, voter marked as voted, and vote choices stored correctly

**Unhappy Path Tests:**
- **Reinitialize Candidate**: Fails when attempting to initialize an already existing candidate (e.g., Alice twice) with "already in use" error
- **Reinitialize Voter**: Fails when trying to initialize a voter account that already exists
- **Duplicate Candidates**: Fails when attempting to vote for the same candidate twice (e.g., Bob and Bob) with custom DuplicateCandidates error
- **Double Voting**: Fails when a voter who has already voted tries to vote again with custom AlreadyVoted error
- **Unauthorized Access**: Fails when wallet tries to vote using another wallet's voter account with UnauthorizedAccess or seeds constraint error
- **Invalid Candidate Keys**: Fails when provided candidate keys in instruction don't match the actual accounts passed with custom InvalidCandidate error

### Running Tests
```bash
cd anchor_project
yarn install          # Install dependencies
anchor test           # Run full test suite on localnet
```

Test output includes detailed logging showing:
- Program ID and wallet addresses
- PDA derivation with candidate names and bump seeds
- Transaction signatures for all operations
- Before/after vote counts for verification
- Final vote tallies for all candidates

### Additional Notes for Evaluators

This project implements the D-21 (Janeček method) voting system on Solana, which I found fascinating as it encourages more nuanced voting compared to single-choice systems. The biggest technical challenges were:

1. **PDA Design**: Initially struggled with seed derivation, especially coordinating between the vote instruction's candidate_keys parameter and the actual candidate accounts. The solution was to use candidate names as seeds and validate that the passed keys match the accounts.

2. **Security Constraints**: Implementing proper authorization checks was tricky. The voter PDA must be derived from the signer's pubkey, and the vote instruction validates that the authority matches. I also added checks to prevent duplicate candidates and ensure candidate keys match the accounts.

3. **Frontend Integration**: Getting Anchor's TypeScript client to work properly with Next.js 15 and React 19 required careful configuration. The challenge was handling async state updates and ensuring PDAs were derived consistently between frontend and program.

4. **Testing Methodology**: Writing comprehensive tests taught me to think like an attacker - every negative test represents a potential exploit. The test suite covers not just happy paths but also authorization bypasses, duplicate voting attempts, and account mismatch attacks.

The event emission system was added for transparency, allowing frontends to listen for VoteCast and CandidateInitialized events. The program uses checked arithmetic to prevent overflow attacks, though with u64 vote counts this is mostly theoretical.

Overall, this project demonstrates PDA-based access control, instruction validation, comprehensive error handling, and production-ready Solana program development practices.
