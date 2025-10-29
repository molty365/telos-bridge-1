"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coin = exports.supportedTypes = exports.CoinType = void 0;
const utils_1 = require("../../utils");
const constants_1 = require("../../constants");
var CoinType;
(function (CoinType) {
    CoinType["APTOS"] = "AptosCoin";
    // coin that bridge supports, same to bridge::coin module
    CoinType["WETH"] = "WETH";
    CoinType["WBTC"] = "WBTC";
    CoinType["USDC"] = "USDC";
    CoinType["USDT"] = "USDT";
    CoinType["BUSD"] = "BUSD";
    CoinType["USDD"] = "USDD";
})(CoinType = exports.CoinType || (exports.CoinType = {}));
exports.supportedTypes = [CoinType.WETH, CoinType.WBTC, CoinType.USDC, CoinType.USDT, CoinType.BUSD, CoinType.USDD];
class Coin {
    constructor(sdk, bridge) {
        this.sdk = sdk;
        this.bridge = bridge ?? constants_1.BRIDGE_ADDRESS[sdk.stage];
    }
    getCoinType(coin) {
        switch (coin) {
            case CoinType.APTOS:
                return `0x1::aptos_coin::${coin}`;
            default:
                return `${this.bridge}::asset::${coin}`;
        }
    }
    transferPayload(coin, to, amount) {
        if (coin === CoinType.APTOS) {
            return {
                function: `0x1::aptos_account::transfer`,
                type_arguments: [],
                arguments: [to, amount],
            };
        }
        else {
            return {
                function: `0x1::coin::transfer`,
                type_arguments: [this.getCoinType(coin)],
                arguments: [to, amount],
            };
        }
    }
    async transfer(signer, coin, to, amount) {
        const transaction = this.transferPayload(coin, to, amount);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    // ------------------------------ view functions ------------------------------
    async balance(coin, owner) {
        try {
            const resource = await this.sdk.client.getAccountResource(owner, `0x1::coin::CoinStore<${this.getCoinType(coin)}>`);
            const { coin: c } = resource.data;
            return BigInt(c.value);
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return BigInt(0);
            }
            throw e;
        }
    }
    async isAccountRegistered(coin, accountAddr) {
        try {
            await this.sdk.client.getAccountResource(accountAddr, `0x1::coin::CoinStore<${this.getCoinType(coin)}>`);
            return true;
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return false;
            }
            throw e;
        }
    }
}
exports.Coin = Coin;
