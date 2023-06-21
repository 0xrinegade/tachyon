"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimalJsToRustDecimalBytes = exports.decimalJsToRustDecimal = exports.rustDecimalBytesToDecimalJs = exports.rustDecimalSerialize = exports.rustDecimalDeserialize = exports.MAX_I128_REPR = exports.MAX_PRECISION = exports.SIGN_MASK = exports.SIGN_SHIFT = exports.SCALE_SHIFT = exports.U32_MASK = exports.U8_MASK = void 0;
const decimal_js_1 = require("decimal.js");
exports.U8_MASK = BigInt(0x0000_00FF);
exports.U32_MASK = BigInt(4294967295);
exports.SCALE_SHIFT = BigInt(16);
exports.SIGN_SHIFT = BigInt(31);
exports.SIGN_MASK = BigInt(0x8000_0000);
exports.MAX_PRECISION = BigInt(28);
exports.MAX_I128_REPR = BigInt(0x0000_0000_FFFF_FFFF_FFFF_FFFF_FFFF_FFFF);
function rustDecimalDeserialize(bytes) {
    return {
        flags: (BigInt(bytes[0]) | BigInt(bytes[1]) << BigInt(8) | BigInt(bytes[2]) << BigInt(16) | BigInt(bytes[3]) << BigInt(24)) & BigInt(0x801F_0000),
        lo: BigInt(bytes[4]) | BigInt(bytes[5]) << BigInt(8) | BigInt(bytes[6]) << BigInt(16) | BigInt(bytes[7]) << BigInt(24),
        mid: BigInt(bytes[8]) | BigInt(bytes[9]) << BigInt(8) | BigInt(bytes[10]) << BigInt(16) | BigInt(bytes[11]) << BigInt(24),
        hi: BigInt(bytes[12]) | BigInt(bytes[13]) << BigInt(8) | BigInt(bytes[14]) << BigInt(16) | BigInt(bytes[15]) << BigInt(24),
    };
}
exports.rustDecimalDeserialize = rustDecimalDeserialize;
function rustDecimalSerialize(rd) {
    return new Uint8Array([
        Number(rd.flags & exports.U8_MASK),
        Number((rd.flags >> BigInt(8)) & exports.U8_MASK),
        Number((rd.flags >> BigInt(16)) & exports.U8_MASK),
        Number((rd.flags >> BigInt(24)) & exports.U8_MASK),
        Number(rd.lo & exports.U8_MASK),
        Number((rd.lo >> BigInt(8)) & exports.U8_MASK),
        Number((rd.lo >> BigInt(16)) & exports.U8_MASK),
        Number((rd.lo >> BigInt(24)) & exports.U8_MASK),
        Number(rd.mid & exports.U8_MASK),
        Number((rd.mid >> BigInt(8)) & exports.U8_MASK),
        Number((rd.mid >> BigInt(16)) & exports.U8_MASK),
        Number((rd.mid >> BigInt(24)) & exports.U8_MASK),
        Number(rd.hi & exports.U8_MASK),
        Number((rd.hi >> BigInt(8)) & exports.U8_MASK),
        Number((rd.hi >> BigInt(16)) & exports.U8_MASK),
        Number((rd.hi >> BigInt(24)) & exports.U8_MASK),
    ]);
}
exports.rustDecimalSerialize = rustDecimalSerialize;
function rustDecimalBytesToDecimalJs(bytes) {
    let d = rustDecimalDeserialize(bytes);
    let scale = (d.flags & BigInt(0x00FF_0000)) >> BigInt(16);
    let base = d.hi << BigInt(64) | d.mid << BigInt(32) | d.lo;
    let neg = (d.flags & exports.SIGN_MASK) > 0;
    if (neg) {
        base = -base;
    }
    return new decimal_js_1.Decimal(base.toString()).div((new decimal_js_1.Decimal(10)).pow(new decimal_js_1.Decimal(scale.toString())));
}
exports.rustDecimalBytesToDecimalJs = rustDecimalBytesToDecimalJs;
function decimalJsToRustDecimal(d) {
    const getFlags = (neg, scale) => {
        let negBytes = neg ? BigInt(1) : BigInt(0);
        return (scale << exports.SCALE_SHIFT) | (negBytes << exports.SIGN_SHIFT);
    };
    // don't print strings in exp notation
    decimal_js_1.Decimal.set({ toExpPos: 1000, toExpNeg: -1000 });
    const scale = BigInt(d.decimalPlaces());
    let numString = d.toFixed(d.decimalPlaces());
    if (numString.includes(".")) {
        numString = numString.replace(/^0+|0+$/g, "");
    }
    numString = numString.replace('.', '');
    let num = BigInt(numString);
    let neg = false;
    if (scale > exports.MAX_PRECISION) {
        throw Error(`ScaleExceedsMaximumPrecision ${scale}`);
    }
    if (num > exports.MAX_I128_REPR) {
        throw Error(`ExceedsMaximumPossibleValue`);
    }
    else if (num < -exports.MAX_I128_REPR) {
        throw Error(`LessThanMinimumPossibleValue`);
    }
    else if (num < BigInt(0)) {
        neg = true;
        num = -num;
    }
    let flags = getFlags(neg, scale);
    return {
        flags,
        lo: (num & exports.U32_MASK),
        mid: ((num >> BigInt(32)) & exports.U32_MASK),
        hi: ((num >> BigInt(64)) & exports.U32_MASK),
    };
}
exports.decimalJsToRustDecimal = decimalJsToRustDecimal;
function decimalJsToRustDecimalBytes(d) {
    let rd = decimalJsToRustDecimal(d);
    return rustDecimalSerialize(rd);
}
exports.decimalJsToRustDecimalBytes = decimalJsToRustDecimalBytes;
//# sourceMappingURL=numbers.js.map