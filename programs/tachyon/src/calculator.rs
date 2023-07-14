use anchor_lang::prelude::*;
use rust_decimal::Decimal;

use crate::error::ErrorCode;
use crate::state::*;
use crate::FunctionDataAccessors;

pub struct TachyonCalculator<'a> {
    pub exp: Option<&'a FunctionData>,
    pub ln: Option<&'a FunctionData>,
    pub log10: Option<&'a FunctionData>,
    pub sin: Option<&'a FunctionData>,
    pub cos: Option<&'a FunctionData>,
}

impl<'a> TachyonCalculator<'a> {
    fn eval(&self, fd_opt: Option<&FunctionData>, x: Decimal, interp: Interpolation, saturating: bool) -> Result<(Decimal, ValueCode)> {
        match fd_opt {
            Some(fd) => fd.eval(x, interp, saturating),
            None => err!(ErrorCode::MissingDataAccount),
        }
    }

    pub fn exp(&self, x: Decimal, interp: Interpolation, saturating: bool) -> Result<(Decimal, ValueCode)> {
        self.eval(self.exp, x, interp, saturating)
    }

    pub fn ln(&self, x: Decimal, interp: Interpolation) -> Result<(Decimal, ValueCode)> {
        self.eval(self.ln, x, interp, false)
    }

    pub fn log10(&self, x: Decimal, interp: Interpolation) -> Result<(Decimal, ValueCode)> {
        self.eval(self.log10, x, interp, false)
    }

    pub fn sin(&self, x: Decimal, interp: Interpolation) -> Result<(Decimal, ValueCode)> {
        self.eval(self.sin, x, interp, false)
    }

    pub fn cos(&self, x: Decimal, interp: Interpolation) -> Result<(Decimal, ValueCode)> {
        self.eval(self.cos, x, interp, false)
    }

    /// tan(x) = sin(x)/cos(x)
    pub fn tan(&self, x: Decimal, interp: Interpolation) -> Result<(Decimal, ValueCode)> {
        let (sin_y, sin_value_code) = self.sin(x, interp)?;
        let (cos_y, cos_value_code) = self.cos(x, interp)?;

        let return_value_code = reduce_value_codes(Vec::from([sin_value_code as u8, cos_value_code as u8]));

        let y = sin_y.checked_div(cos_y).unwrap();

        Ok((y, return_value_code))
    }

    /// x^a = e^(a*ln(x))
    pub fn pow(&self, x: Decimal, power: Decimal, interp: Interpolation, saturating: bool) -> Result<(Decimal, ValueCode)> {
        let (ln_y, ln_value_code) = self.ln(x, interp)?;

        let exp_x = if saturating {
            power.saturating_mul(ln_y)
        } else {
            power.checked_mul(ln_y).unwrap()
        };

        let (exp_y, exp_value_code) = self.exp(exp_x, interp, saturating)?;

        let return_value_code = reduce_value_codes(Vec::from([ln_value_code as u8, exp_value_code as u8]));

        Ok((exp_y, return_value_code))
    }
}
