//-------------------------------------------------------------------------------
///
/// TASK: Implement the toggle lock functionality for the on-chain vault
/// 
/// Requirements:
/// - Toggle the locked state of the vault (locked becomes unlocked, unlocked becomes locked)
/// - Only the vault authority should be able to toggle the lock
/// - Emit a toggle lock event after successful state change
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use crate::state::Vault;
use crate::events::ToggleLockEvent;

#[derive(Accounts)]
pub struct ToggleLock<'info> {
    pub vault_authority: Signer<'info>,
    #[account(
        mut,
        has_one = vault_authority
    )]
    pub vault: Account<'info, Vault>,
}

pub fn _toggle_lock(ctx: Context<ToggleLock>) -> Result<()> {
    // Toggle the vault's locked state
    ctx.accounts.vault.locked = !ctx.accounts.vault.locked;

    // Emit the toggle lock event
    emit!(ToggleLockEvent {
        vault: ctx.accounts.vault.key(),
        vault_authority: ctx.accounts.vault_authority.key(),
        locked: ctx.accounts.vault.locked,
    });

    Ok(())
}