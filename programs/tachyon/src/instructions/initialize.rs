use std::mem::size_of;

use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::state::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        seeds = [FUNCTIONS_SEED],
        bump,
        payer = admin,
        space = 8 + size_of::<Functions>()
    )]
    pub functions: Account<'info, Functions>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    if ctx.accounts.functions.initialized {
        return err!(ErrorCode::ProgramAlreadyInitialized);
    }

    ctx.accounts.functions.initialized = true;

    Ok(())
}
