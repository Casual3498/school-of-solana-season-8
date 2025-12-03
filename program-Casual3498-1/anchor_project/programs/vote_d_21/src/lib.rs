use anchor_lang::prelude::*;

// Module declarations
pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;

// Re-exports for convenience
pub use errors::*;
pub use events::*;
pub use state::*;

// Import instruction contexts
use instructions::*;

declare_id!("7qsdAz3ta9gg3eikuzQuJMj928zFnPUB8C4rb42pr6RN");

#[program]
pub mod vote_d_21 {
    use super::*;

    /// Initialize a candidate account with a unique name.
    /// Seeds: ["candidate", name.as_bytes()]
    /// Fails if PDA already exists.
    pub fn initialize_candidate(ctx: Context<InitializeCandidate>, name: String) -> Result<()> {
        instructions::initialize_candidate::initialize_candidate(ctx, name)
    }

    /// Initialize a voter account for a specific authority.
    /// Seeds: ["voter", authority.key().as_ref()]
    /// Marks voted = false initially.
    pub fn initialize_voter(ctx: Context<InitializeVoter>) -> Result<()> {
        instructions::initialize_voter::initialize_voter(ctx)
    }

    /// Cast votes for two distinct candidates.
    /// Requires signer authority match, prevents duplicate candidates and double voting.
    pub fn vote(ctx: Context<Vote>, candidate_keys: [Pubkey; 2]) -> Result<()> {
        instructions::vote::vote(ctx, candidate_keys)
    }
}
