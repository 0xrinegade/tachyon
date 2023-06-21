import type {AnchorProvider, Program} from "@coral-xyz/anchor";
import {Tachyon as TachyonIDLType} from '../idl';
import {getFunctionsAddr} from "../utils";

export const initialize = async (
    program: Program<TachyonIDLType>,
    provider: AnchorProvider,
): Promise<string> => {
    const [functionsPda] = getFunctionsAddr(program.programId);

    return program.methods
        .initialize()
        .accounts({
            admin: provider.wallet.publicKey,
            functions: functionsPda,
        })
        .rpc()
};
