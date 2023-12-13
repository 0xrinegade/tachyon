use crate::FunctionDataAccessors;
use anchor_lang::prelude::*;
use anchor_lang::ZeroCopy;
use num_traits::FromPrimitive;
use rust_decimal::Decimal;

use crate::error::ErrorCode;
use crate::state::*;

#[derive(Accounts)]
pub struct FuncInit<'info, T: ZeroCopy + Owner + FunctionDataAccessors> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [FUNCTIONS_SEED],
        bump,
        has_one = admin
    )]
    pub functions: Account<'info, Functions>,
    #[account(zero)]
    pub f: AccountLoader<'info, T>,
    pub system_program: Program<'info, System>,
}

impl<T: ZeroCopy + Owner + FunctionDataAccessors> FuncInit<'_, T> {
    pub fn handler(ctx: Context<FuncInit<T>>, domain_start_raw: [u8; 16], domain_end_raw: [u8; 16], ft: FunctionType) -> Result<()> {
        let mut f = ctx.accounts.f.load_init()?;

        if f.get_is_initialized() {
            return err!(ErrorCode::AccountAlreadyInitialized);
        }
        f.set_initialized_true()?;

        let domain_start = Decimal::deserialize(domain_start_raw);
        let domain_end = Decimal::deserialize(domain_end_raw);

        f.set_domain_start(domain_start_raw)?;
        f.set_domain_end(domain_end_raw)?;

        let num_values = Decimal::from_usize(NUM_VALUES).unwrap();
        let interval = (domain_end - domain_start) / num_values;

        f.set_num_values(NUM_VALUES as u32)?;
        f.set_interval(interval.serialize())?;

        f.set_function_type(ft)?;

        Ok(())
    }
}
