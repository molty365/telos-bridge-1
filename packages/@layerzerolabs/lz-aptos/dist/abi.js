"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
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
exports.EntryFunctionABI = exports.TransactionScriptABI = exports.ScriptABI = exports.ArgumentABI = exports.TypeArgumentABI = void 0;
const aptos = __importStar(require("aptos"));
class TypeArgumentABI {
    /**
     * Constructs a TypeArgumentABI instance.
     * @param name
     */
    constructor(name) {
        this.name = name;
    }
    serialize(serializer) {
        serializer.serializeStr(this.name);
    }
    static deserialize(deserializer) {
        const name = deserializer.deserializeStr();
        return new TypeArgumentABI(name);
    }
}
exports.TypeArgumentABI = TypeArgumentABI;
class ArgumentABI {
    /**
     * Constructs an ArgumentABI instance.
     * @param name
     * @param type_tag
     */
    constructor(name, type_tag) {
        this.name = name;
        this.type_tag = type_tag;
    }
    serialize(serializer) {
        serializer.serializeStr(this.name);
        this.type_tag.serialize(serializer);
    }
    static deserialize(deserializer) {
        const name = deserializer.deserializeStr();
        const typeTag = aptos.TxnBuilderTypes.TypeTag.deserialize(deserializer);
        return new ArgumentABI(name, typeTag);
    }
}
exports.ArgumentABI = ArgumentABI;
class ScriptABI {
    static deserialize(deserializer) {
        const index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return TransactionScriptABI.load(deserializer);
            case 1:
                return EntryFunctionABI.load(deserializer);
            default:
                throw new Error(`Unknown variant index for TransactionPayload: ${index}`);
        }
    }
}
exports.ScriptABI = ScriptABI;
class TransactionScriptABI extends ScriptABI {
    /**
     * Constructs a TransactionScriptABI instance.
     * @param name Entry function name
     * @param doc
     * @param code
     * @param ty_args
     * @param args
     */
    constructor(name, doc, code, ty_args, args) {
        super();
        this.name = name;
        this.doc = doc;
        this.code = code;
        this.ty_args = ty_args;
        this.args = args;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(0);
        serializer.serializeStr(this.name);
        serializer.serializeStr(this.doc);
        serializer.serializeBytes(this.code);
        aptos.BCS.serializeVector(this.ty_args, serializer);
        aptos.BCS.serializeVector(this.args, serializer);
    }
    static load(deserializer) {
        const name = deserializer.deserializeStr();
        const doc = deserializer.deserializeStr();
        const code = deserializer.deserializeBytes();
        const tyArgs = aptos.BCS.deserializeVector(deserializer, TypeArgumentABI);
        const args = aptos.BCS.deserializeVector(deserializer, ArgumentABI);
        return new TransactionScriptABI(name, doc, code, tyArgs, args);
    }
}
exports.TransactionScriptABI = TransactionScriptABI;
class EntryFunctionABI extends ScriptABI {
    /**
     * Constructs a EntryFunctionABI instance
     * @param name
     * @param module_name Fully qualified module id
     * @param doc
     * @param ty_args
     * @param args
     */
    constructor(name, module_name, doc, ty_args, args) {
        super();
        this.name = name;
        this.module_name = module_name;
        this.doc = doc;
        this.ty_args = ty_args;
        this.args = args;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(1);
        serializer.serializeStr(this.name);
        this.module_name.serialize(serializer);
        serializer.serializeStr(this.doc);
        aptos.BCS.serializeVector(this.ty_args, serializer);
        aptos.BCS.serializeVector(this.args, serializer);
    }
    static load(deserializer) {
        const name = deserializer.deserializeStr();
        const moduleName = aptos.TxnBuilderTypes.ModuleId.deserialize(deserializer);
        const doc = deserializer.deserializeStr();
        const tyArgs = aptos.BCS.deserializeVector(deserializer, TypeArgumentABI);
        const args = aptos.BCS.deserializeVector(deserializer, ArgumentABI);
        return new EntryFunctionABI(name, moduleName, doc, tyArgs, args);
    }
}
exports.EntryFunctionABI = EntryFunctionABI;
