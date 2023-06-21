import type {AnchorProvider, Program} from "@coral-xyz/anchor";
import {Tachyon as TachyonIDLType} from '../idl';
import {PublicKey} from "@solana/web3.js";
import {addComputeUnits, getFunctionsAddr} from "../utils";

export const funcLoad = async (
    program: Program<TachyonIDLType>,
    provider: AnchorProvider,
    f: PublicKey,
): Promise<string> => {
    const [functionsPda] = getFunctionsAddr(program.programId);

    return program.methods
        .funcLoad()
        .accounts({
            admin: provider.wallet.publicKey,
            functions: functionsPda,
            f: f,
        })
        .preInstructions([addComputeUnits()])
        .rpc()
};
