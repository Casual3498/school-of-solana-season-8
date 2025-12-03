use anchor_lang::prelude::*;

/// Event emitted when a candidate is initialized
#[event]
pub struct CandidateInitialized {
    pub name: String,
    pub pubkey: Pubkey,
}

/// Event emitted when a vote is cast
#[event]
pub struct VoteCast {
    pub voter: Pubkey,
    pub candidates: [Pubkey; 2],
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_candidate_initialized_event_creation() {
        let name = String::from("Alice");
        let pubkey = Pubkey::new_unique();

        let event = CandidateInitialized {
            name: name.clone(),
            pubkey,
        };

        assert_eq!(event.name, name);
        assert_eq!(event.pubkey, pubkey);
    }

    #[test]
    fn test_vote_cast_event_creation() {
        let voter = Pubkey::new_unique();
        let candidate1 = Pubkey::new_unique();
        let candidate2 = Pubkey::new_unique();
        let candidates = [candidate1, candidate2];

        let event = VoteCast {
            voter,
            candidates,
        };

        assert_eq!(event.voter, voter);
        assert_eq!(event.candidates[0], candidate1);
        assert_eq!(event.candidates[1], candidate2);
        assert_eq!(event.candidates.len(), 2);
    }

    #[test]
    fn test_vote_cast_candidates_array() {
        let voter = Pubkey::new_unique();
        let candidates = [Pubkey::new_unique(), Pubkey::new_unique()];

        let event = VoteCast { voter, candidates };

        // Verify array has exactly 2 elements
        assert_eq!(event.candidates.len(), 2);
        // Verify candidates are different
        assert_ne!(event.candidates[0], event.candidates[1]);
    }

    #[test]
    fn test_candidate_initialized_with_empty_name() {
        let name = String::from("");
        let pubkey = Pubkey::new_unique();

        let event = CandidateInitialized { name: name.clone(), pubkey };

        assert_eq!(event.name, "");
        assert!(event.name.is_empty());
    }

    #[test]
    fn test_candidate_initialized_with_long_name() {
        let name = "A".repeat(32);
        let pubkey = Pubkey::new_unique();

        let event = CandidateInitialized {
            name: name.clone(),
            pubkey,
        };

        assert_eq!(event.name.len(), 32);
        assert_eq!(event.name, name);
    }
}



