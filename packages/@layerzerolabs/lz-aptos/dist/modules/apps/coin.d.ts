import * as aptos from 'aptos';
import { SDK } from '../../index';
export declare enum CoinType {
    APTOS = "AptosCoin",
    WETH = "WETH",
    WBTC = "WBTC",
    USDC = "USDC",
    USDT = "USDT",
    BUSD = "BUSD",
    USDD = "USDD"
}
export declare const supportedTypes: CoinType[];
export declare type BridgeCoinType = CoinType.WETH | CoinType.WBTC | CoinType.USDC | CoinType.USDT | CoinType.BUSD | CoinType.USDD;
export declare class Coin {
    private sdk;
    private readonly bridge;
    constructor(sdk: SDK, bridge?: aptos.MaybeHexString);
    getCoinType(coin: CoinType): string;
    transferPayload(coin: CoinType, to: aptos.MaybeHexString, amount: aptos.BCS.Uint64 | aptos.BCS.Uint32): aptos.Types.EntryFunctionPayload;
    transfer(signer: aptos.AptosAccount, coin: CoinType, to: aptos.MaybeHexString, amount: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.Transaction>;
    balance(coin: CoinType, owner: aptos.MaybeHexString): Promise<aptos.BCS.Uint64>;
    isAccountRegistered(coin: CoinType, accountAddr: aptos.MaybeHexString): Promise<boolean>;
}
