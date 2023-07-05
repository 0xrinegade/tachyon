import {PublicKey} from "@solana/web3.js";
import type {Program} from "@coral-xyz/anchor";
import {Tachyon as TachyonIDLType} from '../idl';
import {FunctionData} from "../types.js";

export const getFunctionData = async (
    program: Program<TachyonIDLType>,
    f: PublicKey,
): Promise<[FunctionData, PublicKey]> => {
    return [await program.account.functionData.fetch(f), f];
};
