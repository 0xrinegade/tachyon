use crate::{FunctionData, FunctionDataAccessors, FunctionLogic, FunctionType, Interpolation, ValueCode, LOAD_ERROR_TOLERANCE};
use anchor_lang::prelude::*;

use rust_decimal::{Decimal, MathematicalOps};

use crate::error::ErrorCode;

pub struct Ln {}

impl FunctionLogic for Ln {
    const FUNCTION_TYPE: FunctionType = FunctionType::Ln;

    fn validate_load(x_in: Decimal, y_in: Decimal) -> Result<(Decimal, ValueCode)> {
        // truncated values should be set via edge cases within the program, not via loaded inputs
        if x_in.is_zero() {
            return Ok((Decimal::MIN, ValueCode::Truncated));
        }

        let diff = Self::proportion_difference(y_in, x_in.ln())?;

        if diff > LOAD_ERROR_TOLERANCE {
            return err!(ErrorCode::InvalidValue);
        }

        Ok((y_in, ValueCode::Valid))
    }

    fn eval(fd: &FunctionData, x: Decimal, interp: Interpolation) -> Result<(Decimal, ValueCode)> {
        // grab the domain start and end
        let domain_start = fd.get_domain_start()?;
        let domain_end = fd.get_domain_end()?;

        // test for out of domain bounds
        if x < domain_start || x > domain_end {
            return err!(ErrorCode::OutOfDomainBounds);
        }

        let (y, value_code) = Self::interpolate(fd, x, interp)?;

        Ok((y, value_code))
    }
}
