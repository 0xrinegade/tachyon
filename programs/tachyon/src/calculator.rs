use anchor_lang::prelude::*;
use rust_decimal::Decimal;

use crate::error::ErrorCode;
use crate::state::*;

pub struct TachyonCalculator {
    // TODO:
    pub exp: Option<FunctionData>,
    pub ln: Option<FunctionData>,
    pub error_on_truncated_values: Option<bool>,
}

impl TachyonCalculator {
    // TODO:
    // pub fn function_eval<T: MathFunction>(&self, func_opt: &Option<T>, x: Decimal) -> Result<(Decimal, ValueCode)> {
    //     return match func_opt {
    //         None => err!(ErrorCode::MissingDataAccount),
    //         Some(f) => f.eval(x),
    //     };
    // }
    //
    // pub fn exp(&self, x: Decimal) -> Result<(Decimal, ValueCode)> {
    //     self.function_eval(&self.exp, x)
    // }
    //
    // pub fn ln(&self, x: Decimal) -> Result<(Decimal, ValueCode)> {
    //     self.function_eval(&self.ln, x)
    // }
    //
    // /// x^a = e^(a*ln(x))
    // pub fn pow(&self, x: Decimal, power: Decimal) -> Result<(Decimal, ValueCode)> {
    //     let (ln_y, ln_value_code) = self.function_eval(&self.ln, x)?;
    //
    //     // TODO: handle value code
    //
    //     self.function_eval(&self.exp, power * ln_y)
    // }
}
