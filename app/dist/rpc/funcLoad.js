"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.funcLoad = void 0;
const utils_1 = require("../utils");
const funcLoad = async (program, provider, f) => {
    const [functionsPda] = (0, utils_1.getFunctionsAddr)(program.programId);
    return program.methods
        .funcLoad()
        .accounts({
        admin: provider.wallet.publicKey,
        functions: functionsPda,
        f: f,
    })
        .preInstructions([(0, utils_1.addComputeUnits)()])
        .rpc();
};
exports.funcLoad = funcLoad;
//# sourceMappingURL=funcLoad.js.map