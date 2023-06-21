"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TachyonClient = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const idl_1 = require("./idl");
const rpc_1 = require("./rpc");
const functions_1 = require("./state/functions");
class TachyonClient {
    provider;
    program;
    lut;
    constructor(provider, programId) {
        this.provider = provider;
        this.program = new anchor_1.Program(idl_1.IDL, programId, provider);
        this.lut = web3_js_1.PublicKey.default; // TODO
    }
    async initialize() {
        return (0, rpc_1.initialize)(this.program, this.provider);
    }
    async initExp(domainStart, domainEnd) {
        return (0, rpc_1.initExp)(this.program, this.provider, domainStart, domainEnd);
    }
    async initLn(domainStart, domainEnd) {
        return (0, rpc_1.initLn)(this.program, this.provider, domainStart, domainEnd);
    }
    async initLog10(domainStart, domainEnd) {
        return (0, rpc_1.initLog10)(this.program, this.provider, domainStart, domainEnd);
    }
    async initSin(domainStart, domainEnd) {
        return (0, rpc_1.initSin)(this.program, this.provider, domainStart, domainEnd);
    }
    async initCos(domainStart, domainEnd) {
        return (0, rpc_1.initCos)(this.program, this.provider, domainStart, domainEnd);
    }
    async initNormPdf(domainStart, domainEnd) {
        return (0, rpc_1.initNormPdf)(this.program, this.provider, domainStart, domainEnd);
    }
    async initNormCdf(domainStart, domainEnd) {
        return (0, rpc_1.initNormCdf)(this.program, this.provider, domainStart, domainEnd);
    }
    async initErf(domainStart, domainEnd) {
        return (0, rpc_1.initErf)(this.program, this.provider, domainStart, domainEnd);
    }
    async loadFunction(f) {
        return (0, rpc_1.funcLoad)(this.program, this.provider, f);
    }
    async loadExp() {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.loadFunction(functions.exp);
    }
    async loadLn() {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.loadFunction(functions.ln);
    }
    async loadLog10() {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.loadFunction(functions.log10);
    }
    async loadSin() {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.loadFunction(functions.sin);
    }
    async loadCos() {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.loadFunction(functions.cos);
    }
    async loadNormCdf() {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.loadFunction(functions.normPdf);
    }
    async loadNormPdf() {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.loadFunction(functions.normCdf);
    }
    async loadErf() {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.loadFunction(functions.erf);
    }
    async evaluateFunction(f, x) {
        return (0, rpc_1.funcEval)(this.program, this.provider, f, x);
    }
    async evalExp(x) {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.evaluateFunction(functions.exp, x);
    }
    async evalLn(x) {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.evaluateFunction(functions.ln, x);
    }
    async evalLog10(x) {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.evaluateFunction(functions.log10, x);
    }
    async evalSin(x) {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.evaluateFunction(functions.sin, x);
    }
    async evalCos(x) {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.evaluateFunction(functions.cos, x);
    }
    async evalNormPdf(x) {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.evaluateFunction(functions.normPdf, x);
    }
    async evalNormCdf(x) {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.evaluateFunction(functions.normCdf, x);
    }
    async evalErf(x) {
        const [functions] = await (0, functions_1.getFunctions)(this.program);
        return this.evaluateFunction(functions.erf, x);
    }
}
exports.TachyonClient = TachyonClient;
//# sourceMappingURL=TachyonClient.js.map