"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const utils_1 = require("../utils");
class Channel {
    constructor(sdk) {
        this.sdk = sdk;
        this.module = `${sdk.accounts.layerzero}::channel`;
    }
    async getOutboundEvents(start, limit) {
        return this.sdk.client.getEventsByEventHandle(this.sdk.accounts.layerzero, `${this.module}::EventStore`, 'outbound_events', { start, limit });
    }
    async getInboundEvents(start, limit) {
        return this.sdk.client.getEventsByEventHandle(this.sdk.accounts.layerzero, `${this.module}::EventStore`, 'inbound_events', { start, limit });
    }
    async getReceiveEvents(start, limit) {
        return this.sdk.client.getEventsByEventHandle(this.sdk.accounts.layerzero, `${this.module}::EventStore`, 'receive_events', {
            start,
            limit,
        });
    }
    async getChannelState(uaAddress, remoteChainId, remoteAddress) {
        const resource = await this.sdk.client.getAccountResource(uaAddress, `${this.module}::Channels`);
        const { states } = resource.data;
        const pathsHandle = states.handle;
        return this.sdk.client.getTableItem(pathsHandle, {
            key_type: `${this.module}::Remote`,
            value_type: `${this.module}::Channel`,
            key: { chain_id: remoteChainId.toString(), addr: Buffer.from(remoteAddress).toString('hex') },
        });
    }
    async getOutboundNonce(uaAddress, remoteChainId, remoteAddress) {
        try {
            const pathInfo = await this.getChannelState(uaAddress, remoteChainId, remoteAddress);
            const outboundNonce = pathInfo.outbound_nonce;
            return BigInt(outboundNonce);
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return BigInt(0);
            }
            throw e;
        }
    }
    async getInboundNonce(uaAddress, remoteChainId, remoteAddress) {
        try {
            const pathInfo = await this.getChannelState(uaAddress, remoteChainId, remoteAddress);
            const inboundNonce = pathInfo.inbound_nonce;
            return BigInt(inboundNonce);
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return BigInt(0);
            }
            throw e;
        }
    }
    async getPayloadHash(uaAddress, remoteChainId, remoteAddress, nonce) {
        try {
            const pathInfo = await this.getChannelState(uaAddress, remoteChainId, remoteAddress);
            const resource = pathInfo.payload_hashs;
            return await this.sdk.client.getTableItem(resource.handle, {
                key_type: 'u64',
                value_type: 'vector<u8>',
                key: nonce.toString(),
            });
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return '';
            }
            throw e;
        }
    }
    async isProofDelivered(uaAddress, remoteChainId, remoteAddress, nonce) {
        const inboundNonce = await this.getInboundNonce(uaAddress, remoteChainId, remoteAddress);
        console.log(`inboundNonce: ${inboundNonce}`);
        console.log(`nonce: ${nonce}`);
        if (nonce <= inboundNonce) {
            return true;
        }
        const payloadHash = await this.getPayloadHash(uaAddress, remoteChainId, remoteAddress, nonce);
        return payloadHash !== '';
    }
}
exports.Channel = Channel;
