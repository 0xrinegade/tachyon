"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCos = void 0;
const utils_1 = require("../utils");
const web3_js_1 = require("@solana/web3.js");
const initCos = async (program, provider, domainStart, domainEnd) => {
    const [functionsPda] = (0, utils_1.getFunctionsAddr)(program.programId);
    const f = web3_js_1.Keypair.generate();
    return program.methods
        .initCos(domainStart, domainEnd)
        .accounts({
        admin: provider.wallet.publicKey,
        functions: functionsPda,
        f: f.publicKey,
    })
        .preInstructions([
        await program.account.functionData.createInstruction(f),
    ])
        .signers([f])
        .rpc();
};
exports.initCos = initCos;
//# sourceMappingURL=initCos.js.map