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

        await provider.connection.confirmTransaction(tx, "confirmed");
        let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

        let result = getDecimal(ctx)
        console.log(result)
    })

    it("evalLn", async () => {
        let x = new Decimal(1)
        let tx = await txHandler(() => tachyonClient.evalLn(decimalJsToRustDecimalBytes(x)))

        await provider.connection.confirmTransaction(tx, "confirmed");
        let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

        let result = getDecimal(ctx)
        console.log(result)
    })

    it("evalLog10", async () => {
        let x = new Decimal(1)
        let tx = await txHandler(() => tachyonClient.evalLog10(decimalJsToRustDecimalBytes(x)))

        await provider.connection.confirmTransaction(tx, "confirmed");
        let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

        let result = getDecimal(ctx)
        console.log(result)
    })

    it("evalSin", async () => {
        let x = new Decimal(1)
        let tx = await txHandler(() => tachyonClient.evalSin(decimalJsToRustDecimalBytes(x)))

        await provider.connection.confirmTransaction(tx, "confirmed");
        let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

        let result = getDecimal(ctx)
        console.log(result)
    })

    it("evalCos", async () => {
        let x = new Decimal(1)
        let tx = await txHandler(() => tachyonClient.evalCos(decimalJsToRustDecimalBytes(x)))

        await provider.connection.confirmTransaction(tx, "confirmed");
        let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

        let result = getDecimal(ctx)
        console.log(result)
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

const getDecimal = (ctx): Decimal => {
    const data = ctx.meta.returnData.data
    const buffer = Buffer.from(data[0], data[1]);

    const reader = new borsh.BinaryReader(buffer);
    let array = reader.readFixedArray(buffer.length);

    // TODO: there has to be a better way to do this, somehow the last trailing 0 in the buffer or rpc return is getting cut off (see comment at end of file)
    while (array.length < 16){
        array = new Uint8Array([...array, 0])
    }

    return rustDecimalBytesToDecimalJs(array)
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

/*
[ 'AAAcAH4rdK/9Jwcmtqa+Vw==', 'base64' ]
<Buffer 00 00 1c 00 7e 2b 74 af fd 27 07 26 b6 a6 be 57>
2.715567903306758116729606438
    ✔ evalExp (925ms)
[ 'AAAcgMF98MeLdq7n4TQI', 'base64' ]
<Buffer 00 00 1c 80 c1 7d f0 c7 8b 76 ae e7 e1 34 08>
-0.0009921136825854051033841089
    ✔ evalLn (919ms)
[ 'AAAcgPDau3iL96DSZpAD', 'base64' ]
<Buffer 00 00 1c 80 f0 da bb 78 8b f7 a0 d2 66 90 03>
-0.000430869497767555744581912
    ✔ evalLog10 (911ms)
[ 'AAAcACxBcJpQq/tNGAMsGw==', 'base64' ]
<Buffer 00 00 1c 00 2c 41 70 9a 50 ab fb 4d 18 03 2c 1b>
0.8409302616679940239972647212
    ✔ evalSin (941ms)
[ 'AAAcAKutSj6W7KTg8jt8EQ==', 'base64' ]
<Buffer 00 00 1c 00 ab ad 4a 3e 96 ec a4 e0 f2 3b 7c 11>
0.5411435068516958423474679211
    ✔ evalCos (920ms)
 */
