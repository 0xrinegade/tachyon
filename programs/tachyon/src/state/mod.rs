use anchor_lang::prelude::*;

pub use function_data::*;
pub use functions::*;

pub mod function_data;
pub mod functions;

pub const NUM_VALUES: usize = 200000; // (1,000,000 brings the account size to about 16MB > 10MB)

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
            _ => Err(()),
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, Default, Eq, PartialEq)]
pub enum ValueCode {
    #[default]
    Empty = 0,
    Valid = 1,
    NaN = 2,
}

impl TryFrom<u8> for ValueCode {
    type Error = ();

    fn try_from(v: u8) -> std::result::Result<Self, Self::Error> {
        match v {
            x if x == ValueCode::Empty as u8 => Ok(ValueCode::Empty),
            x if x == ValueCode::Valid as u8 => Ok(ValueCode::Valid),
            x if x == ValueCode::NaN as u8 => Ok(ValueCode::NaN),
            _ => Err(()),
        }
    }
}

pub fn reduce_value_codes(rcs_as_u8: Vec<u8>) -> ValueCode {
    let rcs = rcs_as_u8.into_iter().map(|x| ValueCode::try_from(x).unwrap()).collect::<Vec<ValueCode>>();

    if rcs.contains(&ValueCode::Empty) {
        ValueCode::Empty
    } else if rcs.contains(&ValueCode::NaN) {
        ValueCode::NaN
    } else {
        ValueCode::Valid
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, Default, Eq, PartialEq)]
pub enum Interpolation {
    #[default]
    Linear,
    Quadratic,
}
