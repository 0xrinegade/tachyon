import {ComputeBudgetProgram} from "@solana/web3.js";

export const addComputeUnits = () => ComputeBudgetProgram.setComputeUnitLimit({
    units: 1_400_000
});
