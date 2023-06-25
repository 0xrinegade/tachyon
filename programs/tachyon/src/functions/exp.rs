use crate::{FuncInit, FunctionData, FunctionDataAccessors, FunctionLogic, FunctionType, ValueCode, NUM_VALUES};
use anchor_lang::prelude::*;
use anchor_lang::ZeroCopy;
use fast_math::exp;
use num_traits::{FromPrimitive, Inv, ToPrimitive};
use rust_decimal::{Decimal, MathematicalOps};

use crate::error::ErrorCode;

pub struct Exp {}

impl FunctionLogic for Exp {
    const FUNCTION_TYPE: FunctionType = FunctionType::Exp;

    fn eval_load(x: Decimal) -> Result<(Decimal, ValueCode)> {
        let y = Decimal::from_f32(exp(x.to_f32().unwrap())).unwrap();

        Ok((y, ValueCode::Valid))
    }

    fn eval(fd: &FunctionData, x: Decimal) -> Result<(Decimal, ValueCode)> {
        let mut x = x;

        // e^-x = 1/e^x, so only cover positive values of x and invert if necessary
        let is_negative = x.is_sign_negative();
        if is_negative {
            x.set_sign_positive(true);
        }

        // grab the domain start and end
        let domain_start = fd.get_domain_start()?;
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
