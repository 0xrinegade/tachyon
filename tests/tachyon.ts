import * as anchor from "@coral-xyz/anchor";
import {Decimal} from 'decimal.js';
import {assert} from "chai";
import {Keypair, PublicKey} from "@solana/web3.js";
import {TachyonClient, decimalJsToRustDecimalBytes, rustDecimalBytesToDecimalJs} from "../app/dist";

describe("tachyon", () => {
    const provider = anchor.AnchorProvider.local();
    anchor.setProvider(provider);

    const tachyonClient = new TachyonClient(provider, new PublicKey("tachANmkv5KXR1hSZKoVJ2s5wKrfdgFgb3638k6CvKQ"))

    it("initialize", async () => {
        await txHandler(() => tachyonClient.initialize())
    })

    it("initExp", async () => {
        let domainStart = new Decimal(0)
        let domainEnd = new Decimal(50)
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

    // it("initNormPdf", async () => {
    //     let domainStart = new Decimal(-4.5)
    //     let domainEnd = new Decimal(4.5)
    //     await txHandler(() => tachyonClient.initNormPdf(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
    // })
    //
    // it("initNormCdf", async () => {
    //     let domainStart = new Decimal(-4.5)
    //     let domainEnd = new Decimal(4.5)
    //     await txHandler(() => tachyonClient.initNormCdf(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
    // })
    //
    // it("initErf", async () => {
    //     let domainStart = new Decimal(-4.5)
    //     let domainEnd = new Decimal(4.5)
    //     await txHandler(() => tachyonClient.initErf(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
    // })


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

    // it("loadNormPdf", async () => {
    //     await txHandler(() => tachyonClient.loadNormPdf())
    // })
    //
    // it("loadNormCdf", async () => {
    //     await txHandler(() => tachyonClient.loadNormCdf())
    // })
    //
    // it("loadErf", async () => {
    //     await txHandler(() => tachyonClient.loadErf())
    // })

    it("evalExp", async () => {
        let x = new Decimal(1)
        await txHandler(() => tachyonClient.evalExp(decimalJsToRustDecimalBytes(x)))
    })

    it("evalLn", async () => {
        let x = new Decimal(1)
        await txHandler(() => tachyonClient.evalLn(decimalJsToRustDecimalBytes(x)))
    })

    it("evalLog10", async () => {
        let x = new Decimal(1)
        await txHandler(() => tachyonClient.evalLog10(decimalJsToRustDecimalBytes(x)))
    })

    it("evalSin", async () => {
        let x = new Decimal(1)
        await txHandler(() => tachyonClient.evalSin(decimalJsToRustDecimalBytes(x)))
    })

    it("evalCos", async () => {
        let x = new Decimal(1)
        await txHandler(() => tachyonClient.evalCos(decimalJsToRustDecimalBytes(x)))
    })

    // it("evalNormPdf", async () => {
    //     let x = new Decimal(1)
    //     await txHandler(() => tachyonClient.evalNormPdf(decimalJsToRustDecimalBytes(x)))
    // })
    //
    // it("evalNormCdf", async () => {
    //     let x = new Decimal(1)
    //     await txHandler(() => tachyonClient.evalNormCdf(decimalJsToRustDecimalBytes(x)))
    // })
    //
    // it("evalErf", async () => {
    //     let x = new Decimal(1)
    //     await txHandler(() => tachyonClient.evalErf(decimalJsToRustDecimalBytes(x)))
    // })

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

export async function txHandler(handler: Function){
    await sleep(400)

    try {
        await handler()
    } catch (e) {
        console.log(e)
    }
}

export async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
