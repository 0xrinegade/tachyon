use anchor_lang::prelude::*;

use crate::error::ErrorCode;

use crate::accessors::*;
use crate::calculator::*;
use crate::error::*;
use crate::functions::*;
use crate::instructions::*;
use crate::state::*;

pub mod accessors;
pub mod calculator;
pub mod error;
pub mod functions;
pub mod instructions;
pub mod state;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod tachyon {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }

    pub fn func_load(ctx: Context<FuncLoad<FunctionData>>) -> Result<()> {
        FuncLoad::handler(ctx)
    }

    pub fn func_eval(ctx: Context<FuncEval<FunctionData>>, x_raw: [u8; 16]) -> Result<([u8; 16], u8)> {
        FuncEval::handler(ctx, x_raw)
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

    pub fn init_norm_pdf(ctx: Context<FuncInit<FunctionData>>, domain_start_raw: [u8; 16], domain_end_raw: [u8; 16]) -> Result<()> {
        if ctx.accounts.functions.norm_pdf == Pubkey::default() {
            ctx.accounts.functions.norm_pdf = ctx.accounts.f.key();
        } else {
            return err!(ErrorCode::AccountAlreadyInitialized);
        }
        FuncInit::handler(ctx, domain_start_raw, domain_end_raw, FunctionType::NormPdf)
    }

    pub fn init_norm_cdf(ctx: Context<FuncInit<FunctionData>>, domain_start_raw: [u8; 16], domain_end_raw: [u8; 16]) -> Result<()> {
        if ctx.accounts.functions.norm_cdf == Pubkey::default() {
            ctx.accounts.functions.norm_cdf = ctx.accounts.f.key();
        } else {
            return err!(ErrorCode::AccountAlreadyInitialized);
        }
        FuncInit::handler(ctx, domain_start_raw, domain_end_raw, FunctionType::NormCdf)
    }

    pub fn init_erf(ctx: Context<FuncInit<FunctionData>>, domain_start_raw: [u8; 16], domain_end_raw: [u8; 16]) -> Result<()> {
        if ctx.accounts.functions.erf == Pubkey::default() {
            ctx.accounts.functions.erf = ctx.accounts.f.key();
        } else {
            return err!(ErrorCode::AccountAlreadyInitialized);
        }
        FuncInit::handler(ctx, domain_start_raw, domain_end_raw, FunctionType::Erf)
    }
}
