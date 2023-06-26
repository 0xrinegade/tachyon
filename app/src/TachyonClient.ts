import {AnchorProvider, Program} from "@coral-xyz/anchor";
import {PublicKey} from "@solana/web3.js";
import {IDL, Tachyon as TachyonIDLType} from './idl';
import {funcEval, funcLoad, initCos, initExp, initialize, initLn, initLog10, initSin,} from "./rpc";
import {getFunctions} from "./state";
import {getFunctionData} from "./state/functionData";
import {chunk, rustDecimalBytesToDecimalJs, sleep} from "./utils";
import {Decimal} from "decimal.js";

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

    private async loadFunction(fData: PublicKey, fun: (d: Decimal) => Decimal, chunkSize) {
        let [functionData] = await getFunctionData(this.program, fData);

        const domainStart = rustDecimalBytesToDecimalJs(new Uint8Array(functionData.domainStart))
        const domainEnd = rustDecimalBytesToDecimalJs(new Uint8Array(functionData.domainEnd))

        const numValues = new Decimal(functionData.numValues)

        let emptyIndices = [...Array(numValues.toNumber()).keys()].filter((i) => {
            return functionData.valueCodes[i] == 0
        })

        while (emptyIndices.length > 0){
            console.log(emptyIndices.length, "values remaining to load..")

            for (let indices of chunk(emptyIndices, chunkSize)){
                console.log("\t #", indices[0])

                await Promise.all(indices.map(async (index_num) => {
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

}
