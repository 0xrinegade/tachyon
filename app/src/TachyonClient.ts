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
import {getFunctions} from "./state/functions";

export class TachyonClient {
    public readonly provider: AnchorProvider;
    public readonly program: Program<TachyonIDLType>;
    public readonly lut: PublicKey;

    constructor(
        provider: AnchorProvider,
        programId: PublicKey,
    ) {
        this.provider = provider;
        this.program = new Program<TachyonIDLType>(IDL, programId, provider);
        this.lut = PublicKey.default // TODO
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

    private async loadFunction(f: PublicKey) {
        return funcLoad(
            this.program,
            this.provider,
            f
        )
    }

    async loadExp() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.exp
        )
    }

    async loadLn() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.ln
        )
    }

    async loadLog10() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.log10
        )
    }

    async loadSin() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.sin
        )
    }

    async loadCos() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.cos
        )
    }

    async loadNormCdf() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.normPdf
        )
    }

    async loadNormPdf() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.normCdf
        )
    }

    async loadErf() {
        const [functions] = await getFunctions(this.program);
        return this.loadFunction(
            functions.erf
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
