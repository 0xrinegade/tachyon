import type {AnchorProvider, Program} from "@coral-xyz/anchor";
import {Tachyon as TachyonIDLType} from '../idl';
import {PublicKey} from "@solana/web3.js";
import {addComputeUnits, decimalJsToRustDecimalBytes, getFunctionsAddr} from "../utils";
import {Decimal} from "decimal.js";

export const funcLoad = async (
    program: Program<TachyonIDLType>,
    provider: AnchorProvider,
    f: PublicKey,
    index: number,
    x: Decimal,
    y: Decimal
): Promise<string> => {
    const [functionsPda] = getFunctionsAddr(program.programId);

    const x_raw = Array.from(decimalJsToRustDecimalBytes(x))
    const y_raw = Array.from(decimalJsToRustDecimalBytes(y))

    return program.methods
        .funcLoad(index, x_raw, y_raw)
        .accounts({
            admin: provider.wallet.publicKey,
            functions: functionsPda,
            f: f,
        })
        .preInstructions([addComputeUnits()])
        .rpc()
};
