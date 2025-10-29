"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketEvent = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
class PacketEvent {
    constructor(sdk) {
        this.sdk = sdk;
        this.module = `${sdk.accounts.layerzero}::packet_event`;
    }
    async getInboundEvents(start, limit) {
        return this.sdk.client.getEventsByEventHandle(this.sdk.accounts.layerzero, `${this.module}::EventStore`, 'inbound_events', { start, limit });
    }
    async getInboundEventCount() {
        const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::EventStore`);
        const { inbound_events } = resource.data;
        return new bn_js_1.default(inbound_events.counter).toNumber();
    }
    async getOutboundEvents(start, limit) {
        return this.sdk.client.getEventsByEventHandle(this.sdk.accounts.layerzero, `${this.module}::EventStore`, 'outbound_events', { start, limit });
    }
    async getOutboundEventCount() {
        const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::EventStore`);
        const { outbound_events } = resource.data;
        return new bn_js_1.default(outbound_events.counter).toNumber();
    }
}
exports.PacketEvent = PacketEvent;
