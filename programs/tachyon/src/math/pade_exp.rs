use anchor_lang::prelude::*;
use rust_decimal::Decimal;

pub fn pade_exp(x: Decimal) -> Result<Decimal> {
    let mut nu = Decimal::ZERO;
    let mut de = Decimal::ZERO;

    let mut x_pow = Decimal::ONE;
    let mut de_sign = Decimal::ONE;

    for pt in PADE_APPROXIMANT.iter() {
        let nu_diff = x_pow.checked_mul(*pt).unwrap();
        let de_diff = nu_diff.checked_mul(de_sign).unwrap();

        de_sign = de_sign.checked_mul(-Decimal::ONE).unwrap();

        nu = nu.checked_add(nu_diff).unwrap();
        de = de.checked_add(de_diff).unwrap();

        x_pow = x_pow.checked_mul(x).unwrap();
    }

    let y = nu.checked_div(de).unwrap();

    Ok(y)
}

/// Pade Approximation to Exp (11)
///
///  (x^11 + 132 x^10 + 8580 x^9 + 360360 x^8 + 10810800 x^7 + 242161920 x^6 + 4116752640 x^5 + 52929676800 x^4 + 502831929600 x^3 + 3352212864000 x^2 + 14079294028800 x + 28158588057600)/
/// (-x^11 + 132 x^10 - 8580 x^9 + 360360 x^8 - 10810800 x^7 + 242161920 x^6 - 4116752640 x^5 + 52929676800 x^4 - 502831929600 x^3 + 3352212864000 x^2 - 14079294028800 x + 28158588057600)
///
/// https://www.wolframalpha.com/input?i=PadeApproximant%5BExp%5Bx%5D%2C%7Bx%2C0%2C%7B11%2C11%7D%7D%5D

const PADE_APPROXIMANT: [Decimal; 12] = [
    Decimal::from_parts(782465024, 6556, 0, false, 0),
    Decimal::from_parts(391232512, 3278, 0, false, 0),
    Decimal::from_parts(2138373120, 780, 0, false, 0),
    Decimal::from_parts(320755968, 117, 0, false, 0),
    Decimal::from_parts(1390069248, 12, 0, false, 0),
    Decimal::from_parts(4116752640, 0, 0, false, 0),
    Decimal::from_parts(242161920, 0, 0, false, 0),
    Decimal::from_parts(10810800, 0, 0, false, 0),
    Decimal::from_parts(360360, 0, 0, false, 0),
    Decimal::from_parts(8580, 0, 0, false, 0),
    Decimal::from_parts(132, 0, 0, false, 0),
    Decimal::from_parts(1, 0, 0, false, 0),
];

#[cfg(test)]
mod tests {
    use super::*;
    use fast_math::exp;
    use num_traits::{FromPrimitive, ToPrimitive};
    use rust_decimal::MathematicalOps;

    #[test]
    /// It looks like the Decimal::exp function overflows at around x=12.0, and the 11th order Pade approximation still isn't great for x>12, and higher orders require numbers bigger than Decimal::MAX.
    /// For this reason it makes sense to switch the exp calculations (and perhaps all calculations) off-chain, and just approximately verify on-chain while loading.
    fn exp_compare() {
        let x = Decimal::from_f32(11.7).unwrap();

        println!("f32::exp     {:?}", Decimal::from_f32(exp(x.to_f32().unwrap())).unwrap());
        println!("Decimal::exp {:?}", x.exp());
        println!("pade_exp     {:?}", pade_exp(x).unwrap());
    }
}
