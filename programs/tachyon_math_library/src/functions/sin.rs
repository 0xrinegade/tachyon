use crate::{FunctionData, FunctionLogic, FunctionType, Interpolation, ValueCode, LOAD_ERROR_TOLERANCE};
use anchor_lang::prelude::*;

use rust_decimal::{Decimal, MathematicalOps};
use std::ops::Rem;

use crate::error::ErrorCode;

pub struct Sin {}

impl FunctionLogic for Sin {
    const FUNCTION_TYPE: FunctionType = FunctionType::Sin;

    fn validate_load(x_in: Decimal, y_in: Decimal) -> Result<(Decimal, ValueCode)> {
        let diff = Self::proportion_difference(y_in, x_in.sin())?;

        if diff > LOAD_ERROR_TOLERANCE {
            return err!(ErrorCode::InvalidValue);
        }

        Ok((y_in, ValueCode::Valid))
    }

    fn eval(fd: &FunctionData, x_in: Decimal, interp: Interpolation, _saturating: bool) -> Result<Decimal> {
        let x = x_in.rem(Decimal::TWO_PI);

        let y = Self::interpolate(fd, x, interp)?;

        Ok(y)
    }
}
