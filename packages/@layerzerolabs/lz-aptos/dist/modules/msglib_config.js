"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgLibConfig = void 0;
const utils_1 = require("../utils");
class MsgLibConfig {
    constructor(sdk) {
        this.sdk = sdk;
        this.module = `${sdk.accounts.layerzero}::msglib_config`;
        this.moduleName = 'layerzero::msglib_config';
        this.semverModule = `${sdk.accounts.layerzero}::semver`;
    }
    async getDefaultSendMsgLib(remoteChainId) {
        const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::MsgLibConfig`);
        const { send_version } = resource.data;
        try {
            const response = await this.sdk.client.getTableItem(send_version.handle, {
                key_type: 'u64',
                value_type: `${this.semverModule}::SemVer`,
                key: remoteChainId.toString(),
            });
            return {
                major: BigInt(response.major),
                minor: Number(response.minor),
            };
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return {
                    major: BigInt(0),
                    minor: 0,
                };
            }
            throw e;
        }
    }
    async getDefaultReceiveMsgLib(remoteChainId) {
        const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::MsgLibConfig`);
        const { receive_version } = resource.data;
        try {
            const response = await this.sdk.client.getTableItem(receive_version.handle, {
                key_type: 'u64',
                value_type: `${this.semverModule}::SemVer`,
                key: remoteChainId.toString(),
            });
            return {
                major: BigInt(response.major),
                minor: Number(response.minor),
            };
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return {
                    major: BigInt(0),
                    minor: 0,
                };
            }
            throw e;
        }
    }
    setDefaultSendMsgLibPayload(remoteChainId, major, minor) {
        return {
            function: `${this.module}::set_default_send_msglib`,
            type_arguments: [],
            arguments: [remoteChainId.toString(), major.toString(), minor.toString()],
        };
    }
    setDefaultReceiveMsgLibPayload(remoteChainId, major, minor) {
        return {
            function: `${this.module}::set_default_receive_msglib`,
            type_arguments: [],
            arguments: [remoteChainId.toString(), major.toString(), minor.toString()],
        };
    }
}
exports.MsgLibConfig = MsgLibConfig;
