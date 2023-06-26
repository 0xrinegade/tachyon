use crate::{FunctionData, FunctionDataAccessors, FunctionLogic, FunctionType, ValueCode, LOAD_ERROR_TOLERANCE};
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

    fn eval(fd: &FunctionData, x_in: Decimal) -> Result<(Decimal, ValueCode)> {
        let x = x_in.rem(Decimal::TWO_PI);

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
