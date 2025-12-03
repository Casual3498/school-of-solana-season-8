use anchor_lang::prelude::*;

/// Custom error codes for the voting program
#[error_code]
pub enum VoteError {
    #[msg("This voter has already cast their votes.")]
    AlreadyVoted,

    #[msg("Cannot vote for the same candidate twice.")]
    DuplicateCandidates,

    #[msg("The provided candidate key is invalid.")]
    InvalidCandidate,

    #[msg("Unauthorized access: signer does not match voter authority.")]
    UnauthorizedAccess,

    #[msg("Account has already been initialized.")]
    AccountAlreadyInitialized,

    #[msg("Vote count overflow detected.")]
    VoteOverflow,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_variants_exist() {
        // Ensure all error variants are defined
        let _already_voted = VoteError::AlreadyVoted;
        let _duplicate = VoteError::DuplicateCandidates;
        let _invalid = VoteError::InvalidCandidate;
        let _unauthorized = VoteError::UnauthorizedAccess;
        let _reinit = VoteError::AccountAlreadyInitialized;
        let _overflow = VoteError::VoteOverflow;
    }

    #[test]
    fn test_error_discriminants() {
        // Verify error codes have unique discriminants
        use std::mem::discriminant;
        
        let already_voted = discriminant(&VoteError::AlreadyVoted);
        let duplicate = discriminant(&VoteError::DuplicateCandidates);
        let invalid = discriminant(&VoteError::InvalidCandidate);
        let unauthorized = discriminant(&VoteError::UnauthorizedAccess);
        let reinit = discriminant(&VoteError::AccountAlreadyInitialized);
        let overflow = discriminant(&VoteError::VoteOverflow);

        // All should be different
        assert_ne!(already_voted, duplicate);
        assert_ne!(already_voted, invalid);
        assert_ne!(already_voted, unauthorized);
        assert_ne!(duplicate, invalid);
        assert_ne!(duplicate, unauthorized);
        assert_ne!(invalid, unauthorized);
        assert_ne!(reinit, overflow);
    }

    #[test]
    fn test_error_count() {
        // Ensure we have exactly 6 error types
        // This helps catch if we accidentally add/remove errors
        let errors = vec![
            VoteError::AlreadyVoted,
            VoteError::DuplicateCandidates,
            VoteError::InvalidCandidate,
            VoteError::UnauthorizedAccess,
            VoteError::AccountAlreadyInitialized,
            VoteError::VoteOverflow,
        ];
        assert_eq!(errors.len(), 6);
    }
}



