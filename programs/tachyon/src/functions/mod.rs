use crate::FunctionType;
use rust_decimal::Decimal;

pub use cos::*;
pub use erf::*;
pub use exp::*;
pub use function_logic::*;
pub use ln::*;
pub use log10::*;
pub use norm_cdf::*;
pub use norm_pdf::*;
pub use sin::*;

pub mod cos;
pub mod erf;
pub mod exp;
pub mod function_logic;
pub mod ln;
pub mod log10;
pub mod norm_cdf;
pub mod norm_pdf;
pub mod sin;

pub const LOAD_ERROR_TOLERANCE: Decimal = ONE_BILLIONTH;
pub const ONE_BILLIONTH: Decimal = Decimal::from_parts(1, 0, 0, false, 9);
