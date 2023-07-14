import * as anchor from "@coral-xyz/anchor";
import {Decimal} from 'decimal.js';
import {assert} from "chai";
import {PublicKey} from "@solana/web3.js";
import {decimalJsToRustDecimalBytes, rustDecimalBytesToDecimalJs, TachyonClient} from "../app/dist";
import * as borsh from "borsh";

describe("tachyon", () => {
    const provider = anchor.AnchorProvider.local();
    anchor.setProvider(provider);

    const tachyonClient = new TachyonClient(provider, new PublicKey("tachANmkv5KXR1hSZKoVJ2s5wKrfdgFgb3638k6CvKQ"))

    const errorTolerance = new Decimal(0.0000000001)

    it("initialize", async () => {
        await txHandler(() => tachyonClient.initialize())
    })

    it("initExp", async () => {
        let domainStart = new Decimal(0)
        let domainEnd = new Decimal(66.5)
        await txHandler(() => tachyonClient.initExp(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
    })

    it("initLn", async () => {
        let domainStart = new Decimal(0)
        let domainEnd = new Decimal(100)
        await txHandler(() => tachyonClient.initLn(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
    })

    it("initLog10", async () => {
        let domainStart = new Decimal(0)
        let domainEnd = new Decimal(100)
        await txHandler(() => tachyonClient.initLog10(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
    })

    it("initSin", async () => {
        let domainStart = new Decimal(0)
        let domainEnd = Decimal.acos(-1).mul(2) // 2*pi
        await txHandler(() => tachyonClient.initSin(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
    })

    it("initCos", async () => {
        let domainStart = new Decimal(0)
        let domainEnd = Decimal.acos(-1).mul(2) // 2*pi
        await txHandler(() => tachyonClient.initCos(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
    })

    it("loadExp", async () => {
        await txHandler(() => tachyonClient.loadExp())
    })

    it("loadLn", async () => {
        await txHandler(() => tachyonClient.loadLn())
    })

    it("loadLog10", async () => {
        await txHandler(() => tachyonClient.loadLog10())
    })

    it("loadSin", async () => {
        await txHandler(() => tachyonClient.loadSin())
    })

    it("loadCos", async () => {
        await txHandler(() => tachyonClient.loadCos())
    })

    it("evalExp", async () => {
        let x = new Decimal(1)
        let tx = await txHandler(() => tachyonClient.evalExp(decimalJsToRustDecimalBytes(x)))

        let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

        let result = getDecimal(ctx)
        let error = (x.exp().sub(result)).abs().div(x.exp())

        console.log(error)

        // assert(error < errorTolerance)
    })

    it("evalLn", async () => {
        let x = new Decimal(1)
        let tx = await txHandler(() => tachyonClient.evalLn(decimalJsToRustDecimalBytes(x)))

        let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

        let result = getDecimal(ctx)
        let error = (x.ln().sub(result)).abs()

        console.log(error)

        // assert(error < errorTolerance)
    })

    it("evalLog10", async () => {
        let x = new Decimal(1)
        let tx = await txHandler(() => tachyonClient.evalLog10(decimalJsToRustDecimalBytes(x)))

        let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

        let result = getDecimal(ctx)
        let error = (x.log().sub(result)).abs()

        console.log(error)

        // assert(error < errorTolerance)
    })

    it("evalSin", async () => {
        let x = new Decimal(1)
        let tx = await txHandler(() => tachyonClient.evalSin(decimalJsToRustDecimalBytes(x)))

        let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

        let result = getDecimal(ctx)
        let error = (x.sin().sub(result)).abs()

        console.log(error)

        // assert(error < errorTolerance)
    })

    it("evalCos", async () => {
        let x = new Decimal(1)
        let tx = await txHandler(() => tachyonClient.evalCos(decimalJsToRustDecimalBytes(x)))

        let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

        let result = getDecimal(ctx)
        let error = (x.cos().sub(result)).abs()

        console.log(error)

        // assert(error < errorTolerance)
    })

    it("decimal utils", async () => {
        let testNums = [
            "2312312.443",
            "2312312.443000",
            "0002312312.443",
            "23123120000000000000000",
            "0.0000000000000000080123",

            "-2312312.443",
            "-2312312.443000",
            "-0002312312.443",
            "-23123120000000000000000",
            "-0.0000000000000000080123",
        ]

        // don't print strings in exp notation
        Decimal.set({ toExpPos: 1000, toExpNeg: -1000 })

        for (let n of testNums){
            let djs = new Decimal(n)
            let djsToRdToBytesAndBack = rustDecimalBytesToDecimalJs(decimalJsToRustDecimalBytes(djs))

            assert(djs.toString() === djsToRdToBytesAndBack.toString())
        }
    });

});

const getReturnLog = (confirmedTransaction) => {
    const prefix = "Program return: ";
    let log = confirmedTransaction.meta.logMessages.find((log) =>
        log.startsWith(prefix)
    );
    log = log.slice(prefix.length);
    const [key, data] = log.split(" ", 2);
    const buffer = Buffer.from(data, "base64");
    return [key, data, buffer];
};

const getDecimal = (t): Decimal => {
    const [key, data, buffer] = getReturnLog(t)
    const reader = new borsh.BinaryReader(buffer);
    const array = reader.readFixedArray(16);
    return rustDecimalBytesToDecimalJs(new Uint8Array(array))
};

export async function txHandler(handler: Function){
    await sleep(400)

    try {
        return await handler()
    } catch (e) {
        console.log(e)
    }
}

export async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
