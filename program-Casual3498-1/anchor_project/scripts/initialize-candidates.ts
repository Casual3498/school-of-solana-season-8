import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VoteD21 } from "../target/types/vote_d_21";
import { PublicKey, SystemProgram } from "@solana/web3.js";

async function main() {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.VoteD21 as Program<VoteD21>;
  
  const candidates = ["Alice", "Bob", "Charlie", "Diana"];
  
  console.log("Initializing candidates...\n");
  
  for (const candidateName of candidates) {
    try {
      // Derive PDA for candidate
      const [candidatePDA, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("candidate"), Buffer.from(candidateName)],
        program.programId
      );
      
      console.log(`Initializing candidate: ${candidateName}`);
      console.log(`PDA: ${candidatePDA.toBase58()}`);
      
      // Initialize candidate
      const tx = await program.methods
        .initializeCandidate(candidateName)
        .accounts({
          candidate: candidatePDA,
          payer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      console.log(`✅ ${candidateName} initialized successfully!`);
      console.log(`Transaction: ${tx}\n`);
    } catch (error: any) {
      if (error.message?.includes("already in use")) {
        console.log(`⚠️  ${candidateName} already initialized, skipping...\n`);
      } else {
        console.error(`❌ Error initializing ${candidateName}:`, error.message);
        console.error(error);
      }
    }
  }
  
  console.log("✅ All candidates initialized!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
