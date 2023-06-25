import {AnchorProvider, Program} from "@coral-xyz/anchor";
import {PublicKey} from "@solana/web3.js";
import {IDL, Tachyon as TachyonIDLType} from './idl';
import {
    funcEval,
    funcLoad,
    initCos,
    initErf,
    initExp,
    initialize,
    initLn,
    initLog10,
    initNormCdf,
    initNormPdf,
    initSin,
} from "./rpc";
import {getFunctions} from "./state";
import {getFunctionData} from "./state/functionData";
import {FunctionData} from "./types";
import {rustDecimalBytesToDecimalJs} from "./utils";
import {Decimal} from "decimal.js";

export class TachyonClient {
    public readonly provider: AnchorProvider;
    public readonly program: Program<TachyonIDLType>;

    constructor(
        provider: AnchorProvider,
        programId: PublicKey,
    ) {
        this.provider = provider;
        this.program = new Program<TachyonIDLType>(IDL, programId, provider);
    }

    async initialize() {
        return initialize(
            this.program,
            this.provider,
        )
    }

    async initExp(domainStart: number[], domainEnd: number[]) {
        return initExp(
            this.program,
            this.provider,
            domainStart,
            domainEnd,
        )
    }

    async initLn(domainStart: number[], domainEnd: number[]) {
        return initLn(
            this.program,
            this.provider,
            domainStart,
            domainEnd,
        )
    }

    async initLog10(domainStart: number[], domainEnd: number[]) {
        return initLog10(
            this.program,
            this.provider,
            domainStart,
            domainEnd,
        )
    }

    async initSin(domainStart: number[], domainEnd: number[]) {
        return initSin(
            this.program,
            this.provider,
            domainStart,
            domainEnd,
        )
    }

    async initCos(domainStart: number[], domainEnd: number[]) {
        return initCos(
            this.program,
            this.provider,
            domainStart,
            domainEnd,
        )
    }

    async initNormPdf(domainStart: number[], domainEnd: number[]) {
        return initNormPdf(
            this.program,
            this.provider,
            domainStart,
            domainEnd,
        )
    }

    async initNormCdf(domainStart: number[], domainEnd: number[]) {
        return initNormCdf(
            this.program,
            this.provider,
            domainStart,
            domainEnd,
        )
    }

    async initErf(domainStart: number[], domainEnd: number[]) {
        return initErf(
            this.program,
            this.provider,
            domainStart,
            domainEnd,
        )
    }

    private async loadFunction(fData: PublicKey, fun: (d: Decimal) => Decimal) {
        const [functionData] = await getFunctionData(this.program, fData);

        const domainStart = rustDecimalBytesToDecimalJs(new Uint8Array(functionData.domainStart))
        const domainEnd = rustDecimalBytesToDecimalJs(new Uint8Array(functionData.domainEnd))

        const numValues = new Decimal(functionData.numValues)

        return await Promise.all([...Array(numValues.toNumber()).keys()].map(async (index_num) => {
            const index = new Decimal(index_num)
            const x = (index.div(numValues)).mul(domainEnd.sub(domainStart)).add(domainStart) // (index / num_values) * (domainEnd - domainStart) + domainStart
            let y = fun(x)

            if (!y.isFinite()){
                y = new Decimal(0)
            }

            await funcLoad(
                this.program,
                this.provider,
                fData,
                index_num,
                x,
                y
            )
        }))
    }

    async loadExp() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.exp,
            (d: Decimal) => d.exp()
        )
    }

    async loadLn() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.ln,
            (d: Decimal) => d.ln()
        )
    }

    async loadLog10() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.log10,
            (d: Decimal) => d.log() // default is base 10 for Decimal.js
        )
    }

    async loadSin() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.sin,
            (d: Decimal) => d.sin()
        )
    }

    async loadCos() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.cos,
            (d: Decimal) => d.cos()
        )
    }

    // async loadNormCdf() {
    //     const [functions] = await getFunctions(this.program);
    //     return this.loadFunction(
    //         functions.normPdf
    //     )
    // }
    //
    // async loadNormPdf() {
    //     const [functions] = await getFunctions(this.program);
    //     return this.loadFunction(
    //         functions.normCdf
    //     )
    // }
    //
    // async loadErf() {
    //     const [functions] = await getFunctions(this.program);
    //     return this.loadFunction(
    //         functions.erf
    //     )
    // }


    private async evaluateFunction(f: PublicKey, x: number[]) {
        return funcEval(
            this.program,
            this.provider,
            f,
            x
        )
    }

    async evalExp(x: number[]) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.exp,
            x
        )
    }

    async evalLn(x: number[]) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.ln,
            x
        )
    }

    async evalLog10(x: number[]) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.log10,
            x
        )
    }

    async evalSin(x: number[]) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.sin,
            x
        )
    }

    async evalCos(x: number[]) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.cos,
            x
        )
    }

    async evalNormPdf(x: number[]) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.normPdf,
            x
        )
    }

    async evalNormCdf(x: number[]) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.normCdf,
            x
        )
    }

    async evalErf(x: number[]) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.erf,
            x
        )
    }

}
