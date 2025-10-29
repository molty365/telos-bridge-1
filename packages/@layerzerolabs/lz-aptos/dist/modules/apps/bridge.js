"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bridge = exports.PacketType = exports.DEFAULT_LIMITER_WINDOW_SEC = exports.DEFAULT_LIMITER_CAP_SD = void 0;
const aptos = __importStar(require("aptos"));
const utils = __importStar(require("../../utils"));
const lzapp_1 = require("./lzapp");
const utils_1 = require("../../utils");
const constants_1 = require("../../constants");
exports.DEFAULT_LIMITER_CAP_SD = 1000000000000;
exports.DEFAULT_LIMITER_WINDOW_SEC = 3600 * 4;
var PacketType;
(function (PacketType) {
    PacketType[PacketType["RECIEVE"] = 0] = "RECIEVE";
    PacketType[PacketType["SEND"] = 1] = "SEND";
})(PacketType = exports.PacketType || (exports.PacketType = {}));
class Bridge {
    constructor(sdk, coin, bridge, lzApp) {
        this.SEND_PAYLOAD_LENGTH = 74;
        this.sdk = sdk;
        this.coin = coin;
        this.address = bridge ?? constants_1.BRIDGE_ADDRESS[sdk.stage];
        this.lzApp = new lzapp_1.LzApp(sdk, lzApp || sdk.accounts.layerzero, this.address);
        this.uaType = `${this.address}::coin_bridge::BridgeUA`;
        this.module = `${this.address}::coin_bridge`;
        this.moduleName = 'bridge::coin_bridge';
    }
    async setAppConfig(signer, major, minor, remoteChainId, configType, configBytes) {
        return this.lzApp.setConfig(signer, this.uaType, major, minor, remoteChainId, configType, configBytes);
    }
    async getMinDstGas(dstChainId, type) {
        return this.lzApp.getMinDstGas(this.uaType, dstChainId, type);
    }
    setMinDstGasPayload(dstChainId, packetType, minGas) {
        return this.lzApp.setMinDstPayload(this.uaType, dstChainId, packetType, minGas);
    }
    async customAdapterParamsEnabled() {
        const resource = await this.sdk.client.getAccountResource(this.address, `${this.address}::coin_bridge::Config`);
        const { custom_adapter_params } = resource.data;
        return custom_adapter_params;
    }
    enableCustomAdapterParamsPayload(enable) {
        return {
            function: `${this.module}::enable_custom_adapter_params`,
            type_arguments: [],
            arguments: [enable],
        };
    }
    setRemoteBridgePayload(remoteChainId, remoteBridgeAddr) {
        return this.lzApp.setRemotePaylaod(remoteChainId, remoteBridgeAddr);
    }
    async setRemoteBridge(signer, remoteChainId, remoteBridgeAddr) {
        return this.lzApp.setRemote(signer, remoteChainId, remoteBridgeAddr);
    }
    registerCoinPayload(coin, name, symbol, decimals, limiterCapSD) {
        return {
            function: `${this.module}::register_coin`,
            type_arguments: [this.coin.getCoinType(coin)],
            arguments: [name, symbol, decimals, limiterCapSD],
        };
    }
    async registerCoin(signer, coin, name, symbol, decimals, limiterCapSD) {
        const transaction = this.registerCoinPayload(coin, name, symbol, decimals, limiterCapSD);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    setRemoteCoinPayload(coin, remoteChainId, remoteCoinAddr, unwrappable) {
        const remoteCoinAddrBytes = (0, utils_1.convertToPaddedUint8Array)(remoteCoinAddr.toString(), 32);
        return {
            function: `${this.module}::set_remote_coin`,
            type_arguments: [this.coin.getCoinType(coin)],
            arguments: [remoteChainId, Array.from(remoteCoinAddrBytes), unwrappable],
        };
    }
    async setRemoteCoin(signer, coin, remoteChainId, remoteCoinAddr, unwrappable) {
        const transaction = this.setRemoteCoinPayload(coin, remoteChainId, remoteCoinAddr, unwrappable);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    forceResumePayload(srcChainId) {
        return {
            function: `${this.module}::force_resume`,
            type_arguments: [],
            arguments: [srcChainId],
        };
    }
    async forceResume(signer, srcChainId) {
        const transaction = this.forceResumePayload(srcChainId);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async setPause(signer, coin, paused) {
        const transaction = {
            function: `${this.module}::set_pause`,
            type_arguments: [coin],
            arguments: [paused],
        };
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    sendCoinPayload(coin, dstChainId, dstReceiver, amountLD, nativeFee, zroFee, unwrap, adapterParams, msglibPararms) {
        return {
            function: `${this.module}::send_coin_from`,
            type_arguments: [this.coin.getCoinType(coin)],
            arguments: [
                dstChainId.toString(),
                Array.from(dstReceiver),
                amountLD.toString(),
                nativeFee.toString(),
                zroFee.toString(),
                unwrap.toString(),
                Array.from(adapterParams),
                Array.from(msglibPararms),
            ],
        };
    }
    async sendCoin(signer, coin, dstChainId, dstReceiver, amountLD, nativeFee, zroFee, unwrap, adapterParams, msglibParams) {
        const transaction = this.sendCoinPayload(coin, dstChainId, dstReceiver, amountLD, nativeFee, zroFee, unwrap, adapterParams, msglibParams);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    lzReceivePayload(coin, srcChainId, srcAddress, payload) {
        return {
            function: `${this.module}::lz_receive`,
            type_arguments: [this.coin.getCoinType(coin)],
            arguments: [srcChainId, Array.from(srcAddress), Array.from(payload)],
        };
    }
    async lzReceive(signer, coin, srcChainId, srcAddress, payload) {
        const transaction = this.lzReceivePayload(coin, srcChainId, srcAddress, payload);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getTypesFromPacket(packet) {
        const payload = (0, utils_1.decodePayload)(packet.payload);
        const coinType = await this.getCoinTypeByRemoteCoin(packet.src_chain_id, payload.remoteCoinAddr);
        return [coinType.type];
    }
    claimCoinPayload(coin) {
        return {
            function: `${this.module}::claim_coin`,
            type_arguments: [this.coin.getCoinType(coin)],
            arguments: [],
        };
    }
    async claimCoin(signer, coin) {
        const transaction = this.claimCoinPayload(coin);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async globalPaused() {
        const resource = await this.sdk.client.getAccountResource(this.address, `${this.module}::Config`);
        const { paused_global } = resource.data;
        return paused_global;
    }
    // todo: add version
    // async getAppConfig(remoteChainId: aptos.BCS.Uint16): Promise<UlnConfigType> {
    //
    // }
    async getRemoteBridge(remoteChainId) {
        try {
            return await this.lzApp.getRemote(remoteChainId);
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return Buffer.alloc(0);
            }
            throw e;
        }
    }
    async getCoinTypeByRemoteCoin(remoteChainId, remoteCoinAddr) {
        const resource = await this.getCoinTypeStore();
        const { type_lookup } = resource.data;
        const coinInfosHandle = type_lookup.handle;
        const typeInfo = await this.sdk.client.getTableItem(coinInfosHandle, {
            key_type: `${this.module}::Path`,
            value_type: `0x1::type_info::TypeInfo`,
            key: {
                remote_chain_id: remoteChainId.toString(),
                remote_coin_addr: Buffer.from(remoteCoinAddr).toString('hex'),
            },
        });
        const account_address = utils.fullAddress(typeInfo.account_address).toString();
        const module_name = utils.hexToAscii(typeInfo.module_name);
        const struct_name = utils.hexToAscii(typeInfo.struct_name);
        return {
            account_address,
            module_name,
            struct_name,
            type: `${account_address}::${module_name}::${struct_name}`,
        };
    }
    async getRemoteCoin(coin, remoteChainId) {
        const resource = await this.getCoinStore(coin);
        const { remote_coins } = resource.data;
        const remoteCoinHandle = remote_coins.handle;
        const remoteCoin = await this.sdk.client.getTableItem(remoteCoinHandle, {
            key_type: 'u64',
            value_type: `${this.module}::RemoteCoin`,
            key: remoteChainId.toString(),
        });
        // console.log(`remoteCoin ${JSON.stringify(remoteCoin)}`)
        const address = Uint8Array.from(Buffer.from(aptos.HexString.ensure(remoteCoin.remote_address).noPrefix(), 'hex'));
        const tvlSD = BigInt(remoteCoin.tvl_sd);
        const unwrappable = remoteCoin.unwrappable;
        return {
            address,
            tvlSD,
            unwrappable,
        };
    }
    async getCoinStore(coin) {
        //if input is full type, get coinStore directly
        return await this.sdk.client.getAccountResource(this.address, `${this.module}::CoinStore<${this.coin.getCoinType(coin)}>`);
    }
    async getRemoteCoins(coin) {
        const resource = await this.getCoinStore(coin);
        const { remote_chains: remoteChains } = resource.data;
        const rtn = [];
        for (const chain of remoteChains) {
            const remoteCoin = await this.getRemoteCoin(coin, parseInt(chain));
            rtn.push(remoteCoin);
        }
        return rtn;
    }
    async hasRemoteCoin(coin, remoteChainId) {
        try {
            const remoteCoin = await this.getRemoteCoin(coin, remoteChainId);
            return remoteCoin !== undefined;
        }
        catch (e) {
            if (utils.isErrorOfApiError(e, 404)) {
                return false;
            }
            throw e;
        }
    }
    async getClaimableCoin(coin, owner) {
        const resource = await this.getCoinStore(coin);
        const { claimable_amt_ld } = resource.data;
        const claimableAmtLDHandle = claimable_amt_ld.handle;
        try {
            const response = await this.sdk.client.getTableItem(claimableAmtLDHandle, {
                key_type: 'address',
                value_type: 'u64',
                key: owner,
            });
            return BigInt(response);
        }
        catch (e) {
            if (utils.isErrorOfApiError(e, 404)) {
                return BigInt(0);
            }
            throw e;
        }
    }
    async hasCoinRegistered(coin) {
        try {
            const resource = await this.getCoinStore(coin);
            return resource !== undefined;
        }
        catch (e) {
            if (utils.isErrorOfApiError(e, 404)) {
                return false;
            }
            throw e;
        }
    }
    async getLd2SdRate(coin) {
        const resource = await this.getCoinStore(coin);
        const { ld2sd_rate } = resource.data;
        return ld2sd_rate;
    }
    async convertAmountToLD(coin, amountSD) {
        const rate = await this.getLd2SdRate(coin);
        return BigInt(amountSD) * BigInt(rate);
    }
    async convertAmountToSD(coin, amountLD) {
        const rate = await this.getLd2SdRate(coin);
        return BigInt(amountLD) / BigInt(rate);
    }
    registerPayload(coin) {
        return {
            function: `0x1::managed_coin::register`,
            type_arguments: [this.coin.getCoinType(coin)],
            arguments: [],
        };
    }
    async coinRegister(signer, coin) {
        const transaction = this.registerPayload(coin);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getCoinTypeStore() {
        return await this.sdk.client.getAccountResource(this.address, `${this.module}::CoinTypeStore`);
    }
    async getCoinTypes() {
        const resource = await this.getCoinTypeStore();
        const { types: coinTypes } = resource.data;
        const rtn = [];
        for (const typeInfo of coinTypes) {
            const account_address = utils.fullAddress(typeInfo.account_address).toString();
            const module_name = utils.hexToAscii(typeInfo.module_name);
            const struct_name = utils.hexToAscii(typeInfo.struct_name);
            rtn.push({
                account_address,
                module_name,
                struct_name,
                type: `${account_address}::${module_name}::${struct_name}`,
            });
        }
        return rtn;
    }
    async getLimitedAmount(coin) {
        const resource = await this.sdk.client.getAccountResource(this.address, `${this.address}::limiter::Limiter<${this.coin.getCoinType(coin)}>`);
        const { enabled } = resource.data;
        if (!enabled) {
            return {
                limited: false,
                amount: BigInt(0),
            };
        }
        const data = resource.data;
        const limiter = {
            t0Sec: BigInt(data.t0_sec),
            windowSec: BigInt(data.window_sec),
            sumSD: BigInt(data.sum_sd),
            capSD: BigInt(data.cap_sd),
        };
        const now = await this.getCurrentTimestamp();
        let count = (now - limiter.t0Sec) / limiter.windowSec;
        while (count > 0) {
            limiter.sumSD /= BigInt(2);
            count -= BigInt(1);
        }
        const limitedAmtSD = limiter.capSD - limiter.sumSD;
        return {
            limited: true,
            amount: await this.convertAmountToLD(coin, limitedAmtSD),
        };
    }
    async getCurrentTimestamp() {
        const resource = await this.sdk.client.getAccountResource('0x1', '0x1::timestamp::CurrentTimeMicroseconds');
        const { microseconds } = resource.data;
        return BigInt(microseconds) / BigInt(1000000);
    }
    setLimiterCapPayload(coin, enable, capSD, windowSec) {
        return {
            function: `${this.module}::set_limiter_cap`,
            type_arguments: [this.coin.getCoinType(coin)],
            arguments: [enable, capSD.toString(), windowSec.toString()],
        };
    }
    async setLimiterCap(signer, coin, enable, capSD, windowSec) {
        const transaction = this.setLimiterCapPayload(coin, enable, capSD, windowSec);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getLimitCap(coin) {
        try {
            const resource = await this.sdk.client.getAccountResource(this.address, `${this.address}::limiter::Limiter<${this.coin.getCoinType(coin)}>`);
            const { enabled, cap_sd, window_sec } = resource.data;
            return {
                enabled,
                capSD: BigInt(cap_sd),
                windowSec: BigInt(window_sec),
            };
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return {
                    enabled: true,
                    capSD: BigInt(exports.DEFAULT_LIMITER_CAP_SD),
                    windowSec: BigInt(exports.DEFAULT_LIMITER_WINDOW_SEC),
                };
            }
            throw e;
        }
    }
    async setGlobalPause(signer, pause) {
        const transaction = {
            function: `${this.module}::set_global_pause`,
            type_arguments: [],
            arguments: [pause],
        };
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
}
exports.Bridge = Bridge;
