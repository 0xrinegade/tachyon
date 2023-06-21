use crate::{FunctionData, FunctionDataAccessors, FunctionLogic, FunctionType, Ln, ValueCode};
use anchor_lang::prelude::*;
use num_traits::{Inv, One};
use rust_decimal::{Decimal, MathematicalOps};

use crate::error::ErrorCode;

pub struct Log10 {}

impl FunctionLogic for Log10 {
    const FUNCTION_TYPE: FunctionType = FunctionType::Log10;

    fn eval_load(x: Decimal) -> Result<(Decimal, ValueCode)> {
        if x.is_zero() {
            return Ok((Decimal::MIN, ValueCode::Truncated));
        }

        Ok((x.log10(), ValueCode::Valid))
    }

    fn eval(fd: &FunctionData, x: Decimal) -> Result<(Decimal, ValueCode)> {
        Ln::eval(fd, x)
    }
}
