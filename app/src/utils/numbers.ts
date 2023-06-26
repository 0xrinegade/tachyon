import {Decimal} from 'decimal.js';

export const U8_MASK = BigInt(0x0000_00FF);
export const U32_MASK = BigInt(4294967295);
export const SCALE_SHIFT = BigInt(16);
export const SIGN_SHIFT = BigInt(31);
export const SIGN_MASK = BigInt(0x8000_0000);
export const MAX_PRECISION = BigInt(28);
export const MAX_I128_REPR = BigInt(0x0000_0000_FFFF_FFFF_FFFF_FFFF_FFFF_FFFF)

type RustDecimal = {
    flags: bigint,
    lo: bigint,
    mid: bigint,
    hi: bigint,
}

export function rustDecimalDeserialize(bytes: Uint8Array): RustDecimal {
    return {
        flags: (BigInt(bytes[0]) | BigInt(bytes[1]) << BigInt(8) | BigInt(bytes[2]) << BigInt(16) | BigInt(bytes[3]) << BigInt(24)) & BigInt(0x801F_0000),
        lo: BigInt(bytes[4]) | BigInt(bytes[5]) << BigInt(8) | BigInt(bytes[6]) << BigInt(16) | BigInt(bytes[7]) << BigInt(24),
        mid: BigInt(bytes[8]) | BigInt(bytes[9]) << BigInt(8) | BigInt(bytes[10]) << BigInt(16) | BigInt(bytes[11]) << BigInt(24),
        hi: BigInt(bytes[12]) | BigInt(bytes[13]) << BigInt(8) | BigInt(bytes[14]) << BigInt(16) | BigInt(bytes[15]) << BigInt(24),
    }
}

export function rustDecimalSerialize(rd: RustDecimal): Uint8Array {
    return new Uint8Array(
        [
            Number(rd.flags & U8_MASK),
            Number((rd.flags >> BigInt(8)) & U8_MASK),
            Number((rd.flags >> BigInt(16)) & U8_MASK),
            Number((rd.flags >> BigInt(24)) & U8_MASK),
            Number(rd.lo & U8_MASK),
            Number((rd.lo >> BigInt(8)) & U8_MASK),
            Number((rd.lo >> BigInt(16)) & U8_MASK),
            Number((rd.lo >> BigInt(24)) & U8_MASK),
            Number(rd.mid & U8_MASK),
            Number((rd.mid >> BigInt(8)) & U8_MASK),
            Number((rd.mid >> BigInt(16)) & U8_MASK),
            Number((rd.mid >> BigInt(24)) & U8_MASK),
            Number(rd.hi & U8_MASK),
            Number((rd.hi >> BigInt(8)) & U8_MASK),
            Number((rd.hi >> BigInt(16)) & U8_MASK),
            Number((rd.hi >> BigInt(24)) & U8_MASK),
        ]
    )
}

export function rustDecimalBytesToDecimalJs(bytes: Uint8Array): Decimal {
    let d: RustDecimal = rustDecimalDeserialize(bytes)

    let scale = (d.flags & BigInt(0x00FF_0000)) >> BigInt(16)
    let base = d.hi << BigInt(64) | d.mid << BigInt(32) | d.lo

    let neg = (d.flags & SIGN_MASK) > 0

    if (neg){
        base = -base
    }

    return new Decimal(base.toString()).div((new Decimal(10)).pow(new Decimal(scale.toString())))
}

export function decimalJsToRustDecimal(d_in: Decimal): RustDecimal {
    const getFlags = (neg: boolean, scale: bigint) => {
        let negBytes = neg ? BigInt(1) : BigInt(0)
        return (scale << SCALE_SHIFT) | (negBytes << SIGN_SHIFT)
    }

    // don't print strings in exp notation
    Decimal.set({ toExpPos: 1000, toExpNeg: -1000 })

    const d = d_in.toDecimalPlaces(28) // cut off more than 28 decimal places, since RustDecimal can't hold more than that

    const scale = BigInt(d.decimalPlaces())
    let numString = d.toFixed(d.decimalPlaces())

    if (numString.includes(".")){
        numString = numString.replace(/^0+|0+$/g, "")
    }
    numString = numString.replace('.', '')

    let num = BigInt(numString)
    let neg = false

    if (scale > MAX_PRECISION) {
        throw Error(`ScaleExceedsMaximumPrecision ${scale}`)
    }

    if (num > MAX_I128_REPR) {
        throw Error(`ExceedsMaximumPossibleValue`)
    } else if (num < -MAX_I128_REPR) {
        throw Error(`LessThanMinimumPossibleValue`)
    } else if (num < BigInt(0)) {
        neg = true
        num = -num
    }

    let flags = getFlags(neg, scale)

    return {
        flags,
        lo: (num & U32_MASK),
        mid: ((num >> BigInt(32)) & U32_MASK),
        hi: ((num >> BigInt(64)) & U32_MASK),
    }
}

export function decimalJsToRustDecimalBytes(d: Decimal): Uint8Array {
    let rd = decimalJsToRustDecimal(d)
    return rustDecimalSerialize(rd)
}
