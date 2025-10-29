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
exports.UlnConfig = void 0;
const aptos = __importStar(require("aptos"));
const utils_1 = require("../../utils");
class UlnConfig {
    constructor(sdk) {
        this.sdk = sdk;
        this.TYPE_ORACLE = 0;
        this.TYPE_RELAYER = 1;
        this.TYPE_INBOUND_CONFIRMATIONS = 2;
        this.TYPE_OUTBOUND_CONFIRMATIONS = 3;
        this.module = `${sdk.accounts.layerzero}::uln_config`;
        this.moduleName = 'layerzero::uln_config';
    }
    setDefaultAppConfigPayload(remoteChainId, config) {
        return {
            function: `${this.module}::set_default_config`,
            type_arguments: [],
            arguments: [
                remoteChainId,
                config.oracle,
                config.relayer,
                config.inbound_confirmations,
                config.outbound_confirmations,
            ],
        };
    }
    async setDefaultAppConfig(signer, remoteChainId, config) {
        const transaction = this.setDefaultAppConfigPayload(remoteChainId, config);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    setChainAddressSizePayload(remoteChainId, addressSize) {
        return {
            function: `${this.module}::set_chain_address_size`,
            type_arguments: [],
            arguments: [remoteChainId, addressSize],
        };
    }
    async setChainAddressSize(signer, remoteChainId, addressSize) {
        const transaction = this.setChainAddressSizePayload(remoteChainId, addressSize);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getChainAddressSize(remoteChainId) {
        const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::ChainConfig`);
        const { chain_address_size } = resource.data;
        const tableHandle = chain_address_size.handle;
        try {
            const response = await this.sdk.client.getTableItem(tableHandle, {
                key_type: 'u64',
                value_type: 'u64',
                key: remoteChainId.toString(),
            });
            return Number(response);
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return 0;
            }
            throw e;
        }
    }
    async getDefaultAppConfig(remoteChainId) {
        const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::DefaultUlnConfig`);
        const { config } = resource.data;
        try {
            return await this.sdk.client.getTableItem(config.handle, {
                key_type: 'u64',
                value_type: `${this.module}::UlnConfig`,
                key: remoteChainId.toString(),
            });
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return {
                    inbound_confirmations: BigInt(0),
                    oracle: '',
                    outbound_confirmations: BigInt(0),
                    relayer: '',
                };
            }
            throw e;
        }
    }
    async getAppConfig(uaAddress, remoteChainId) {
        const defaultConfig = await this.getDefaultAppConfig(remoteChainId);
        console.log(`defaultConfig`, defaultConfig);
        let mergedConfig = {
            ...defaultConfig,
        };
        // console.log(`mergedConfig`, mergedConfig)
        try {
            const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::UaUlnConfig`);
            const { config } = resource.data;
            const Config = await this.sdk.client.getTableItem(config.handle, {
                key_type: `${this.module}::UaConfigKey`,
                value_type: `${this.module}::UlnConfig`,
                key: {
                    ua_address: aptos.HexString.ensure(uaAddress).toString(),
                    chain_id: remoteChainId.toString(),
                },
            });
            console.log(`Config: `, Config);
            mergedConfig = this.mergeConfig(Config, defaultConfig);
        }
        catch (e) {
            if (!(0, utils_1.isErrorOfApiError)(e, 404)) {
                throw e;
            }
        }
        //address type in move are reutrned as short string
        mergedConfig.oracle = (0, utils_1.fullAddress)(mergedConfig.oracle).toString();
        mergedConfig.relayer = (0, utils_1.fullAddress)(mergedConfig.relayer).toString();
        mergedConfig.inbound_confirmations = BigInt(mergedConfig.inbound_confirmations);
        mergedConfig.outbound_confirmations = BigInt(mergedConfig.outbound_confirmations);
        return mergedConfig;
    }
    mergeConfig(config, defaultConfig) {
        const mergedConfig = { ...defaultConfig };
        if (!(0, utils_1.isZeroAddress)(config.oracle)) {
            mergedConfig.oracle = config.oracle;
        }
        if (!(0, utils_1.isZeroAddress)(config.relayer)) {
            mergedConfig.relayer = config.relayer;
        }
        if (config.inbound_confirmations > 0) {
            mergedConfig.inbound_confirmations = config.inbound_confirmations;
        }
        if (config.outbound_confirmations > 0) {
            mergedConfig.outbound_confirmations = config.outbound_confirmations;
        }
        return mergedConfig;
    }
    async quoteFee(uaAddress, dstChainId, payloadSize) {
        const config = await this.getAppConfig(uaAddress, dstChainId);
        const oracleFee = await this.sdk.LayerzeroModule.Uln.Signer.getFee(config.oracle, dstChainId);
        const relayerFee = await this.sdk.LayerzeroModule.Uln.Signer.getFee(config.relayer, dstChainId);
        const treasuryConfigResource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.sdk.LayerzeroModule.Uln.MsgLibV1.module}::GlobalStore`);
        console.log(`treasuryConfigResource`, treasuryConfigResource.data);
        const { treasury_fee_bps: treasuryFeeBps } = treasuryConfigResource.data;
        // lz fee
        let totalFee = relayerFee.base_fee + relayerFee.fee_per_byte * BigInt(payloadSize);
        totalFee += oracleFee.base_fee + oracleFee.fee_per_byte * BigInt(payloadSize);
        totalFee += (BigInt(treasuryFeeBps) * totalFee) / BigInt(10000);
        return totalFee;
    }
}
exports.UlnConfig = UlnConfig;
