use anchor_lang::prelude::*;

use crate::accessors::*;
use crate::error::ErrorCode;
use crate::functions::*;
use crate::instructions::*;
use crate::state::*;

pub mod accessors;
pub mod calculator;
pub mod error;
pub mod functions;
pub mod instructions;
pub mod math;
pub mod state;

declare_id!("tachANmkv5KXR1hSZKoVJ2s5wKrfdgFgb3638k6CvKQ");

#[program]
pub mod tachyon {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }

    pub fn func_load(ctx: Context<FuncLoad<FunctionData>>, index: u32, x_in: [u8; 16], y_in: [u8; 16]) -> Result<()> {
        FuncLoad::handler(ctx, index, x_in, y_in)
    }

    pub fn func_eval(ctx: Context<FuncEval<FunctionData>>, x_raw: [u8; 16], interpolation: Interpolation, saturating: bool) -> Result<[u8; 16]> {
        FuncEval::handler(ctx, x_raw, interpolation, saturating)
    }

    pub fn init_exp(ctx: Context<FuncInit<FunctionData>>, domain_start_raw: [u8; 16], domain_end_raw: [u8; 16]) -> Result<()> {
        if ctx.accounts.functions.exp == Pubkey::default() {
            ctx.accounts.functions.exp = ctx.accounts.f.key();
        } else {
            return err!(ErrorCode::AccountAlreadyInitialized);
        }
        FuncInit::handler(ctx, domain_start_raw, domain_end_raw, FunctionType::Exp)
    }

    pub fn init_ln(ctx: Context<FuncInit<FunctionData>>, domain_start_raw: [u8; 16], domain_end_raw: [u8; 16]) -> Result<()> {
        if ctx.accounts.functions.ln == Pubkey::default() {
            ctx.accounts.functions.ln = ctx.accounts.f.key();
        } else {
            return err!(ErrorCode::AccountAlreadyInitialized);
        }
        FuncInit::handler(ctx, domain_start_raw, domain_end_raw, FunctionType::Ln)
    }

    pub fn init_log10(ctx: Context<FuncInit<FunctionData>>, domain_start_raw: [u8; 16], domain_end_raw: [u8; 16]) -> Result<()> {
        if ctx.accounts.functions.log10 == Pubkey::default() {
            ctx.accounts.functions.log10 = ctx.accounts.f.key();
        } else {
            return err!(ErrorCode::AccountAlreadyInitialized);
        }
        FuncInit::handler(ctx, domain_start_raw, domain_end_raw, FunctionType::Log10)
    }

    pub fn init_sin(ctx: Context<FuncInit<FunctionData>>, domain_start_raw: [u8; 16], domain_end_raw: [u8; 16]) -> Result<()> {
        if ctx.accounts.functions.sin == Pubkey::default() {
            ctx.accounts.functions.sin = ctx.accounts.f.key();
        } else {
            return err!(ErrorCode::AccountAlreadyInitialized);
        }
        FuncInit::handler(ctx, domain_start_raw, domain_end_raw, FunctionType::Sin)
    }

    pub fn init_cos(ctx: Context<FuncInit<FunctionData>>, domain_start_raw: [u8; 16], domain_end_raw: [u8; 16]) -> Result<()> {
        if ctx.accounts.functions.cos == Pubkey::default() {
            ctx.accounts.functions.cos = ctx.accounts.f.key();
        } else {
            return err!(ErrorCode::AccountAlreadyInitialized);
        }
        FuncInit::handler(ctx, domain_start_raw, domain_end_raw, FunctionType::Cos)
    }
}
