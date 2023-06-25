import {PublicKey} from "@solana/web3.js";
import type {Program} from "@coral-xyz/anchor";
import {Tachyon as TachyonIDLType} from '../idl';
import {FunctionData, Functions} from "../types.js";
import {getFunctionsAddr} from "../utils";

export const getFunctionData = async (
    program: Program<TachyonIDLType>,
    f: PublicKey,
): Promise<[FunctionData, PublicKey]> => {
    return [await program.account.functionData.fetch(f), f];
};
