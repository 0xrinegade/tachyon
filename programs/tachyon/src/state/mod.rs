use anchor_lang::prelude::*;
use std::convert::TryInto;

use crate::FunctionLogic;

pub use function_data::*;
pub use functions::*;

pub mod function_data;
pub mod functions;

pub const NUM_VALUES: usize = 20; // 100_000; // (1_000_000 brings the account size to about 16MB > 10MB)

pub const FUNCTIONS_SEED: &[u8] = b"functions";

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, Default, Eq, PartialEq)]
pub enum FunctionType {
    #[default]
    None = 0,
    Exp = 1,
    Ln = 2,
    Log10 = 3,
    Sin = 4,
    Cos = 5,
    NormPdf = 6,
    NormCdf = 7,
    Erf = 8,
}

impl TryFrom<u32> for FunctionType {
    type Error = ();

    fn try_from(v: u32) -> std::result::Result<Self, Self::Error> {
        match v {
            x if x == FunctionType::None as u32 => Ok(FunctionType::None),
            x if x == FunctionType::Exp as u32 => Ok(FunctionType::Exp),
            x if x == FunctionType::Ln as u32 => Ok(FunctionType::Ln),
            x if x == FunctionType::Log10 as u32 => Ok(FunctionType::Log10),
            x if x == FunctionType::Sin as u32 => Ok(FunctionType::Sin),
            x if x == FunctionType::Cos as u32 => Ok(FunctionType::Cos),
            x if x == FunctionType::NormPdf as u32 => Ok(FunctionType::NormPdf),
            x if x == FunctionType::NormCdf as u32 => Ok(FunctionType::NormCdf),
            x if x == FunctionType::Erf as u32 => Ok(FunctionType::Erf),
            _ => Err(()),
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, Default, Eq, PartialEq)]
pub enum ValueCode {
    #[default]
    Empty = 0,

    Valid = 1,

    // for something like y=ln(0), which is negative infinity, it is replaced by Decimal::MIN
    // also present for ln(very_very_low_positive_number) where the result is less than Decimal::MIN (or situations where y is greater than Decimal::MAX)
    // the user can decide whether or not to use the returned value or to throw an error (option is set via the calc config, default is to throw an error)
    // this may be fine in cases where it is meant to be used in a fraction, since 1/Decimal::MAX ~ 0, but it depends on the use case
    Truncated = 2,
}

impl TryFrom<u8> for ValueCode {
    type Error = ();

    fn try_from(v: u8) -> std::result::Result<Self, Self::Error> {
        match v {
            x if x == ValueCode::Empty as u8 => Ok(ValueCode::Empty),
            x if x == ValueCode::Valid as u8 => Ok(ValueCode::Valid),
            x if x == ValueCode::Truncated as u8 => Ok(ValueCode::Truncated),
            _ => Err(()),
        }
    }
}

pub fn reduce_value_codes(rcs_as_u8: Vec<u8>) -> ValueCode {
    let rcs = rcs_as_u8.into_iter().map(|x| ValueCode::try_from(x).unwrap()).collect::<Vec<ValueCode>>();

    return if rcs.contains(&ValueCode::Empty) {
        ValueCode::Empty
    } else if rcs.contains(&ValueCode::Truncated) {
        ValueCode::Truncated
    } else {
        ValueCode::Valid
    };
}
