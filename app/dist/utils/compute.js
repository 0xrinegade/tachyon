"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComputeUnits = void 0;
const web3_js_1 = require("@solana/web3.js");
const addComputeUnits = () => web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
    units: 1_400_000
});
exports.addComputeUnits = addComputeUnits;
//# sourceMappingURL=compute.js.map