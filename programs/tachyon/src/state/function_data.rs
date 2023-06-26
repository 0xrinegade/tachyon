use crate::state::NUM_VALUES;
use crate::{reduce_value_codes, Cos, Exp, FunctionDataAccessors, FunctionLogic, FunctionType, Ln, Log10, Pubkey, Sin, ValueCode};
use anchor_lang::prelude::*;
use num_traits::{FromPrimitive, Inv, ToPrimitive};
use rust_decimal::{Decimal, MathematicalOps};
use std::ops::Rem;

use crate::error::ErrorCode;

#[account(zero_copy)]
pub struct FunctionData {
    pub initialized: u32,
    pub domain_start: [u8; 16],
    pub domain_end: [u8; 16],
    pub interval: [u8; 16],
    pub values: [[u8; 16]; NUM_VALUES],
    pub value_codes: [u8; NUM_VALUES],
    pub num_values: u32,
    pub num_values_loaded: u32,
    pub function_type: u32,
}

impl FunctionDataAccessors for FunctionData {
    fn eval(&self, x: Decimal) -> Result<(Decimal, ValueCode)> {
        let function_type = FunctionType::try_from(self.function_type).unwrap();

        match function_type {
            FunctionType::Exp => Exp::eval(self, x),
            FunctionType::Ln => Ln::eval(self, x),
            FunctionType::Log10 => Log10::eval(self, x),
            FunctionType::Sin => Sin::eval(self, x),
            FunctionType::Cos => Cos::eval(self, x),
            _ => err!(ErrorCode::MissingImplementation),
        }
    }

    fn eval_load(&self, x_in: Decimal, y_in: Decimal) -> Result<(Decimal, ValueCode)> {
        let function_type = FunctionType::try_from(self.function_type).unwrap();

        match function_type {
            FunctionType::Exp => Exp::validate_load(x_in, y_in),
            FunctionType::Ln => Ln::validate_load(x_in, y_in),
            FunctionType::Log10 => Log10::validate_load(x_in, y_in),
            FunctionType::Sin => Sin::validate_load(x_in, y_in),
            FunctionType::Cos => Cos::validate_load(x_in, y_in),
            _ => err!(ErrorCode::MissingImplementation),
        }
    }

    fn get_values_array(&self) -> &[[u8; 16]; NUM_VALUES] {
        &self.values
    }

    fn get_value_codes_array(&self) -> &[u8; NUM_VALUES] {
        &self.value_codes
    }

    fn get_values_array_mut(&mut self) -> &mut [[u8; 16]; NUM_VALUES] {
        &mut self.values
    }

    fn get_value_codes_array_mut(&mut self) -> &mut [u8; NUM_VALUES] {
        &mut self.value_codes
    }

    fn get_function_type(&self) -> u32 {
        self.function_type
    }

    fn set_function_type(&mut self, ft: FunctionType) -> Result<()> {
        self.function_type = ft as u32;
        Ok(())
    }

    fn get_domain_start(&self) -> Result<Decimal> {
        let domain_start = Decimal::deserialize(self.domain_start);
        Ok(domain_start)
    }

    fn set_domain_start(&mut self, domain_start_raw: [u8; 16]) -> Result<()> {
        self.domain_start = domain_start_raw;
        Ok(())
    }

    fn get_domain_end(&self) -> Result<Decimal> {
        let domain_end = Decimal::deserialize(self.domain_end);
        Ok(domain_end)
    }

    fn set_domain_end(&mut self, domain_end_raw: [u8; 16]) -> Result<()> {
        self.domain_end = domain_end_raw;
        Ok(())
    }

    fn get_interval(&self) -> Result<Decimal> {
        let interval = Decimal::deserialize(self.interval);
        Ok(interval)
    }

    fn set_interval(&mut self, interval: [u8; 16]) -> Result<()> {
        self.interval = interval;
        Ok(())
    }

    fn get_num_values_loaded(&self) -> u32 {
        self.num_values_loaded
    }

    fn increment_num_values_loaded(&mut self) -> Result<()> {
        self.num_values_loaded += 1u32;
        Ok(())
    }

    fn get_is_initialized(&self) -> bool {
        self.initialized != 0u32
    }

    fn set_initialized_true(&mut self) -> Result<()> {
        self.initialized = 1u32;
        Ok(())
    }

    fn get_num_values(&self) -> Result<u32> {
        Ok(self.num_values)
    }

    fn set_num_values(&mut self, num_values: u32) -> Result<()> {
        self.num_values = num_values;
        Ok(())
    }
}
