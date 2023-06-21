import type { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Tachyon as TachyonIDLType } from '../idl';
export declare const initialize: (program: Program<TachyonIDLType>, provider: AnchorProvider) => Promise<string>;
