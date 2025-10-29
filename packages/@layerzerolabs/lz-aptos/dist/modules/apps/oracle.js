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
exports.Oracle = void 0;
const aptos = __importStar(require("aptos"));
const utils_1 = require("../../utils");
class Oracle {
    constructor(sdk, address) {
        this.sdk = sdk;
        this.address = address;
        this.module = `${this.address}::oracle`;
        this.moduleName = 'oracle::oracle';
    }
    async getThreshold() {
        const resource = await this.sdk.client.getAccountResource(this.address, `${this.module}::Config`);
        const { threshold } = resource.data;
        return Number(threshold);
    }
    setThresholdPayload(threshold) {
        return {
            function: `${this.module}::set_threshold`,
            type_arguments: [],
            arguments: [threshold],
        };
    }
    async setThreshold(signer, threshold) {
        const transaction = this.setThresholdPayload(threshold);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async isValidator(validator) {
        const resource = await this.sdk.client.getAccountResource(this.address, `${this.module}::Config`);
        const validators = resource.data.validators;
        const val = aptos.HexString.ensure(validator).toShortString();
        return validators.includes(val);
    }
    setValidatorPayload(validator, active) {
        return {
            function: `${this.module}::set_validator`,
            type_arguments: [],
            arguments: [validator, active],
        };
    }
    async setValidator(signer, validator, active) {
        const transaction = this.setValidatorPayload(validator, active);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    setFeePayload(dstChainId, baseFee) {
        return {
            function: `${this.module}::set_fee`,
            type_arguments: [],
            arguments: [dstChainId, baseFee],
        };
    }
    async setFee(signer, dstChainId, baseFee) {
        const transaction = this.setFeePayload(dstChainId, baseFee);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    getProposePayload(hash, confirmations) {
        return {
            function: `${this.module}::propose`,
            type_arguments: [],
            arguments: [Array.from(hash), confirmations],
        };
    }
    async propose(signer, hash, confirmations) {
        const transaction = this.getProposePayload(hash, confirmations);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async isSubmitted(validator, hash, confirmations) {
        const resource = await this.sdk.client.getAccountResource(this.address, `${this.module}::ProposalStore`);
        const { proposals } = resource.data;
        try {
            const proposal = await this.sdk.client.getTableItem(proposals.handle, {
                key_type: `${this.module}::ProposalKey`,
                value_type: `${this.module}::Proposal`,
                key: {
                    hash,
                    confirmations: confirmations.toString(),
                },
            });
            if (proposal.submitted) {
                return true;
            }
            const val = aptos.HexString.ensure(validator).toShortString();
            return proposal.approved_by.includes(val);
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return false;
            }
            else {
                throw e;
            }
        }
    }
    async getResourceAddress() {
        const resource = await this.sdk.client.getAccountResource(this.address, `${this.module}::Config`);
        const { resource_addr } = resource.data;
        return (0, utils_1.fullAddress)(resource_addr).toString();
    }
    async withdrawFee(signer, receiver, amount) {
        const transaction = {
            function: `${this.module}::withdraw_fee`,
            type_arguments: [],
            arguments: [receiver, amount],
        };
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
}
exports.Oracle = Oracle;
