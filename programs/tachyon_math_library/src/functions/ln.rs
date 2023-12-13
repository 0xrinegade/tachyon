use crate::{FunctionData, FunctionDataAccessors, FunctionLogic, FunctionType, Interpolation, ValueCode, LOAD_ERROR_TOLERANCE};
use anchor_lang::prelude::*;

use rust_decimal::{Decimal, MathematicalOps};

use crate::error::ErrorCode;

pub struct Ln {}

impl FunctionLogic for Ln {
    const FUNCTION_TYPE: FunctionType = FunctionType::Ln;

    fn validate_load(x_in: Decimal, y_in: Decimal) -> Result<(Decimal, ValueCode)> {
        if x_in.is_zero() {
            return Ok((Decimal::ZERO, ValueCode::NaN));
        }

        let diff = Self::proportion_difference(y_in, x_in.ln())?;

        if diff > LOAD_ERROR_TOLERANCE {
            return err!(ErrorCode::InvalidValue);
        }

        Ok((y_in, ValueCode::Valid))
    }

    fn eval(fd: &FunctionData, x: Decimal, interp: Interpolation, _saturating: bool) -> Result<Decimal> {
        // grab the domain start and end
        let domain_start = fd.get_domain_start()?;
        let domain_end = fd.get_domain_end()?;

        // test for out of domain bounds
        if x < domain_start || x > domain_end {
            return err!(ErrorCode::OutOfDomainBounds);
        }

        let y = Self::interpolate(fd, x, interp)?;

        Ok(y)
    }
}
