import {AnchorProvider, Program} from "@coral-xyz/anchor";
import {ConfirmOptions, PublicKey} from "@solana/web3.js";
import {IDL, Tachyon as TachyonIDLType} from './idl';
import {funcEval, funcLoad, funcLoadIx, initCos, initExp, initialize, initLn, initLog10, initSin,} from "./rpc";
import {getFunctionData, getFunctions} from "./state";
import {chunk, rustDecimalBytesToDecimalJs, sleep} from "./utils";
import {Decimal} from "decimal.js";
import {Interpolation} from "./types";

const DEFAULT_CHUNK_SIZE = 100;

export class TachyonClient {
    public readonly provider: AnchorProvider;
    public readonly program: Program<TachyonIDLType>;

    constructor(
        provider: AnchorProvider,
        programId: PublicKey,
    ) {
        this.provider = provider;
        this.program = new Program<TachyonIDLType>(IDL, programId, provider);

        Decimal.set({ precision: 28 })
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

    private async loadFunction(fData: PublicKey, fun: (d: Decimal) => Decimal, chunkSize: number) {
        let [functionData] = await getFunctionData(this.program, fData);

        const domainStart = rustDecimalBytesToDecimalJs(new Uint8Array(functionData.domainStart))
        const domainEnd = rustDecimalBytesToDecimalJs(new Uint8Array(functionData.domainEnd))

        const numValues = new Decimal(functionData.numValues)

        let emptyIndices = [...Array(numValues.toNumber()).keys()].filter((i) => {
            return functionData.valueCodes[i] == 0
        })

        while (emptyIndices.length > 0){
            console.log(emptyIndices.length, "values remaining to load..")

            const ixsPerTx = 5

            for (let indices of chunk(emptyIndices, chunkSize * ixsPerTx)){
                console.log("\t #", indices[0])

                await Promise.all(chunk(indices, ixsPerTx).map(async (chunk) => {
                    let bulk = chunk.slice(0, -1)
                    let lastVal = chunk.splice(-1)[0]

                    let ixs = await Promise.all(bulk.map(async (index_num) => {
                        const index = new Decimal(index_num)
                        const x = (index.div(numValues.sub(new Decimal(1)))).mul(domainEnd.sub(domainStart)).add(domainStart) // (index / (num_values - 1)) * (domainEnd - domainStart) + domainStart
                        let y = fun(x)

                        if (!y.isFinite()){
                            y = new Decimal(0)
                        }

                        return await funcLoadIx(
                            this.program,
                            this.provider,
                            fData,
                            index_num,
                            x,
                            y
                        )
                    }))

                    const index = new Decimal(lastVal)
                    const x = (index.div(numValues.sub(new Decimal(1)))).mul(domainEnd.sub(domainStart)).add(domainStart) // (index / (num_values - 1)) * (domainEnd - domainStart) + domainStart
                    let y = fun(x)

                    if (!y.isFinite()){
                        y = new Decimal(0)
                    }

                    await funcLoad(
                        this.program,
                        this.provider,
                        fData,
                        lastVal,
                        x,
                        y,
                        ixs
                    )
                }))
            }

            await sleep(500)

            functionData = (await getFunctionData(this.program, fData))[0];

            emptyIndices = [...Array(numValues.toNumber()).keys()].filter((i) => {
                return functionData.valueCodes[i] == 0
            })
        }
    }

    async loadExp(chunkSize = DEFAULT_CHUNK_SIZE) {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.exp,
            (d: Decimal) => d.exp(),
            chunkSize
        )
    }

    async loadLn(chunkSize = DEFAULT_CHUNK_SIZE) {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.ln,
            (d: Decimal) => d.ln(),
            chunkSize
        )
    }

    async loadLog10(chunkSize = DEFAULT_CHUNK_SIZE) {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.log10,
            (d: Decimal) => d.log(), // default is base 10 for Decimal.js
            chunkSize
        )
    }

    async loadSin(chunkSize = DEFAULT_CHUNK_SIZE) {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.sin,
            (d: Decimal) => d.sin(),
            chunkSize
        )
    }

    async loadCos(chunkSize = DEFAULT_CHUNK_SIZE) {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.cos,
            (d: Decimal) => d.cos(),
            chunkSize
        )
    }

    private async evaluateFunction(
        f: PublicKey,
        x: number[],
        interpolation: Interpolation = Interpolation.Quadratic,
        saturating: boolean = true,
    ) {
        return funcEval(
            this.program,
            this.provider,
            f,
            x,
            interpolation,
            saturating,
        )
    }

    async evalExp(
        x: number[],
        interpolation: Interpolation = Interpolation.Quadratic,
        saturating: boolean = true,
    ) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.exp,
            x,
            interpolation,
            saturating,
        )
    }

    async evalLn(
        x: number[],
        interpolation: Interpolation = Interpolation.Quadratic,
    ) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.ln,
            x,
            interpolation,
        )
    }

    async evalLog10(
        x: number[],
        interpolation: Interpolation = Interpolation.Quadratic,
    ) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.log10,
            x,
            interpolation,
        )
    }

    async evalSin(
        x: number[],
        interpolation: Interpolation = Interpolation.Quadratic,
    ) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.sin,
            x,
            interpolation,
        )
    }

    async evalCos(
        x: number[],
        interpolation: Interpolation = Interpolation.Quadratic,
    ) {
        const [functions] = await getFunctions(this.program);
        return this.evaluateFunction(
            functions.cos,
            x,
            interpolation,
        )
    }

}
