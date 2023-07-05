use anchor_lang::prelude::*;
use anchor_lang::ZeroCopy;
use rust_decimal::Decimal;

use crate::error::ErrorCode;
use crate::state::*;
use crate::FunctionDataAccessors;

#[derive(Accounts)]
pub struct FuncEval<'info, T: ZeroCopy + Owner + FunctionDataAccessors> {
    #[account(mut)]
    pub user: Signer<'info>,
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

impl<T: ZeroCopy + Owner + FunctionDataAccessors> FuncEval<'_, T> {
    pub fn handler(ctx: Context<FuncEval<T>>, x_raw: [u8; 16]) -> Result<([u8; 16], u8)> {
        let f = ctx.accounts.f.load()?;

        if f.get_num_values_loaded() != NUM_VALUES as u32 {
            return err!(ErrorCode::IncompleteDataLoading);
        }

        // FIXME: hard-coded linear interpolation
        let (y, value_code) = f.eval(Decimal::deserialize(x_raw), Interpolation::Linear)?;

        Ok((y.serialize(), value_code as u8))
    }
}
