use anchor_lang::prelude::*;
use rust_decimal::Decimal;

pub fn linear(point_0: (Decimal, Decimal), point_1: (Decimal, Decimal), x: Decimal) -> Result<Decimal> {
    let y = (point_0.1 * (point_1.0 - x) + point_1.1 * (x - point_0.0)) / (point_1.0 - point_0.0);

    Ok(y)
}

pub fn quadratic(point_0: (Decimal, Decimal), point_1: (Decimal, Decimal), point_2: (Decimal, Decimal), x: Decimal) -> Result<Decimal> {
    let diff10 = (point_1.1 - point_0.1) / (point_1.0 - point_0.0);
    let diff21 = (point_2.1 - point_1.1) / (point_2.0 - point_1.0);
    let c = point_0.1;
    let b = diff10;
    let a = (diff21 - diff10) / (point_2.0 - point_0.0);

    let y = a * (x - point_1.0) * (x - point_0.0) + b * (x - point_0.0) + c;

    Ok(y)
}

#[cfg(test)]
mod tests {
    use super::*;
    use num_traits::FromPrimitive;

    #[test]
    fn linear_test() {
        let result = linear(
            (Decimal::TEN, Decimal::ZERO),
            (Decimal::from_f32(11.0_f32).unwrap(), Decimal::TEN),
            Decimal::from_f32(10.2_f32).unwrap(),
        )
        .unwrap();

        assert_eq!(Decimal::TWO, result);
    }

    #[test]
    fn quadratic_test() {
        let result = quadratic(
            (Decimal::ZERO, Decimal::from_f32(4.0_f32).unwrap()),
            (Decimal::TWO, Decimal::ZERO),
            (-Decimal::TWO, Decimal::ZERO),
            Decimal::ONE,
        )
        .unwrap();

        assert_eq!(Decimal::from_f32(3.0_f32).unwrap(), result);
    }
}
