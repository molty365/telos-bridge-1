import { SDK } from '../index';
import * as aptos from 'aptos';
export declare class MsgLibAuth {
    private sdk;
    readonly module: string;
    readonly moduleName: string;
    constructor(sdk: SDK);
    isAllowed(msglibReceive: string): Promise<boolean[]>;
    denyPayload(msglibReceive: string): aptos.Types.EntryFunctionPayload;
    allowPayload(msglibReceive: string): aptos.Types.EntryFunctionPayload;
    allow(signer: aptos.AptosAccount, msglibReceive: string): Promise<aptos.Types.Transaction>;
}
