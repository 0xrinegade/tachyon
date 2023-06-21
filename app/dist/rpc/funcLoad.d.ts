import type { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Tachyon as TachyonIDLType } from '../idl';
import { PublicKey } from "@solana/web3.js";
export declare const funcLoad: (program: Program<TachyonIDLType>, provider: AnchorProvider, f: PublicKey) => Promise<string>;
