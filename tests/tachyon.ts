import * as anchor from "@coral-xyz/anchor";
import {Decimal} from 'decimal.js';
import {assert} from "chai";
import {PublicKey} from "@solana/web3.js";
import {decimalJsToRustDecimalBytes, rustDecimalBytesToDecimalJs, TachyonClient} from "../app/dist";
import * as borsh from "borsh";

const errorTol = 0.01 // can be greatly reduced as the number of values per table is increased

describe("tachyon", () => {
    const provider = anchor.AnchorProvider.local();
    anchor.setProvider(provider);

    const tachyonClient = new TachyonClient(provider, new PublicKey("tachANmkv5KXR1hSZKoVJ2s5wKrfdgFgb3638k6CvKQ"))

    const exp = true
    const ln = true
    const log10 = true
    const sin = true
    const cos = true

    it("initialize", async () => {
        await txHandler(() => tachyonClient.initialize())
    })

    if (exp){
        it("initExp", async () => {
            let domainStart = new Decimal(0)
            let domainEnd = new Decimal(66.5)
            await txHandler(() => tachyonClient.initExp(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
        })
    }

    if (ln) {
        it("initLn", async () => {
            let domainStart = new Decimal(0)
            let domainEnd = new Decimal(1)
            await txHandler(() => tachyonClient.initLn(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
        })
    }

    if (log10) {
        it("initLog10", async () => {
            let domainStart = new Decimal(0)
            let domainEnd = new Decimal(1)
            await txHandler(() => tachyonClient.initLog10(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
        })
    }

    if (sin) {
        it("initSin", async () => {
            let domainStart = new Decimal(0)
            let domainEnd = Decimal.acos(-1).mul(2) // 2*pi
            await txHandler(() => tachyonClient.initSin(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
        })
    }

    if (cos) {
        it("initCos", async () => {
            let domainStart = new Decimal(0)
            let domainEnd = Decimal.acos(-1).mul(2) // 2*pi
            await txHandler(() => tachyonClient.initCos(decimalJsToRustDecimalBytes(domainStart), decimalJsToRustDecimalBytes(domainEnd)))
        })
    }

    if (exp) {
        it("loadExp", async () => {
            await txHandler(() => tachyonClient.loadExp())
        })
    }

    if (ln) {
        it("loadLn", async () => {
            await txHandler(() => tachyonClient.loadLn())
        })
    }

    if (log10) {
        it("loadLog10", async () => {
            await txHandler(() => tachyonClient.loadLog10())
        })
    }

    if (sin) {
        it("loadSin", async () => {
            await txHandler(() => tachyonClient.loadSin())
        })
    }

    if (cos) {
        it("loadCos", async () => {
            await txHandler(() => tachyonClient.loadCos())
        })
    }

    if (exp) {
        it("evalExp", async () => {
            let testNums = [-65, -50, -25, -5, -1, 0, 1, 5, 25, 65]

            for (let x_num of testNums) {
                let x = new Decimal(x_num)
                let tx = await txHandler(() => tachyonClient.evalExp(decimalJsToRustDecimalBytes(x)))

                await provider.connection.confirmTransaction(tx, "confirmed");
                let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

                let result = getDecimal(ctx)
                let expected = x.exp()

                assertError(expected, result)
            }
        })
    }

    if (ln) {
        it("evalLn", async () => {
            let testNums = [0.1, 0.5, 0.75, 0.9, 1]

            for (let x_num of testNums) {
                let x = new Decimal(x_num)
                let tx = await txHandler(() => tachyonClient.evalLn(decimalJsToRustDecimalBytes(x)))

                await provider.connection.confirmTransaction(tx, "confirmed");
                let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

                let result = getDecimal(ctx)
                let expected = x.ln()

                assertError(expected, result)
            }
        })
    }

    if (log10) {
        it("evalLog10", async () => {
            let testNums = [0.1, 0.5, 0.75, 0.9, 1]

            for (let x_num of testNums) {
                let x = new Decimal(x_num)
                let tx = await txHandler(() => tachyonClient.evalLog10(decimalJsToRustDecimalBytes(x)))

                await provider.connection.confirmTransaction(tx, "confirmed");
                let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

                let result = getDecimal(ctx)
                let expected = x.log()

                assertError(expected, result)
            }
        })
    }

    if (sin) {
        it("evalSin", async () => {
            let testNums = [0, 1, 2, 3, 4, 5, 6]

            for (let x_num of testNums) {
                let x = new Decimal(x_num)
                let tx = await txHandler(() => tachyonClient.evalSin(decimalJsToRustDecimalBytes(x)))

                await provider.connection.confirmTransaction(tx, "confirmed");
                let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

                let result = getDecimal(ctx)
                let expected = x.sin()

                assertError(expected, result)
            }
        })
    }

    if (cos) {
        it("evalCos", async () => {
            let testNums = [0, 1, 2, 3, 4, 5, 6]

            for (let x_num of testNums) {
                let x = new Decimal(x_num)
                let tx = await txHandler(() => tachyonClient.evalCos(decimalJsToRustDecimalBytes(x)))

                await provider.connection.confirmTransaction(tx, "confirmed");
                let ctx = await provider.connection.getTransaction(tx, {commitment: "confirmed",});

                let result = getDecimal(ctx)
                let expected = x.cos()

                assertError(expected, result)
            }
        })
    }

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

const assertError = (expected: Decimal, result: Decimal) => {
    console.log('')

    console.log("expected", expected)
    console.log("result  ", result)

    console.log("absolute error", expected.sub(result).abs())
    console.log("percent error ", percentError(expected, result))

    assert(expected.sub(result).abs() < errorTol || percentError(expected, result) < errorTol)
}

const percentError = (expected: Decimal, result: Decimal): Decimal => {
    if (expected.eq(result)){
        return new Decimal(0)
    }
    let maxAbs = Decimal.max(expected.abs(), result.abs())
    return (new Decimal(100)).mul(expected.sub(result).abs()).div(maxAbs)
}

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

const getDecimal = (ctx): Decimal => {
    const [key, data, buffer] = getReturnLog(ctx);

    const reader = new borsh.BinaryReader(buffer);
    let array = reader.readFixedArray(16);

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

