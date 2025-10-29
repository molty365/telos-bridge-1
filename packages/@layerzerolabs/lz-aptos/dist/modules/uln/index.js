"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uln = void 0;
const uln_receive_1 = require("./uln_receive");
const uln_signer_1 = require("./uln_signer");
const uln_config_1 = require("./uln_config");
const msglib_v1_0_1 = require("./msglib_v1_0");
const packet_event_1 = require("./packet_event");
class Uln {
    constructor(sdk) {
        this.Receive = new uln_receive_1.UlnReceive(sdk);
        this.Signer = new uln_signer_1.UlnSigner(sdk);
        this.Config = new uln_config_1.UlnConfig(sdk);
        this.MsgLibV1 = new msglib_v1_0_1.MsgLibV1_0(sdk);
        this.PacketEvent = new packet_event_1.PacketEvent(sdk);
    }
}
exports.Uln = Uln;
