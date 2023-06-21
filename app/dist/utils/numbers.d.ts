import { Decimal } from 'decimal.js';
export declare const U8_MASK: bigint;
export declare const U32_MASK: bigint;
export declare const SCALE_SHIFT: bigint;
export declare const SIGN_SHIFT: bigint;
export declare const SIGN_MASK: bigint;
export declare const MAX_PRECISION: bigint;
export declare const MAX_I128_REPR: bigint;
type RustDecimal = {
    flags: bigint;
    lo: bigint;
    mid: bigint;
    hi: bigint;
};
export declare function rustDecimalDeserialize(bytes: Uint8Array): RustDecimal;
export declare function rustDecimalSerialize(rd: RustDecimal): Uint8Array;
export declare function rustDecimalBytesToDecimalJs(bytes: Uint8Array): Decimal;
export declare function decimalJsToRustDecimal(d: Decimal): RustDecimal;
export declare function decimalJsToRustDecimalBytes(d: Decimal): Uint8Array;
export {};
