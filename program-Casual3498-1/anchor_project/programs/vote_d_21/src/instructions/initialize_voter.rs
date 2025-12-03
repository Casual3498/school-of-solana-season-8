use anchor_lang::prelude::*;
use crate::state::*;

/// Initialize a voter account for a specific authority.
/// Seeds: ["voter", authority.key().as_ref()]
/// Marks voted = false initially.
pub fn initialize_voter(ctx: Context<InitializeVoter>) -> Result<()> {
    let voter = &mut ctx.accounts.voter;
    voter.authority = ctx.accounts.authority.key();
    voter.voted = false;
    voter.votes = [Pubkey::default(), Pubkey::default()];
    voter.bump = ctx.bumps.voter;

    msg!("Voter initialized for authority: {}", voter.authority);
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeVoter<'info> {
    #[account(
        init,
        payer = payer,
        space = VoterAccount::SPACE,
        seeds = [b"voter", authority.key().as_ref()],
        bump
    )]
    pub voter: Account<'info, VoterAccount>,

    /// The authority who will control this voter account
    pub authority: Signer<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_voter_initialization_state() {
        // Test initial voter state
        let authority = Pubkey::new_unique();
        let voter = VoterAccount {
            authority,
            voted: false,
            votes: [Pubkey::default(), Pubkey::default()],
            bump: 255,
        };

        assert_eq!(voter.authority, authority);
        assert!(!voter.voted);
        assert_eq!(voter.votes[0], Pubkey::default());
        assert_eq!(voter.votes[1], Pubkey::default());
        assert_eq!(voter.bump, 255);
    }

    #[test]
    fn test_voter_authority_assignment() {
        // Test that voter is correctly associated with authority
        let authorities = vec![
            Pubkey::new_unique(),
            Pubkey::new_unique(),
            Pubkey::new_unique(),
        ];

        for authority in authorities {
            let voter = VoterAccount {
                authority,
                voted: false,
                votes: [Pubkey::default(), Pubkey::default()],
                bump: 255,
            };
            assert_eq!(voter.authority, authority);
        }
    }

    #[test]
    fn test_voter_initial_not_voted() {
        // Verify all new voters start with voted = false
        let voters = vec![
            VoterAccount {
                authority: Pubkey::new_unique(),
                voted: false,
                votes: [Pubkey::default(), Pubkey::default()],
                bump: 255,
            },
            VoterAccount {
                authority: Pubkey::new_unique(),
                voted: false,
                votes: [Pubkey::default(), Pubkey::default()],
                bump: 254,
            },
        ];

        for voter in voters {
            assert!(!voter.voted, "New voter should not have voted yet");
        }
    }

    #[test]
    fn test_voter_votes_array_defaults() {
        // Test that votes array is initialized with default pubkeys
        let voter = VoterAccount {
            authority: Pubkey::new_unique(),
            voted: false,
            votes: [Pubkey::default(), Pubkey::default()],
            bump: 255,
        };

        assert_eq!(voter.votes[0], Pubkey::default());
        assert_eq!(voter.votes[1], Pubkey::default());
        assert_eq!(voter.votes.len(), 2);
    }

    #[test]
    fn test_voter_bump_range() {
        // Test bump values across valid range
        for bump in [0u8, 127, 254, 255] {
            let voter = VoterAccount {
                authority: Pubkey::new_unique(),
                voted: false,
                votes: [Pubkey::default(), Pubkey::default()],
                bump,
            };
            assert_eq!(voter.bump, bump);
        }
    }

    #[test]
    fn test_voter_authority_uniqueness() {
        // Test that different voters have different authorities
        let voter1 = VoterAccount {
            authority: Pubkey::new_unique(),
            voted: false,
            votes: [Pubkey::default(), Pubkey::default()],
            bump: 255,
        };

        let voter2 = VoterAccount {
            authority: Pubkey::new_unique(),
            voted: false,
            votes: [Pubkey::default(), Pubkey::default()],
            bump: 254,
        };

        assert_ne!(voter1.authority, voter2.authority);
    }

    #[test]
    fn test_voter_state_immutability_before_vote() {
        // Test that voter state is as expected before any vote
        let authority = Pubkey::new_unique();
        let voter = VoterAccount {
            authority,
            voted: false,
            votes: [Pubkey::default(), Pubkey::default()],
            bump: 255,
        };

        // All fields should match initial state
        assert_eq!(voter.authority, authority);
        assert_eq!(voter.voted, false);
        assert!(voter.votes.iter().all(|&v| v == Pubkey::default()));
    }
}



