"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.getFunctionsAddr = void 0;
const web3_js_1 = require("@solana/web3.js");
const FUNCTIONS_SEED = "functions";
const getFunctionsAddr = (programId) => {
    return web3_js_1.PublicKey.findProgramAddressSync([(0, exports.encode)(FUNCTIONS_SEED)], programId);
};
exports.getFunctionsAddr = getFunctionsAddr;
const encode = (x) => Buffer.from(x);
exports.encode = encode;
//# sourceMappingURL=pda.js.map