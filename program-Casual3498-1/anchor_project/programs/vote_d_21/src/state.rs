use anchor_lang::prelude::*;

/// Candidate account storing candidate information and vote count
#[account]
pub struct CandidateAccount {
    pub name: String,       // Max 32 chars = 4 + 32 = 36 bytes
    pub votes: u64,         // 8 bytes
    pub bump: u8,           // 1 byte
}

impl CandidateAccount {
    pub const MAX_NAME_LEN: usize = 32;
    // 8 (discriminator) + 36 (name) + 8 (votes) + 1 (bump) = 53 bytes
    pub const SPACE: usize = 8 + 36 + 8 + 1;
}

/// Voter account tracking voter's authority and voting status
#[account]
pub struct VoterAccount {
    pub authority: Pubkey,  // 32 bytes
    pub voted: bool,        // 1 byte
    pub votes: [Pubkey; 2], // 64 bytes
    pub bump: u8,           // 1 byte
}

impl VoterAccount {
    // 8 (discriminator) + 32 (authority) + 1 (voted) + 64 (votes) + 1 (bump) = 106 bytes
    pub const SPACE: usize = 8 + 32 + 1 + 64 + 1;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_candidate_account_space() {
        // Test that SPACE constant is correctly calculated
        let expected_space = 8 + 36 + 8 + 1; // discriminator + name + votes + bump
        assert_eq!(CandidateAccount::SPACE, expected_space);
        assert_eq!(CandidateAccount::SPACE, 53);
    }

    #[test]
    fn test_candidate_max_name_length() {
        assert_eq!(CandidateAccount::MAX_NAME_LEN, 32);
    }

    #[test]
    fn test_voter_account_space() {
        // Test that SPACE constant is correctly calculated
        let expected_space = 8 + 32 + 1 + 64 + 1; // discriminator + authority + voted + votes + bump
        assert_eq!(VoterAccount::SPACE, expected_space);
        assert_eq!(VoterAccount::SPACE, 106);
    }

    #[test]
    fn test_voter_account_votes_array_size() {
        // Ensure votes array can hold exactly 2 pubkeys
        let voter = VoterAccount {
            authority: Pubkey::default(),
            voted: false,
            votes: [Pubkey::default(), Pubkey::default()],
            bump: 255,
        };
        assert_eq!(voter.votes.len(), 2);
    }

    #[test]
    fn test_default_voter_state() {
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
    fn test_candidate_vote_increment() {
        let mut candidate = CandidateAccount {
            name: String::from("Alice"),
            votes: 0,
            bump: 255,
        };

        // Test initial state
        assert_eq!(candidate.votes, 0);
        assert_eq!(candidate.name, "Alice");

        // Simulate vote increments
        candidate.votes = candidate.votes.checked_add(1).unwrap();
        assert_eq!(candidate.votes, 1);

        candidate.votes = candidate.votes.checked_add(1).unwrap();
        assert_eq!(candidate.votes, 2);
    }

    #[test]
    fn test_candidate_name_length() {
        let short_name = String::from("Bob");
        let max_name = "A".repeat(CandidateAccount::MAX_NAME_LEN);
        
        assert!(short_name.len() <= CandidateAccount::MAX_NAME_LEN);
        assert_eq!(max_name.len(), CandidateAccount::MAX_NAME_LEN);
    }
}

