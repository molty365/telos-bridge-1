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
exports.Endpoint = void 0;
const aptos = __importStar(require("aptos"));
const utils_1 = require("../utils");
class Endpoint {
    constructor(sdk) {
        this.sdk = sdk;
        this.module = `${sdk.accounts.layerzero}::endpoint`;
        this.moduleName = 'layerzero::endpoint';
    }
    async initialize(signer, localChainId) {
        const transaction = {
            function: `${this.module}::init`,
            type_arguments: [],
            arguments: [localChainId],
        };
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getUATypeInfo(uaAddress) {
        const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::UaRegistry`);
        const { ua_infos } = resource.data;
        const typesHandle = ua_infos.handle;
        const typeInfo = await this.sdk.client.getTableItem(typesHandle, {
            key_type: 'address',
            value_type: `0x1::type_info::TypeInfo`,
            key: aptos.HexString.ensure(uaAddress).toString(),
        });
        const account_address = (0, utils_1.fullAddress)(typeInfo.account_address).toString();
        const module_name = (0, utils_1.hexToAscii)(typeInfo.module_name);
        const struct_name = (0, utils_1.hexToAscii)(typeInfo.struct_name);
        return {
            account_address,
            module_name,
            struct_name,
            type: `${account_address}::${module_name}::${struct_name}`,
        };
    }
    async getOracleFee(oracleAddr, dstChainId) {
        const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::FeeStore`);
        const { oracle_fees } = resource.data;
        const response = await this.sdk.client.getTableItem(oracle_fees.handle, {
            key_type: `${this.module}::QuoteKey`,
            value_type: 'u64',
            key: {
                agent: aptos.HexString.ensure(oracleAddr).toString(),
                chain_id: dstChainId.toString(),
            },
        });
        return BigInt(response);
    }
    async getRegisterEvents(start, limit) {
        return this.sdk.client.getEventsByEventHandle(this.sdk.accounts.layerzero, `${this.module}::UaRegistry`, 'register_events', { start, limit });
    }
    async quoteFee(uaAddress, dstChainId, adapterParams, payloadSize) {
        let totalFee = BigInt(await this.sdk.LayerzeroModule.Uln.Config.quoteFee(uaAddress, dstChainId, payloadSize));
        const [executor] = await this.sdk.LayerzeroModule.ExecutorConfig.getExecutor(uaAddress, dstChainId);
        totalFee += await this.sdk.LayerzeroModule.Executor.quoteFee(executor, dstChainId, adapterParams);
        return totalFee;
    }
    registerExecutorPayload(executorType) {
        return {
            function: `${this.module}::register_executor`,
            type_arguments: [executorType],
            arguments: [],
        };
    }
    async registerExecutor(signer, executorType) {
        const transaction = this.registerExecutorPayload(executorType);
        return await this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
}
exports.Endpoint = Endpoint;
