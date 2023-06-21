use crate::FunctionDataAccessors;
use anchor_lang::prelude::*;
use anchor_lang::ZeroCopy;
use rust_decimal::MathematicalOps;
use std::cell::RefMut;

use crate::error::ErrorCode;
use crate::state::*;

#[derive(Accounts)]
pub struct FuncLoad<'info, T: ZeroCopy + Owner + FunctionDataAccessors> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [FUNCTIONS_SEED],
        bump,
    )]
    pub functions: Account<'info, Functions>,
    #[account(mut)]
    pub f: AccountLoader<'info, T>,
    pub system_program: Program<'info, System>,
}

impl<T: ZeroCopy + Owner + FunctionDataAccessors> FuncLoad<'_, T> {
    pub fn handler(ctx: Context<FuncLoad<T>>) -> Result<()> {
        let mut f = ctx.accounts.f.load_mut()?;

        for _ in 0..10 {
            let index = f.get_next_index();
            let x = f.get_x_from_index(index)?;

            let (y, code) = f.eval_load(x)?;
            f.set_value(index, y.serialize(), code as u8)?;

            f.increment_next_index()?;
        }

        Ok(())
    }
}
