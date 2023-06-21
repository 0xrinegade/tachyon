"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const utils_1 = require("../utils");
const initialize = async (program, provider) => {
    const [functionsPda] = (0, utils_1.getFunctionsAddr)(program.programId);
    return program.methods
        .initialize()
        .accounts({
        admin: provider.wallet.publicKey,
        functions: functionsPda,
    })
        .rpc();
};
exports.initialize = initialize;
//# sourceMappingURL=initialize.js.map