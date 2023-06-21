import type { IdlAccounts } from "@coral-xyz/anchor";
import { Tachyon as TachyonIDLType } from './idl';
export type Functions = IdlAccounts<TachyonIDLType>['functions'];
