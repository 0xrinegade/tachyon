"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.funcEval = void 0;
const utils_1 = require("../utils");
const funcEval = async (program, provider, f, x) => {
    const [functionsPda] = (0, utils_1.getFunctionsAddr)(program.programId);
    return program.methods
        .funcEval(x)
        .accounts({
        admin: provider.wallet.publicKey,
        functions: functionsPda,
        f: f,
    })
        .rpc();
};
exports.funcEval = funcEval;
//# sourceMappingURL=funcEval.js.map