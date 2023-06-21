use crate::{FunctionData, FunctionDataAccessors, FunctionLogic, FunctionType, ValueCode};
use anchor_lang::prelude::*;
use num_traits::{Inv, One};
use rust_decimal::{Decimal, MathematicalOps};
use std::ops::Rem;

use crate::error::ErrorCode;

pub struct Cos {}

impl FunctionLogic for Cos {
    const FUNCTION_TYPE: FunctionType = FunctionType::Cos;

    fn eval_load(x: Decimal) -> Result<(Decimal, ValueCode)> {
        Ok((x.cos(), ValueCode::Valid))
    }

    fn eval(fd: &FunctionData, x: Decimal) -> Result<(Decimal, ValueCode)> {
        let mut x = x;

        // cos(0)=1, so just return 1
        if x.is_zero() {
            return Ok((Decimal::ONE, ValueCode::Valid));
        }

        x = x.rem(Decimal::TWO_PI);

        // grab the domain start and end
        let domain_start = fd.get_domain_start()?;
        let domain_end = fd.get_domain_end()?;

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
        let return_val = lower_val * (Decimal::ONE - remainder_prop) + upper_val * remainder_prop;

        Ok((return_val, value_code))
    }
}
