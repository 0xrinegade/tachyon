use crate::{FunctionData, FunctionDataAccessors, FunctionType, Interpolation, ValueCode};
use anchor_lang::prelude::*;
use num_traits::FromPrimitive;

use crate::error::ErrorCode;
use crate::math::interpolation;
use rust_decimal::Decimal;

pub trait FunctionLogic {
    const FUNCTION_TYPE: FunctionType;

    fn validate_load(x_in: Decimal, y_in: Decimal) -> Result<(Decimal, ValueCode)>;
    fn eval(fd: &FunctionData, x: Decimal, interp: Interpolation, saturating: bool) -> Result<Decimal>;

    fn proportion_difference(a: Decimal, b: Decimal) -> Result<Decimal> {
        if a.is_zero() || b.is_zero() {
            return Ok((a - b).abs());
        }

        Ok(((a / b) - Decimal::ONE).abs())
    }

    fn interpolate(fd: &FunctionData, x: Decimal, interp: Interpolation) -> Result<Decimal> {
        // get indices for the x value
        let (lower_index, upper_index, x_index_decimal) = fd.get_index_bounds(x)?;

        let (y, code) = if lower_index == upper_index {
            // if x lands exactly on an index

            let y = fd.get_value(lower_index)?;
            let code = fd.reduce_value_codes_from_indices(Vec::from([lower_index]))?;

            (y, code)
        } else {
            // get the data using the indices
            let lower_val = fd.get_value(lower_index)?;
            let upper_val = fd.get_value(upper_index)?;

            let point_a = (Decimal::from_u32(lower_index).unwrap(), lower_val);
            let point_b = (Decimal::from_u32(upper_index).unwrap(), upper_val);

            match interp {
                Interpolation::Linear => {
                    let value_code = fd.reduce_value_codes_from_indices(Vec::from([lower_index, upper_index]))?;

                    (interpolation::linear(point_a, point_b, x_index_decimal)?, value_code)
                }
                Interpolation::Quadratic => {
                    // determine if we can grab the point before the index pair or the point after
                    // if the index is 1 we still want to grab the 3rd index on the right side to avoid the NaN value at 0
                    let (point_c, code) = if lower_index < 2_u32 {
                        let next_index = upper_index.checked_add(1u32).unwrap();
                        let next_val = fd.get_value(next_index)?;

                        let value_code = fd.reduce_value_codes_from_indices(Vec::from([lower_index, upper_index, next_index]))?;

                        ((Decimal::from_u32(next_index).unwrap(), next_val), value_code)
                    } else {
                        let prev_index = lower_index.checked_sub(1u32).unwrap();
                        let prev_val = fd.get_value(prev_index)?;

                        let value_code = fd.reduce_value_codes_from_indices(Vec::from([lower_index, upper_index, prev_index]))?;

                        ((Decimal::from_u32(prev_index).unwrap(), prev_val), value_code)
                    };

                    (interpolation::quadratic(point_a, point_b, point_c, x_index_decimal)?, code)
                }
            }
        };

        if code == ValueCode::Empty {
            return err!(ErrorCode::EmptyData);
        }

        if code == ValueCode::NaN {
            return err!(ErrorCode::NaNData);
        }

        Ok(y)
    }
}
