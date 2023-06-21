import type {AnchorProvider, Program} from "@coral-xyz/anchor";
import {Tachyon as TachyonIDLType} from '../idl';
import {getFunctionsAddr} from "../utils";
import {Keypair} from "@solana/web3.js";
import {getFunctions} from "../state/functions";

export const initLog10 = async (
    program: Program<TachyonIDLType>,
    provider: AnchorProvider,
    domainStart: number[],
    domainEnd: number[]
): Promise<string> => {
    const [functionsPda] = getFunctionsAddr(program.programId);
    const f = Keypair.generate();

    return program.methods
        .initLog10(domainStart, domainEnd)
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
