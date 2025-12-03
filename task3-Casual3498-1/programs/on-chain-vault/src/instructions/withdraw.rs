//-------------------------------------------------------------------------------
///
/// TASK: Implement the withdraw functionality for the on-chain vault
/// 
/// Requirements:
/// - Verify that the vault is not locked
/// - Verify that the vault has enough balance to withdraw
/// - Transfer lamports from vault to vault authority
/// - Emit a withdraw event after successful transfer
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use crate::state::Vault;
use crate::errors::VaultError;
use crate::events::WithdrawEvent;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub vault_authority: Signer<'info>,
    #[account(
        mut,
        has_one = vault_authority,
        constraint = !vault.locked @ VaultError::VaultLocked
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

pub fn _withdraw(c:Context<Withdraw>,a:u64)->Result<()>{if a>c.accounts.vault.to_account_info().lamports(){return err!(VaultError::InsufficientBalance);}**c.accounts.vault.to_account_info().try_borrow_mut_lamports()?=c.accounts.vault.to_account_info().lamports().checked_sub(a).ok_or(VaultError::Overflow)?;**c.accounts.vault_authority.to_account_info().try_borrow_mut_lamports()?=c.accounts.vault_authority.to_account_info().lamports().checked_add(a).ok_or(VaultError::Overflow)?;emit!(WithdrawEvent{amount:a,vault_authority:c.accounts.vault_authority.key(),vault:c.accounts.vault.key()});Ok(())}