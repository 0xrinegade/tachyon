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
    fn eval(&self, fd_opt: Option<&FunctionData>, x: Decimal, interp: Interpolation, saturating: bool) -> Result<Decimal> {
        match fd_opt {
            Some(fd) => fd.eval(x, interp, saturating),
            None => err!(ErrorCode::MissingDataAccount),
        }
    }

    pub fn exp(&self, x: Decimal, interp: Interpolation, saturating: bool) -> Result<Decimal> {
        self.eval(self.exp, x, interp, saturating)
    }

    pub fn ln(&self, x: Decimal, interp: Interpolation) -> Result<Decimal> {
        self.eval(self.ln, x, interp, false)
    }

    pub fn log10(&self, x: Decimal, interp: Interpolation) -> Result<Decimal> {
        self.eval(self.log10, x, interp, false)
    }

    pub fn sin(&self, x: Decimal, interp: Interpolation) -> Result<Decimal> {
        self.eval(self.sin, x, interp, false)
    }

    pub fn cos(&self, x: Decimal, interp: Interpolation) -> Result<Decimal> {
        self.eval(self.cos, x, interp, false)
    }

    /// tan(x) = sin(x)/cos(x)
    pub fn tan(&self, x: Decimal, interp: Interpolation) -> Result<Decimal> {
        let sin_y = self.sin(x, interp)?;
        let cos_y = self.cos(x, interp)?;

        let y = sin_y.checked_div(cos_y).unwrap();

        Ok(y)
    }

    /// x^a = e^(a*ln(x))
    pub fn pow(&self, x: Decimal, power: Decimal, interp: Interpolation, saturating: bool) -> Result<Decimal> {
        let ln_y = self.ln(x, interp)?;

        let exp_x = if saturating {
            power.saturating_mul(ln_y)
        } else {
            power.checked_mul(ln_y).unwrap()
        };

        let exp_y = self.exp(exp_x, interp, saturating)?;

        Ok(exp_y)
    }
}
