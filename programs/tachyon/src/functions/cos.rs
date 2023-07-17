use crate::{FunctionData, FunctionLogic, FunctionType, Interpolation, Sin, ValueCode, LOAD_ERROR_TOLERANCE};
use anchor_lang::prelude::*;

use rust_decimal::{Decimal, MathematicalOps};

use crate::error::ErrorCode;

pub struct Cos {}

impl FunctionLogic for Cos {
    const FUNCTION_TYPE: FunctionType = FunctionType::Cos;

    fn validate_load(x_in: Decimal, y_in: Decimal) -> Result<(Decimal, ValueCode)> {
        let diff = Self::proportion_difference(y_in, x_in.cos())?;

        if diff > LOAD_ERROR_TOLERANCE {
            return err!(ErrorCode::InvalidValue);
        }

        Ok((y_in, ValueCode::Valid))
    }

    fn eval(fd: &FunctionData, x_in: Decimal, interp: Interpolation, saturating: bool) -> Result<Decimal> {
        Sin::eval(fd, x_in, interp, saturating)
    }
}
