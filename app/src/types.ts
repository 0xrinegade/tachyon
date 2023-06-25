import type {IdlAccounts, IdlTypes} from "@coral-xyz/anchor";
import {Tachyon as TachyonIDLType} from './idl';

export type Functions = IdlAccounts<TachyonIDLType>['functions'];
export type FunctionData = IdlAccounts<TachyonIDLType>['functionData'];
