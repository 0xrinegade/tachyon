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
    pub norm_pdf: Option<&'a FunctionData>,
    pub norm_cdf: Option<&'a FunctionData>,
    pub erf: Option<&'a FunctionData>,
}

impl<'a> TachyonCalculator<'a> {
    fn eval(&self, fd_opt: Option<&FunctionData>, x: Decimal) -> Result<(Decimal, ValueCode)> {
        match fd_opt {
            Some(fd) => fd.eval(x),
            None => err!(ErrorCode::MissingDataAccount),
        }
    }

    pub fn exp(&self, x: Decimal) -> Result<(Decimal, ValueCode)> {
        self.eval(self.exp, x)
    }

    pub fn ln(&self, x: Decimal) -> Result<(Decimal, ValueCode)> {
        self.eval(self.ln, x)
    }

    pub fn log10(&self, x: Decimal) -> Result<(Decimal, ValueCode)> {
        self.eval(self.log10, x)
    }

    pub fn sin(&self, x: Decimal) -> Result<(Decimal, ValueCode)> {
        self.eval(self.sin, x)
    }

    pub fn cos(&self, x: Decimal) -> Result<(Decimal, ValueCode)> {
        self.eval(self.cos, x)
    }

    /// tan(x) = sin(x)/cos(x)
    pub fn tan(&self, x: Decimal) -> Result<(Decimal, ValueCode)> {
        let (sin_y, sin_value_code) = self.sin(x)?;
        let (cos_y, cos_value_code) = self.cos(x)?;

        let return_value_code = reduce_value_codes(Vec::from([sin_value_code as u8, cos_value_code as u8]));

        let y = sin_y.checked_div(cos_y).unwrap();

        Ok((y, return_value_code))
    }

    pub fn norm_pdf(&self, x: Decimal) -> Result<(Decimal, ValueCode)> {
        self.eval(self.norm_pdf, x)
    }

    pub fn norm_cdf(&self, x: Decimal) -> Result<(Decimal, ValueCode)> {
        self.eval(self.norm_cdf, x)
    }

    pub fn erf(&self, x: Decimal) -> Result<(Decimal, ValueCode)> {
        self.eval(self.erf, x)
    }

    /// x^a = e^(a*ln(x))
    pub fn pow(&self, x: Decimal, power: Decimal) -> Result<(Decimal, ValueCode)> {
        let (ln_y, ln_value_code) = self.ln(x)?;

        // msg!("ln({:?})={:?}", x, ln_y);

        let exp_x = power.checked_mul(ln_y).unwrap();
        let (exp_y, exp_value_code) = self.exp(exp_x)?;

        // msg!("exp({:?})={:?}", exp_x, exp_y);

        let return_value_code = reduce_value_codes(Vec::from([ln_value_code as u8, exp_value_code as u8]));

        Ok((exp_y, return_value_code))
    }
}
