use crate::{reduce_value_codes, FuncInit, FunctionData, FunctionDataAccessors, FunctionType, ValueCode, NUM_VALUES};
use anchor_lang::prelude::*;
use anchor_lang::ZeroCopy;
use num_traits::{FromPrimitive, ToPrimitive};
use rust_decimal::Decimal;

pub trait FunctionLogic {
    const FUNCTION_TYPE: FunctionType;

    fn validate_load(x_in: Decimal, y_in: Decimal) -> Result<(Decimal, ValueCode)>;
    fn eval(fd: &FunctionData, x: Decimal) -> Result<(Decimal, ValueCode)>;

    fn proportion_difference(a: Decimal, b: Decimal) -> Result<Decimal> {
        if a.is_zero() || b.is_zero() {
            return Ok((a - b).abs());
        }

        Ok(((a / b) - Decimal::ONE).abs())
    }
}
