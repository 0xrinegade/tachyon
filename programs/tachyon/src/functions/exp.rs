use crate::{FunctionData, FunctionDataAccessors, FunctionLogic, FunctionType, ValueCode, LOAD_ERROR_TOLERANCE};
use anchor_lang::prelude::*;

use num_traits::Inv;
use rust_decimal::{Decimal, MathematicalOps};

use crate::error::ErrorCode;

pub struct Exp {}

impl FunctionLogic for Exp {
    const FUNCTION_TYPE: FunctionType = FunctionType::Exp;

    fn validate_load(x_in: Decimal, y_in: Decimal) -> Result<(Decimal, ValueCode)> {
        // it's easier to calculate an accurate ln(x) than an accurate exp(x), so compare x to ln(y) instead of y to exp(x)
        // this would result in higher error tolerance, but is an acceptable tradeoff, since the difficulty in calculating an accurate exp(x) on-chain is the reason for taking pre-calculated off-chain inputs as arguments
        // this on-chain verification is primarily to catch any bugs/index mix-up in the off-chain loading code
        let diff = Self::proportion_difference(x_in, y_in.ln())?;

        if diff > LOAD_ERROR_TOLERANCE {
            return err!(ErrorCode::InvalidValue);
        }

        Ok((y_in, ValueCode::Valid))
    }

    fn eval(fd: &FunctionData, x_in: Decimal) -> Result<(Decimal, ValueCode)> {
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
            return err!(ErrorCode::OutOfDomainBounds);
        }

        // get indices for the x value
        let (lower_index, upper_index) = fd.get_index_bounds(x)?;

        // grab the reduced value code for the corresponding indices
        let value_code = fd.reduce_value_codes_from_indices(Vec::from([lower_index, upper_index]))?;
        if value_code == ValueCode::Empty {
            return err!(ErrorCode::EmptyData);
        }

        // get the data using the indices
        let lower_val = fd.get_value(lower_index)?;
        let upper_val = fd.get_value(upper_index)?;

        let interval = fd.get_interval()?;
        let remainder_prop = (x % interval) / interval; // where the requested data lives between the bounds

        // linear interpolation between the two known points
        // note: if index_decimal is exactly an integer, then ceil(x)=floor(x), but that case is no problem in the equation below since remainder_prop=0
        let mut return_val = lower_val * (Decimal::ONE - remainder_prop) + upper_val * remainder_prop;

        // invert if sign was negative, as noted above
        if is_negative {
            return_val = return_val.inv();
        }

        Ok((return_val, value_code))
    }
}
