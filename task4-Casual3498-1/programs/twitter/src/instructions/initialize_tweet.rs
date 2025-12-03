//-------------------------------------------------------------------------------
///
/// TASK: Implement the initialize tweet functionality for the Twitter program
/// 
/// Requirements:
/// - Validate that topic and content don't exceed maximum lengths
/// - Initialize a new tweet account with proper PDA seeds
/// - Set tweet fields: topic, content, author, likes, dislikes, and bump
/// - Initialize counters (likes and dislikes) to zero
/// - Use topic in PDA seeds for tweet identification
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;

use crate::errors::TwitterError;
use crate::states::*;

pub fn initialize_tweet(
    ctx: Context<InitializeTweet>,
    topic: String,
    content: String,
) -> Result<()> {
    if topic.as_bytes().len() > TOPIC_LENGTH {
        return Err(TwitterError::TopicTooLong.into());
    }
    if content.as_bytes().len() > CONTENT_LENGTH {
        return Err(TwitterError::ContentTooLong.into());
    }

    let tweet_account = &mut ctx.accounts.tweet;
    tweet_account.tweet_author = *ctx.accounts.tweet_authority.key;
    tweet_account.topic = topic;
    tweet_account.content = content;
    tweet_account.likes = 0u64;
    tweet_account.dislikes = 0u64;

    let (_pda, bump) = Pubkey::find_program_address(
        &[
            tweet_account.topic.as_bytes(),
            TWEET_SEED.as_bytes(),
            ctx.accounts.tweet_authority.to_account_info().key.as_ref(),
        ],
        ctx.program_id,
    );
    tweet_account.bump = bump;

    Ok(())
}

#[derive(Accounts)]
#[instruction(topic: String)]
pub struct InitializeTweet<'info> {
    #[account(mut)]
    pub tweet_authority: Signer<'info>,

    #[account(
        init,
        payer = tweet_authority,
        space = 8 + 32 + 4 + TOPIC_LENGTH + 4 + CONTENT_LENGTH + 8 + 8 + 1,
        seeds = [topic.as_bytes(), TWEET_SEED.as_bytes(), tweet_authority.key().as_ref()],
        bump
    )]
    pub tweet: Account<'info, Tweet>,
    pub system_program: Program<'info, System>,
}
