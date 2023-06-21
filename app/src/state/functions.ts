import {PublicKey} from "@solana/web3.js";
import type {Program} from "@coral-xyz/anchor";
import {Tachyon as TachyonIDLType} from '../idl';
import {Functions} from "../types.js";
import {getFunctionsAddr} from "../utils";

export const getFunctions = async (
    program: Program<TachyonIDLType>,
): Promise<[Functions, PublicKey]> => {
    const [functionsPda] = getFunctionsAddr(program.programId);
    return [await program.account.functions.fetch(functionsPda), functionsPda];
};
