use crate::{FunctionData, FunctionDataAccessors, FunctionLogic, FunctionType, Interpolation, ValueCode, LOAD_ERROR_TOLERANCE};
use anchor_lang::prelude::*;

use num_traits::Inv;
use rust_decimal::{Decimal, MathematicalOps};

use crate::error::ErrorCode;

pub struct Exp {}

impl FunctionLogic for Exp {
    const FUNCTION_TYPE: FunctionType = FunctionType::Exp;

    fn validate_load(x_in: Decimal, y_in: Decimal) -> Result<(Decimal, ValueCode)> {
        // it's easier to calculate an accurate ln(x) then an accurate exp(x), so compare x to ln(y) instead of y to exp(x)
        // this would result in higher error tolerance, but is an acceptable tradeoff, since the difficulty in calculating an accurate exp(x) on-chain is the reason for taking pre-calculated off-chain inputs as arguments
        // this on-chain verification is primarily to catch any bugs/index mix-up in the off-chain loading code
        let diff = Self::proportion_difference(x_in, y_in.ln())?;

        if diff > LOAD_ERROR_TOLERANCE {
            return err!(ErrorCode::InvalidValue);
        }

        Ok((y_in, ValueCode::Valid))
    }

    fn eval(fd: &FunctionData, x_in: Decimal, interp: Interpolation, saturating: bool) -> Result<Decimal> {
        let mut x = x_in;

        // e^-x = 1/e^x, so only cover positive values of x and invert if necessary
        let is_negative = x.is_sign_negative();
        if is_negative {
            x.set_sign_positive(true);
        }

        // grab the domain end
        let domain_end = fd.get_domain_end()?;

        // test for out of domain bounds
        if x > domain_end {
            if saturating {
                x = domain_end;
            } else {
                return err!(ErrorCode::OutOfDomainBounds);
            }
        }

        let mut y = Self::interpolate(fd, x, interp)?;

        // invert if sign was negative, as noted above
        if is_negative {
            y = y.inv();
        }

        Ok(y)
    }
}
