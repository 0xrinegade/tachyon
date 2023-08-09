import {Connection, Keypair, PublicKey} from "@solana/web3.js";
import path from "path";
import dotenv from 'dotenv';
import {AnchorProvider, Wallet} from "@coral-xyz/anchor";
import { readFileSync } from 'fs';
import {Decimal} from "decimal.js";
import {decimalJsToRustDecimalBytes, TachyonClient} from "../app/dist";
import {getFunctions} from "../app/src";

export async function main() {
    const envPath = path.resolve(__dirname, '..', '.env');
    dotenv.config({path: envPath});

    console.log("starting")

    let rpcEndpoint = process.env.RPC_ENDPOINT || ""
    let keypairPath = process.env.KEYPAIR_PATH || ""

    const bytes = JSON.parse(readFileSync(keypairPath, 'utf-8'))
    const keypair = Keypair.fromSecretKey(new Uint8Array(bytes));
    const wallet = new Wallet(keypair);

    console.log("wallet:", wallet.publicKey.toBase58())

    const connection = new Connection(rpcEndpoint, 'confirmed');
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());

    const tachyonClient = new TachyonClient(provider, new PublicKey("tachANmkv5KXR1hSZKoVJ2s5wKrfdgFgb3638k6CvKQ"))
    await tachyonClient.initialize()

    const [functionsData, functionsPDA] = await getFunctions(tachyonClient.program)
    console.log("functions:", functionsPDA.toBase58())

    await tachyonClient.initExp(
        Array.from(decimalJsToRustDecimalBytes(new Decimal(0))),
        Array.from(decimalJsToRustDecimalBytes(new Decimal(66.5)))
    )

    await tachyonClient.initLn(
        Array.from(decimalJsToRustDecimalBytes(new Decimal(0))),
        Array.from(decimalJsToRustDecimalBytes(new Decimal(1)))
    )

    console.log("exp:", functionsData.exp.toBase58())
    console.log("ln:", functionsData.ln.toBase58())

    try {
        await tachyonClient.loadExp(5)
        await tachyonClient.loadLn(5)
    } catch (e){
        console.log(e)
    }
}

main()
