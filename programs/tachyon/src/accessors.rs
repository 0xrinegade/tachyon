use crate::{reduce_value_codes, FunctionType, ValueCode, NUM_VALUES};
use anchor_lang::prelude::*;
use num_traits::{FromPrimitive, ToPrimitive};
use rust_decimal::Decimal;

pub trait FunctionDataAccessors {
    fn eval(&self, x: Decimal) -> Result<(Decimal, ValueCode)>;
    fn eval_load(&self, x: Decimal) -> Result<(Decimal, ValueCode)>;

    fn get_values_array(&self) -> &[[u8; 16]; NUM_VALUES];
    fn get_value_codes_array(&self) -> &[u8; NUM_VALUES];

    fn get_values_array_mut(&mut self) -> &mut [[u8; 16]; NUM_VALUES];
    fn get_value_codes_array_mut(&mut self) -> &mut [u8; NUM_VALUES];

    fn get_function_type(&self) -> u32;
    fn set_function_type(&mut self, ft: FunctionType) -> Result<()>;

    fn get_domain_start(&self) -> Result<Decimal>;
    fn set_domain_start(&mut self, domain_start_raw: [u8; 16]) -> Result<()>;

    fn get_domain_end(&self) -> Result<Decimal>;
    fn set_domain_end(&mut self, domain_end_raw: [u8; 16]) -> Result<()>;

    fn get_interval(&self) -> Result<Decimal>;
    fn set_interval(&mut self, interval: [u8; 16]) -> Result<()>;

    fn get_next_index(&self) -> u32;
    fn set_next_index(&mut self, new_index: u32) -> Result<()>;

    fn get_is_initialized(&self) -> bool;
    fn set_initialized_true(&mut self) -> Result<()>;

    fn set_value(&mut self, index: u32, value: [u8; 16], value_code: u8) -> Result<()> {
        self.get_values_array_mut()[index as usize] = value;
        self.get_value_codes_array_mut()[index as usize] = value_code;

        Ok(())
    }

    fn get_value(&self, index: u32) -> Result<Decimal> {
        Ok(Decimal::deserialize(self.get_values_array()[index as usize]))
    }

    fn get_value_code(&self, index: u32) -> Result<u8> {
        Ok(self.get_value_codes_array()[index as usize])
    }

    fn reduce_value_codes_from_indices(&self, indices: Vec<u32>) -> Result<ValueCode> {
        let codes = indices.into_iter().map(|x| self.get_value_code(x).unwrap()).collect::<Vec<u8>>();
        Ok(reduce_value_codes(codes))
    }

    fn get_domain(&self) -> Result<Decimal> {
        let domain = (self.get_domain_end()? - self.get_domain_start()?).abs();
        Ok(domain)
    }

    fn increment_next_index(&mut self) -> Result<()> {
        self.set_next_index(self.get_next_index().checked_add(1u32).unwrap())
    }

    fn get_x_from_index(&self, index: u32) -> Result<Decimal> {
        let index_prop = Decimal::from_u32(index).unwrap() / self.get_num_values()?;
        let x = index_prop * self.get_interval()? + self.get_domain_start()?;
        Ok(x)
    }

    fn get_num_values(&self) -> Result<Decimal> {
        let num_values = Decimal::from_usize(NUM_VALUES).unwrap();
        Ok(num_values)
    }

    fn get_index_bounds(&self, x: Decimal) -> Result<(u32, u32)> {
        let domain_start = self.get_domain_start()?;
        let domain_end = self.get_domain_end()?;
        let num_values = self.get_num_values()?;

        // decimal value of the index based on the domain range
        let index_decimal = ((x - domain_start) / (domain_end - domain_start)) * (num_values - Decimal::ONE);

        // round the decimal value into the nearest lower and higher index numbers
        let lower_index = index_decimal.floor().to_u32().unwrap();
        let upper_index = index_decimal.ceil().to_u32().unwrap();

        Ok((lower_index, upper_index))
    }
}
