
use rust_decimal::Decimal;

pub use cos::*;
pub use exp::*;
pub use function_logic::*;
pub use ln::*;
pub use log10::*;
pub use sin::*;

pub mod cos;
pub mod exp;
pub mod function_logic;
pub mod ln;
pub mod log10;
pub mod sin;

pub const LOAD_ERROR_TOLERANCE: Decimal = ONE_BILLIONTH;
pub const ONE_BILLIONTH: Decimal = Decimal::from_parts(1, 0, 0, false, 9);
