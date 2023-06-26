use crate::{FunctionDataAccessors, LOAD_ERROR_TOLERANCE};
use anchor_lang::prelude::*;
use anchor_lang::ZeroCopy;

use rust_decimal::{Decimal};


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
        has_one = admin
    )]
    pub functions: Account<'info, Functions>,
    #[account(mut)]
    pub f: AccountLoader<'info, T>,
    pub system_program: Program<'info, System>,
}

impl<T: ZeroCopy + Owner + FunctionDataAccessors> FuncLoad<'_, T> {
    pub fn handler(ctx: Context<FuncLoad<T>>, index_in: u32, x_in_raw: [u8; 16], y_in_raw: [u8; 16]) -> Result<()> {
        let mut f = ctx.accounts.f.load_mut()?;

        let x_in = Decimal::deserialize(x_in_raw);
        let y_in = Decimal::deserialize(y_in_raw);

        // verify that the index corresponds to the value of x
        let x = f.get_x_from_index(index_in)?;
        let x_diff = (x - x_in).abs();
        if x_diff > LOAD_ERROR_TOLERANCE {
            return err!(ErrorCode::InvalidIndex);
        }

        // verify (approximately) that f(x) = y, and use the return value as the load input (to load any edge cases re: truncation)
        let (y, code) = f.eval_load(x_in, y_in)?;
        f.set_value(index_in, y.serialize(), code as u8)?;

        f.increment_num_values_loaded()?;

        Ok(())
    }
}
