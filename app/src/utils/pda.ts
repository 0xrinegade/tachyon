import {AccountMeta, PublicKey} from "@solana/web3.js";

const FUNCTIONS_SEED = "functions"

export const getFunctionsAddr = (
    programId: PublicKey,
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [encode(FUNCTIONS_SEED)],
        programId,
    );
};

export const encode = (x: string) => Buffer.from(x)
