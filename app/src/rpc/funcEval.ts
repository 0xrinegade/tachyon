import type {AnchorProvider, Program} from "@coral-xyz/anchor";
import {Tachyon as TachyonIDLType} from '../idl';
import {getFunctionsAddr} from "../utils";
import {PublicKey} from "@solana/web3.js";

export const funcEval = async (
    program: Program<TachyonIDLType>,
    provider: AnchorProvider,
    f: PublicKey,
    x: number[]
): Promise<string> => {
    const [functionsPda] = getFunctionsAddr(program.programId);

    return program.methods
        .funcEval(x)
        .accounts({
            admin: provider.wallet.publicKey,
            functions: functionsPda,
            f: f,
        })
        .rpc()
};
