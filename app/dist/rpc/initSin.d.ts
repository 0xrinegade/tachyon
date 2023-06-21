import type { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Tachyon as TachyonIDLType } from '../idl';
export declare const initSin: (program: Program<TachyonIDLType>, provider: AnchorProvider, domainStart: number[], domainEnd: number[]) => Promise<string>;
