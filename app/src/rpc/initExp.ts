import type {AnchorProvider, Program} from "@coral-xyz/anchor";
import {Tachyon as TachyonIDLType} from '../idl';
import {getFunctionsAddr} from "../utils";
import {Keypair} from "@solana/web3.js";

export const initExp = async (
    program: Program<TachyonIDLType>,
    provider: AnchorProvider,
    domainStart: number[],
    domainEnd: number[]
): Promise<string> => {
    const [functionsPda] = getFunctionsAddr(program.programId);
    const f = Keypair.generate();

    return program.methods
        .initExp(domainStart, domainEnd)
        .accounts({
            admin: provider.wallet.publicKey,
            functions: functionsPda,
            f: f.publicKey,
        })
        .preInstructions([
            await program.account.functionData.createInstruction(f),
        ])
        .signers([f])
        .rpc()
};
