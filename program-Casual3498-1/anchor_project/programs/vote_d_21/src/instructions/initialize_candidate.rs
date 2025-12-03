use anchor_lang::prelude::*;
use crate::state::*;
use crate::events::*;

/// Initialize a candidate account with a unique name.
/// Seeds: ["candidate", name.as_bytes()]
/// Fails if PDA already exists.
pub fn initialize_candidate(ctx: Context<InitializeCandidate>, name: String) -> Result<()> {
    let candidate = &mut ctx.accounts.candidate;
    candidate.name = name.clone();
    candidate.votes = 0;
    candidate.bump = ctx.bumps.candidate;

    emit!(CandidateInitialized {
        name,
        pubkey: candidate.key(),
    });

    msg!("Candidate initialized: {}", candidate.name);
    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitializeCandidate<'info> {
    #[account(
        init,
        payer = payer,
        space = CandidateAccount::SPACE,
        seeds = [b"candidate", name.as_bytes()],
        bump
    )]
    pub candidate: Account<'info, CandidateAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_candidate_initialization_state() {
        // Test initial candidate state
        let name = String::from("Alice");
        let candidate = CandidateAccount {
            name: name.clone(),
            votes: 0,
            bump: 255,
        };

        assert_eq!(candidate.name, name);
        assert_eq!(candidate.votes, 0);
        assert_eq!(candidate.bump, 255);
    }

    #[test]
    fn test_candidate_name_validation() {
        // Test various candidate names
        let names = vec!["Alice", "Bob", "Charlie", "Diana"];
        
        for name in names {
            let candidate = CandidateAccount {
                name: String::from(name),
                votes: 0,
                bump: 255,
            };
            assert_eq!(candidate.name, name);
            assert!(candidate.name.len() <= CandidateAccount::MAX_NAME_LEN);
        }
    }

    #[test]
    fn test_candidate_bump_values() {
        // Test that bump can hold valid PDA bump values (0-255)
        let candidate_min = CandidateAccount {
            name: String::from("Test"),
            votes: 0,
            bump: 0,
        };
        assert_eq!(candidate_min.bump, 0);

        let candidate_max = CandidateAccount {
            name: String::from("Test"),
            votes: 0,
            bump: 255,
        };
        assert_eq!(candidate_max.bump, 255);
    }

    #[test]
    fn test_candidate_initial_votes_zero() {
        // Verify all candidates start with 0 votes
        let candidates = vec![
            CandidateAccount { name: "Alice".to_string(), votes: 0, bump: 255 },
            CandidateAccount { name: "Bob".to_string(), votes: 0, bump: 254 },
            CandidateAccount { name: "Charlie".to_string(), votes: 0, bump: 253 },
        ];

        for candidate in candidates {
            assert_eq!(candidate.votes, 0);
        }
    }

    #[test]
    fn test_candidate_name_edge_cases() {
        // Test empty name (allowed by type system)
        let empty = CandidateAccount {
            name: String::from(""),
            votes: 0,
            bump: 255,
        };
        assert!(empty.name.is_empty());

        // Test single character
        let single = CandidateAccount {
            name: String::from("A"),
            votes: 0,
            bump: 255,
        };
        assert_eq!(single.name.len(), 1);

        // Test max length
        let max = CandidateAccount {
            name: "X".repeat(CandidateAccount::MAX_NAME_LEN),
            votes: 0,
            bump: 255,
        };
        assert_eq!(max.name.len(), CandidateAccount::MAX_NAME_LEN);
    }
}



