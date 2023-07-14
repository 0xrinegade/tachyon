import type {AnchorProvider, Program} from "@coral-xyz/anchor";
import {Tachyon as TachyonIDLType} from '../idl';
import {getFunctionsAddr} from "../utils";
import {ConfirmOptions, PublicKey} from "@solana/web3.js";
import {Interpolation} from "../types";

export const funcEval = async (
    program: Program<TachyonIDLType>,
    provider: AnchorProvider,
    f: PublicKey,
    x: number[],
    interpolation: Interpolation = Interpolation.Quadratic,
    saturating: boolean = true,
    confirmOptions: ConfirmOptions = { commitment: "confirmed", skipPreflight: true }
): Promise<string> => {
    const [functionsPda] = getFunctionsAddr(program.programId);

    return program.methods
        .funcEval(x, { [interpolation.valueOf()]: {} }, saturating)
        .accounts({
            user: provider.wallet.publicKey,
            functions: functionsPda,
            f: f,
        })
        .rpc(confirmOptions)
};
