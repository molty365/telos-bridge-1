"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutorConfig = void 0;
const utils_1 = require("../utils");
class ExecutorConfig {
    constructor(sdk) {
        this.sdk = sdk;
        this.module = `${sdk.accounts.layerzero}::executor_config`;
    }
    async getDefaultExecutor(remoteChainId) {
        const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::ConfigStore`);
        const { config } = resource.data;
        try {
            const response = await this.sdk.client.getTableItem(config.handle, {
                key_type: 'u64',
                value_type: `${this.module}::Config`,
                key: remoteChainId.toString(),
            });
            return [response.executor, response.version];
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return ['', BigInt(0)];
            }
            throw e;
        }
    }
    async getExecutor(uaAddress, remoteChainId) {
        const resource = await this.sdk.client.getAccountResource(uaAddress, `${this.module}::ConfigStore`);
        const { config } = resource.data;
        try {
            const response = await this.sdk.client.getTableItem(config.handle, {
                key_type: 'u64',
                value_type: `${this.module}::Config`,
                key: remoteChainId.toString(),
            });
            return [response.executor, response.version];
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return await this.getDefaultExecutor(remoteChainId);
            }
            throw e;
        }
    }
    setDefaultExecutorPayload(remoteChainId, version, executor) {
        return {
            function: `${this.module}::set_default_executor`,
            type_arguments: [],
            arguments: [remoteChainId, version, executor],
        };
    }
}
exports.ExecutorConfig = ExecutorConfig;
