use crate::{reduce_value_codes, FuncInit, FunctionData, FunctionDataAccessors, FunctionType, ValueCode, NUM_VALUES};
use anchor_lang::prelude::*;
use anchor_lang::ZeroCopy;
use num_traits::{FromPrimitive, ToPrimitive};
use rust_decimal::Decimal;

pub trait FunctionLogic {
    const FUNCTION_TYPE: FunctionType;

    fn eval_load(x: Decimal) -> Result<(Decimal, ValueCode)>;
    fn eval(fd: &FunctionData, x: Decimal) -> Result<(Decimal, ValueCode)>;
}
