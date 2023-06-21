/// <reference types="node" />
import { PublicKey } from "@solana/web3.js";
export declare const getFunctionsAddr: (programId: PublicKey) => [PublicKey, number];
export declare const encode: (x: string) => Buffer;
