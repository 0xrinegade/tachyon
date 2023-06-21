"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctions = void 0;
const utils_1 = require("../utils");
const getFunctions = async (program) => {
    const [functionsPda] = (0, utils_1.getFunctionsAddr)(program.programId);
    return [await program.account.functions.fetch(functionsPda), functionsPda];
};
exports.getFunctions = getFunctions;
//# sourceMappingURL=functions.js.map