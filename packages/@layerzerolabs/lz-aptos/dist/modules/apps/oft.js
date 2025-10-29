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
exports.OFT = exports.PacketType = void 0;
const aptos = __importStar(require("aptos"));
const utils_1 = require("../../utils");
const lzapp_1 = require("./lzapp");
var PacketType;
(function (PacketType) {
    PacketType[PacketType["SEND"] = 0] = "SEND";
})(PacketType = exports.PacketType || (exports.PacketType = {}));
class OFT {
    constructor(sdk) {
        this.SEND_PAYLOAD_LENGTH = 41; //
        this.sdk = sdk;
        this.address = sdk.accounts.layerzero_apps;
        this.lzApp = sdk.accounts.layerzero;
        this.module = `${this.address}::oft`;
    }
    async setAppConfig(signer, oftType, major, minor, remoteChainId, configType, configBytes) {
        const address = this.getTypeAddress(oftType);
        const lzApp = new lzapp_1.LzApp(this.sdk, this.lzApp, address);
        return lzApp.setConfig(signer, oftType, major, minor, remoteChainId, configType, configBytes);
    }
    async getMinDstGas(oftType, dstChainId, type) {
        const address = this.getTypeAddress(oftType);
        const lzApp = new lzapp_1.LzApp(this.sdk, this.lzApp, address);
        return lzApp.getMinDstGas(oftType, dstChainId, type);
    }
    setMinDstGasPayload(oftType, dstChainId, packetType, minGas) {
        const address = this.getTypeAddress(oftType);
        const lzApp = new lzapp_1.LzApp(this.sdk, this.lzApp, address);
        return lzApp.setMinDstPayload(oftType, dstChainId, packetType, minGas);
    }
    async customAdapterParamsEnabled(oftType) {
        const resource = await this.getGlobalStore(oftType);
        const { custom_adapter_params } = resource.data;
        return custom_adapter_params;
    }
    enableCustomAdapterParamsPayload(oftType, enable) {
        return {
            function: `${this.module}::enable_custom_adapter_params`,
            type_arguments: [oftType],
            arguments: [enable],
        };
    }
    setRemotePayload(oftType, remoteChainId, remoteOftAddr) {
        const address = this.getTypeAddress(oftType);
        const lzApp = new lzapp_1.LzApp(this.sdk, this.lzApp, address);
        return lzApp.setRemotePaylaod(remoteChainId, remoteOftAddr);
    }
    async setRemote(signer, oftType, remoteChainId, remoteOftAddr) {
        const address = this.getTypeAddress(oftType);
        const lzApp = new lzapp_1.LzApp(this.sdk, this.lzApp, address);
        return lzApp.setRemote(signer, remoteChainId, remoteOftAddr);
    }
    async getRemote(oftType, remoteChainId) {
        try {
            const address = this.getTypeAddress(oftType);
            const lzApp = new lzapp_1.LzApp(this.sdk, this.lzApp, address);
            return await lzApp.getRemote(remoteChainId);
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return Buffer.alloc(0);
            }
            throw e;
        }
    }
    payloadOfSetDefaultFee(oftType, feeBp) {
        return {
            function: `${this.module}::set_default_fee`,
            type_arguments: [oftType],
            arguments: [feeBp.toString()],
        };
    }
    async setDefaultFee(signer, oftType, feeBp) {
        const transaction = this.payloadOfSetDefaultFee(oftType, feeBp);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getDefaultFee(oftType) {
        const resource = await this.getGlobalStore(oftType);
        const { fee_config } = resource.data;
        return fee_config.default_fee_bp;
    }
    payloadOfSetFee(oftType, remoteChainId, enabled, feeBp) {
        return {
            function: `${this.module}::set_fee`,
            type_arguments: [oftType],
            arguments: [remoteChainId, enabled, feeBp],
        };
    }
    async setFee(signer, oftType, remoteChainId, enabled, feeBp) {
        const transaction = this.payloadOfSetFee(oftType, remoteChainId, enabled, feeBp);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getFee(oftType, remoteChainId) {
        const resource = await this.getGlobalStore(oftType);
        const { fee_config } = resource.data;
        try {
            return await this.sdk.client.getTableItem(fee_config.chain_id_to_fee_bp.handle, {
                key_type: `u64`,
                value_type: `u64`,
                key: remoteChainId.toString(),
            });
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return fee_config.default_fee_bp;
            }
            throw e;
        }
    }
    payloadOfSetFeeOwner(oftType, owner) {
        return {
            function: `${this.module}::set_fee_owner`,
            type_arguments: [oftType],
            arguments: [owner],
        };
    }
    async setFeeOwner(signer, oftType, owner) {
        const transaction = this.payloadOfSetFeeOwner(oftType, owner);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getFeeOwner(oftType) {
        const resource = await this.getGlobalStore(oftType);
        const { fee_config } = resource.data;
        return aptos.HexString.ensure(fee_config.fee_owner);
    }
    sendCoinPayload(oftType, dstChainId, dstReceiver, amount, minAmount, nativeFee, zroFee, adapterParams, msglibPararms) {
        return {
            function: `${this.module}::send`,
            type_arguments: [oftType],
            arguments: [
                dstChainId.toString(),
                Array.from(dstReceiver),
                amount.toString(),
                minAmount.toString(),
                nativeFee.toString(),
                zroFee.toString(),
                Array.from(adapterParams),
                Array.from(msglibPararms),
            ],
        };
    }
    async sendCoin(signer, oftType, dstChainId, dstReceiver, amount, minAmount, nativeFee, zroFee, adapterParams, msglibParams) {
        const transaction = this.sendCoinPayload(oftType, dstChainId, dstReceiver, amount, minAmount, nativeFee, zroFee, adapterParams, msglibParams);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    payloadOfLzReceive(oftType, srcChainId, srcAddress, payload) {
        return {
            function: `${this.module}::lz_receive`,
            type_arguments: [oftType],
            arguments: [srcChainId, Array.from(srcAddress), Array.from(payload)],
        };
    }
    async lzReceive(signer, oftType, srcChainId, srcAddress, payload) {
        const transaction = this.payloadOfLzReceive(oftType, srcChainId, srcAddress, payload);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    payloadOfClaimCoin(oftType) {
        return {
            function: `${this.module}::claim`,
            type_arguments: [oftType],
            arguments: [],
        };
    }
    async claimCoin(signer, oftType) {
        const transaction = this.payloadOfClaimCoin(oftType);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async isInitialized(oftType) {
        try {
            const remoteCoin = await this.getGlobalStore(oftType);
            return remoteCoin !== undefined;
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return false;
            }
            throw e;
        }
    }
    async getClaimableCoin(oftType, owner) {
        const resource = await this.getCoinStore(oftType);
        const { claimable_amount } = resource.data;
        const claimableAmtLDHandle = claimable_amount.handle;
        try {
            const response = await this.sdk.client.getTableItem(claimableAmtLDHandle, {
                key_type: 'address',
                value_type: 'u64',
                key: owner,
            });
            return BigInt(response);
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return BigInt('0');
            }
            throw e;
        }
    }
    async getTotalValueLocked(oftType) {
        const resource = await this.getCoinStore(oftType);
        const { locked_coin } = resource.data;
        return BigInt(locked_coin.value);
    }
    async getLd2SdRate(oftType) {
        const resource = await this.getGlobalStore(oftType);
        const { ld2sd_rate } = resource.data;
        return ld2sd_rate;
    }
    async convertAmountToLD(oftType, amountSD) {
        const rate = await this.getLd2SdRate(oftType);
        return BigInt(amountSD) * BigInt(rate);
    }
    async convertAmountToSD(oftType, amountLD) {
        const rate = await this.getLd2SdRate(oftType);
        return BigInt(amountLD) / BigInt(rate);
    }
    payloadOfCoinRegister(oftType) {
        return {
            function: `0x1::managed_coin::register`,
            type_arguments: [oftType],
            arguments: [],
        };
    }
    async coinRegister(signer, oftType) {
        const transaction = this.payloadOfCoinRegister(oftType);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    getTypeAddress(oftType) {
        const match = oftType.match(/0x(?<address>.*)::(?<module>.*)::(?<struct>.*)/i);
        if (!match) {
            throw new Error(`Invalid oft type: ${oftType}`);
        }
        const address = match.groups.address;
        return address;
    }
    async getGlobalStore(oftType) {
        const address = this.getTypeAddress(oftType);
        return await this.sdk.client.getAccountResource(address, `${this.module}::GlobalStore<${oftType}>`);
    }
    async getCoinStore(oftType) {
        const address = this.getTypeAddress(oftType);
        return await this.sdk.client.getAccountResource(address, `${this.module}::CoinStore<${oftType}>`);
    }
    transferPayload(oftType, to, amount) {
        return {
            function: `0x1::coin::transfer`,
            type_arguments: [oftType],
            arguments: [to, amount],
        };
    }
    async transfer(signer, oftType, to, amount) {
        const transaction = this.transferPayload(oftType, to, amount);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    // ------------------------------ view functions ------------------------------
    async balance(oftType, owner) {
        try {
            const resource = await this.sdk.client.getAccountResource(owner, `0x1::coin::CoinStore<${oftType}>`);
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
    async isAccountRegistered(oftType, accountAddr) {
        try {
            await this.sdk.client.getAccountResource(accountAddr, `0x1::coin::CoinStore<${oftType}>`);
            return true;
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return false;
            }
            throw e;
        }
    }
    async getCurrentTimestamp() {
        const resource = await this.sdk.client.getAccountResource('0x1', '0x1::timestamp::CurrentTimeMicroseconds');
        const { microseconds } = resource.data;
        return BigInt(microseconds) / BigInt(1000000);
    }
    async supply(oftType, oftOwner) {
        try {
            const resource = await this.sdk.client.getAccountResource(oftOwner, `0x1::coin::CoinInfo<${oftType}>`);
            return BigInt(resource.data.supply.vec[0].integer.vec[0].value);
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return BigInt(0);
            }
            throw e;
        }
    }
}
exports.OFT = OFT;
