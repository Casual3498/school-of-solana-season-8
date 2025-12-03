import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VoteD21 } from "../target/types/vote_d_21";
import { expect } from "chai";

describe("vote_d_21", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.VoteD21 as Program<VoteD21>;
  const wallet = provider.wallet as anchor.Wallet;

  // Candidate names
  const candidates = ["Alice", "Bob", "Charlie", "Diana"];
  const candidatePDAs: { name: string; pda: anchor.web3.PublicKey; bump: number }[] = [];

  // Voter PDA
  let voterPDA: anchor.web3.PublicKey;
  let voterBump: number;

  // Unauthorized wallet for negative tests
  const unauthorizedWallet = anchor.web3.Keypair.generate();

  before(async () => {
    console.log("\n========== SETUP ==========");
    console.log("Program ID:", program.programId.toBase58());
    console.log("Wallet:", wallet.publicKey.toBase58());
    console.log("Unauthorized Wallet:", unauthorizedWallet.publicKey.toBase58());
    
    // Airdrop to unauthorized wallet for testing
    const airdropSig = await provider.connection.requestAirdrop(
      unauthorizedWallet.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig);
  });

  describe("1. Initialize Candidates", () => {
    it("Should initialize all 4 candidates using PDAs", async () => {
      console.log("\n--- Initializing Candidates ---");
      
      for (const name of candidates) {
        const [candidatePDA, bump] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("candidate"), Buffer.from(name)],
          program.programId
        );

        console.log(`\nCandidate: ${name}`);
        console.log(`  PDA: ${candidatePDA.toBase58()}`);
        console.log(`  Bump: ${bump}`);

        const tx = await program.methods
          .initializeCandidate(name)
          .accounts({
            candidate: candidatePDA,
            payer: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        console.log(`  TX Signature: ${tx}`);

        // Verify candidate account
        const candidateAccount = await program.account.candidateAccount.fetch(candidatePDA);
        expect(candidateAccount.name).to.equal(name);
        expect(candidateAccount.votes.toNumber()).to.equal(0);
        expect(candidateAccount.bump).to.equal(bump);

        candidatePDAs.push({ name, pda: candidatePDA, bump });
      }

      expect(candidatePDAs.length).to.equal(4);
    });

    it("Should fail to reinitialize an existing candidate", async () => {
      const name = "Alice";
      const [candidatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("candidate"), Buffer.from(name)],
        program.programId
      );

      try {
        await program.methods
          .initializeCandidate(name)
          .accounts({
            candidate: candidatePDA,
            payer: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        
        expect.fail("Should have thrown an error for reinitialization");
      } catch (err) {
        // Anchor will throw an error that the account already exists
        expect(err.toString()).to.include("already in use");
      }
    });
  });

  describe("2. Initialize Voter", () => {
    it("Should initialize voter PDA for wallet authority", async () => {
      console.log("\n--- Initializing Voter ---");

      [voterPDA, voterBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("voter"), wallet.publicKey.toBuffer()],
        program.programId
      );

      console.log(`Voter PDA: ${voterPDA.toBase58()}`);
      console.log(`Voter Bump: ${voterBump}`);

      const tx = await program.methods
        .initializeVoter()
        .accounts({
          voter: voterPDA,
          authority: wallet.publicKey,
          payer: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log(`TX Signature: ${tx}`);

      // Verify voter account
      const voterAccount = await program.account.voterAccount.fetch(voterPDA);
      expect(voterAccount.authority.toBase58()).to.equal(wallet.publicKey.toBase58());
      expect(voterAccount.voted).to.be.false;
      expect(voterAccount.bump).to.equal(voterBump);
    });

    it("Should fail to reinitialize an existing voter", async () => {
      try {
        await program.methods
          .initializeVoter()
          .accounts({
            voter: voterPDA,
            authority: wallet.publicKey,
            payer: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        
        expect.fail("Should have thrown an error for reinitialization");
      } catch (err) {
        expect(err.toString()).to.include("already in use");
      }
    });
  });

  describe("3. Cast Vote (Happy Path)", () => {
    it("Should successfully cast votes for two distinct candidates (Alice and Charlie)", async () => {
      console.log("\n--- Casting Votes ---");

      const alice = candidatePDAs.find(c => c.name === "Alice");
      const charlie = candidatePDAs.find(c => c.name === "Charlie");

      console.log(`Voting for: ${alice.name} (${alice.pda.toBase58()})`);
      console.log(`Voting for: ${charlie.name} (${charlie.pda.toBase58()})`);

      // Get initial vote counts
      const aliceAccountBefore = await program.account.candidateAccount.fetch(alice.pda);
      const charlieAccountBefore = await program.account.candidateAccount.fetch(charlie.pda);

      console.log(`Alice votes before: ${aliceAccountBefore.votes.toNumber()}`);
      console.log(`Charlie votes before: ${charlieAccountBefore.votes.toNumber()}`);

      const tx = await program.methods
        .vote([alice.pda, charlie.pda])
        .accounts({
          voter: voterPDA,
          candidate1: alice.pda,
          candidate2: charlie.pda,
          authority: wallet.publicKey,
        })
        .rpc();

      console.log(`TX Signature: ${tx}`);

      // Verify vote counts incremented
      const aliceAccountAfter = await program.account.candidateAccount.fetch(alice.pda);
      const charlieAccountAfter = await program.account.candidateAccount.fetch(charlie.pda);

      console.log(`Alice votes after: ${aliceAccountAfter.votes.toNumber()}`);
      console.log(`Charlie votes after: ${charlieAccountAfter.votes.toNumber()}`);

      expect(aliceAccountAfter.votes.toNumber()).to.equal(
        aliceAccountBefore.votes.toNumber() + 1
      );
      expect(charlieAccountAfter.votes.toNumber()).to.equal(
        charlieAccountBefore.votes.toNumber() + 1
      );

      // Verify voter marked as voted
      const voterAccount = await program.account.voterAccount.fetch(voterPDA);
      expect(voterAccount.voted).to.be.true;
      expect(voterAccount.votes[0].toBase58()).to.equal(alice.pda.toBase58());
      expect(voterAccount.votes[1].toBase58()).to.equal(charlie.pda.toBase58());
    });
  });

  describe("4. Negative Tests", () => {
    it("Should fail when trying to vote for duplicate candidates", async () => {
      console.log("\n--- Testing Duplicate Candidate Rejection ---");

      // Create a new voter for this test
      const newVoter = anchor.web3.Keypair.generate();
      
      // Airdrop SOL to new voter
      const airdropSig = await provider.connection.requestAirdrop(
        newVoter.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig);

      // Initialize new voter
      const [newVoterPDA, newVoterBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("voter"), newVoter.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .initializeVoter()
        .accounts({
          voter: newVoterPDA,
          authority: newVoter.publicKey,
          payer: newVoter.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([newVoter])
        .rpc();

      // Try to vote for same candidate twice
      const bob = candidatePDAs.find(c => c.name === "Bob");

      try {
        await program.methods
          .vote([bob.pda, bob.pda])
          .accounts({
            voter: newVoterPDA,
            candidate1: bob.pda,
            candidate2: bob.pda,
            authority: newVoter.publicKey,
          })
          .signers([newVoter])
          .rpc();
        
        expect.fail("Should have thrown DuplicateCandidates error");
      } catch (err) {
        expect(err.toString()).to.include("DuplicateCandidates");
        console.log("✓ Correctly rejected duplicate candidates");
      }
    });

    it("Should fail when voter tries to vote twice", async () => {
      console.log("\n--- Testing Double Voting Prevention ---");

      const bob = candidatePDAs.find(c => c.name === "Bob");
      const diana = candidatePDAs.find(c => c.name === "Diana");

      try {
        await program.methods
          .vote([bob.pda, diana.pda])
          .accounts({
            voter: voterPDA,
            candidate1: bob.pda,
            candidate2: diana.pda,
            authority: wallet.publicKey,
          })
          .rpc();
        
        expect.fail("Should have thrown AlreadyVoted error");
      } catch (err) {
        expect(err.toString()).to.include("AlreadyVoted");
        console.log("✓ Correctly prevented double voting");
      }
    });

    it("Should fail when unauthorized signer attempts to vote", async () => {
      console.log("\n--- Testing Unauthorized Access Prevention ---");

      // Initialize a voter for another authority but try to vote with unauthorized wallet
      const [unauthorizedVoterPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("voter"), unauthorizedWallet.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .initializeVoter()
        .accounts({
          voter: unauthorizedVoterPDA,
          authority: unauthorizedWallet.publicKey,
          payer: unauthorizedWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([unauthorizedWallet])
        .rpc();

      const bob = candidatePDAs.find(c => c.name === "Bob");
      const diana = candidatePDAs.find(c => c.name === "Diana");

      try {
        // Try to vote with wallet.publicKey instead of unauthorizedWallet
        await program.methods
          .vote([bob.pda, diana.pda])
          .accounts({
            voter: unauthorizedVoterPDA,
            candidate1: bob.pda,
            candidate2: diana.pda,
            authority: wallet.publicKey, // Wrong authority!
          })
          .rpc();
        
        expect.fail("Should have thrown UnauthorizedAccess error");
      } catch (err) {
        // The error can be either UnauthorizedAccess or a seeds constraint error
        // Both indicate proper access control
        const errorStr = err.toString();
        const isAccessDenied = errorStr.includes("UnauthorizedAccess") || 
                               errorStr.includes("seeds constraint") ||
                               errorStr.includes("A seeds constraint was violated");
        expect(isAccessDenied).to.be.true;
        console.log("✓ Correctly prevented unauthorized access");
      }
    });

    it("Should fail when providing mismatched candidate keys", async () => {
      console.log("\n--- Testing Invalid Candidate Key Rejection ---");

      // Create another new voter
      const testVoter = anchor.web3.Keypair.generate();
      
      const airdropSig = await provider.connection.requestAirdrop(
        testVoter.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig);

      const [testVoterPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("voter"), testVoter.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .initializeVoter()
        .accounts({
          voter: testVoterPDA,
          authority: testVoter.publicKey,
          payer: testVoter.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([testVoter])
        .rpc();

      const alice = candidatePDAs.find(c => c.name === "Alice");
      const bob = candidatePDAs.find(c => c.name === "Bob");
      const charlie = candidatePDAs.find(c => c.name === "Charlie");

      try {
        // Pass Alice's PDA in keys but Bob's PDA in accounts
        await program.methods
          .vote([alice.pda, charlie.pda])
          .accounts({
            voter: testVoterPDA,
            candidate1: bob.pda,  // Mismatch!
            candidate2: charlie.pda,
            authority: testVoter.publicKey,
          })
          .signers([testVoter])
          .rpc();
        
        expect.fail("Should have thrown InvalidCandidate error");
      } catch (err) {
        expect(err.toString()).to.include("InvalidCandidate");
        console.log("✓ Correctly rejected invalid candidate key");
      }
    });
  });

  describe("5. Final State Verification", () => {
    it("Should display final vote counts for all candidates", async () => {
      console.log("\n========== FINAL RESULTS ==========");
      
      for (const candidate of candidatePDAs) {
        const account = await program.account.candidateAccount.fetch(candidate.pda);
        console.log(`${candidate.name}: ${account.votes.toNumber()} votes`);
      }
    });
  });
});
