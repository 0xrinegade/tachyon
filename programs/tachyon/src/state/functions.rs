use crate::Pubkey;
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Functions {
    pub admin: Pubkey,
    pub initialized: bool,
    //
    pub exp: Pubkey,
    pub ln: Pubkey,
    pub log10: Pubkey,
    pub sin: Pubkey,
    pub cos: Pubkey,
    pub norm_pdf: Pubkey,
    pub norm_cdf: Pubkey,
    pub erf: Pubkey,
    //
    pub padding_0: Pubkey,
    pub padding_1: Pubkey,
    pub padding_2: Pubkey,
    pub padding_3: Pubkey,
    pub padding_4: Pubkey,
    pub padding_5: Pubkey,
    pub padding_6: Pubkey,
    pub padding_7: Pubkey,
    pub padding_8: Pubkey,
    pub padding_9: Pubkey,
}
