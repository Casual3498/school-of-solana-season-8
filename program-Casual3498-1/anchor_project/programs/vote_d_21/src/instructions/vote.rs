use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;
use crate::events::*;

/// Cast votes for two distinct candidates.
/// Requires signer authority match, prevents duplicate candidates and double voting.
pub fn vote(ctx: Context<Vote>, candidate_keys: [Pubkey; 2]) -> Result<()> {
    let voter = &mut ctx.accounts.voter;

    // Check if voter has already voted
    require!(!voter.voted, VoteError::AlreadyVoted);

    // Verify authority matches
    require_keys_eq!(
        voter.authority,
        ctx.accounts.authority.key(),
        VoteError::UnauthorizedAccess
    );

    // Check for duplicate candidates
    require_neq!(
        candidate_keys[0],
        candidate_keys[1],
        VoteError::DuplicateCandidates
    );

    // Verify both candidates are valid PDAs and increment their votes
    let candidate1 = &mut ctx.accounts.candidate1;
    let candidate2 = &mut ctx.accounts.candidate2;

    // Verify candidate1 matches first key
    require_keys_eq!(
        candidate1.key(),
        candidate_keys[0],
        VoteError::InvalidCandidate
    );

    // Verify candidate2 matches second key
    require_keys_eq!(
        candidate2.key(),
        candidate_keys[1],
        VoteError::InvalidCandidate
    );

    // Increment votes
    candidate1.votes = candidate1
        .votes
        .checked_add(1)
        .ok_or(VoteError::VoteOverflow)?;
    candidate2.votes = candidate2
        .votes
        .checked_add(1)
        .ok_or(VoteError::VoteOverflow)?;

    // Mark voter as having voted and store their choices
    voter.voted = true;
    voter.votes = candidate_keys;

    emit!(VoteCast {
        voter: voter.authority,
        candidates: candidate_keys,
    });

    msg!("Vote cast successfully for {} and {}", candidate1.name, candidate2.name);
    Ok(())
}

#[derive(Accounts)]
#[instruction(candidate_keys: [Pubkey; 2])]
pub struct Vote<'info> {
    #[account(
        mut,
        seeds = [b"voter", authority.key().as_ref()],
        bump = voter.bump
    )]
    pub voter: Account<'info, VoterAccount>,

    #[account(
        mut,
        seeds = [b"candidate", candidate1.name.as_bytes()],
        bump = candidate1.bump
    )]
    pub candidate1: Account<'info, CandidateAccount>,

    #[account(
        mut,
        seeds = [b"candidate", candidate2.name.as_bytes()],
        bump = candidate2.bump
    )]
    pub candidate2: Account<'info, CandidateAccount>,

    pub authority: Signer<'info>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_checked_add_vote_overflow() {
        // Test that checked_add properly handles overflow
        let max_votes = u64::MAX;
        let result = max_votes.checked_add(1);
        assert!(result.is_none(), "Should return None on overflow");
    }

    #[test]
    fn test_checked_add_normal_increment() {
        // Test normal vote increment
        let votes = 0u64;
        let result = votes.checked_add(1);
        assert_eq!(result, Some(1));

        let votes = 999u64;
        let result = votes.checked_add(1);
        assert_eq!(result, Some(1000));
    }

    #[test]
    fn test_candidate_keys_uniqueness() {
        // Test that two different pubkeys are unique
        let key1 = Pubkey::new_unique();
        let key2 = Pubkey::new_unique();
        assert_ne!(key1, key2);
    }

    #[test]
    fn test_candidate_keys_equality() {
        // Test pubkey equality
        let key1 = Pubkey::new_unique();
        let key2 = key1;
        assert_eq!(key1, key2);
    }

    #[test]
    fn test_voter_state_transitions() {
        // Test voter state changes from not voted to voted
        let authority = Pubkey::new_unique();
        let mut voter = VoterAccount {
            authority,
            voted: false,
            votes: [Pubkey::default(), Pubkey::default()],
            bump: 255,
        };

        // Initial state
        assert!(!voter.voted);
        assert_eq!(voter.votes[0], Pubkey::default());
        assert_eq!(voter.votes[1], Pubkey::default());

        // Simulate voting
        let candidate1 = Pubkey::new_unique();
        let candidate2 = Pubkey::new_unique();
        voter.voted = true;
        voter.votes = [candidate1, candidate2];

        // After voting state
        assert!(voter.voted);
        assert_eq!(voter.votes[0], candidate1);
        assert_eq!(voter.votes[1], candidate2);
    }

    #[test]
    fn test_multiple_vote_increments() {
        // Test multiple sequential vote increments
        let mut candidate = CandidateAccount {
            name: String::from("Alice"),
            votes: 0,
            bump: 255,
        };

        for i in 1..=10 {
            candidate.votes = candidate.votes.checked_add(1).unwrap();
            assert_eq!(candidate.votes, i);
        }

        assert_eq!(candidate.votes, 10);
    }

    #[test]
    fn test_candidate_vote_count_persistence() {
        // Test that vote counts are properly stored
        let mut candidate1 = CandidateAccount {
            name: String::from("Alice"),
            votes: 5,
            bump: 255,
        };

        let mut candidate2 = CandidateAccount {
            name: String::from("Bob"),
            votes: 3,
            bump: 254,
        };

        // Increment both
        candidate1.votes = candidate1.votes.checked_add(1).unwrap();
        candidate2.votes = candidate2.votes.checked_add(1).unwrap();

        assert_eq!(candidate1.votes, 6);
        assert_eq!(candidate2.votes, 4);
    }
}

