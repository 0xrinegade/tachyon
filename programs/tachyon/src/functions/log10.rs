use crate::{FunctionData, FunctionLogic, FunctionType, Interpolation, Ln, ValueCode, LOAD_ERROR_TOLERANCE};
use anchor_lang::prelude::*;

use rust_decimal::{Decimal, MathematicalOps};

use crate::error::ErrorCode;

pub struct Log10 {}

impl FunctionLogic for Log10 {
    const FUNCTION_TYPE: FunctionType = FunctionType::Log10;

    fn validate_load(x_in: Decimal, y_in: Decimal) -> Result<(Decimal, ValueCode)> {
        // truncated values should be set via edge cases within the program, not via loaded inputs
        if x_in.is_zero() {
            return Ok((Decimal::MIN, ValueCode::Truncated));
        }

        let diff = Self::proportion_difference(y_in, x_in.log10())?;

        if diff > LOAD_ERROR_TOLERANCE {
            return err!(ErrorCode::InvalidValue);
        }

        Ok((y_in, ValueCode::Valid))
    }

    fn eval(fd: &FunctionData, x: Decimal, interp: Interpolation, saturating: bool) -> Result<(Decimal, ValueCode)> {
        Ln::eval(fd, x, interp, saturating)
    }
}
