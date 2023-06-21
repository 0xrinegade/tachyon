import { PublicKey } from "@solana/web3.js";
import type { Program } from "@coral-xyz/anchor";
import { Tachyon as TachyonIDLType } from '../idl';
import { Functions } from "../types.js";
export declare const getFunctions: (program: Program<TachyonIDLType>) => Promise<[Functions, PublicKey]>;
