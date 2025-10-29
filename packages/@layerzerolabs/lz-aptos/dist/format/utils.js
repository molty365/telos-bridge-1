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
exports.rebuildCompileScriptBytecode = exports.replaceTableValue = exports.isEqual = exports.isOutOfBoundError = exports.calculateContentLength = exports.serializeVectorWithoutLength = void 0;
// Note: Serializable is not exported in aptos
const aptos_1 = require("aptos");
const table_types_1 = require("./table-types");
const basic_1 = require("./basic");
const script = __importStar(require("./compiled-script"));
const utils_1 = require("@noble/hashes/utils");
function serializeVectorWithoutLength(value, serializer) {
    value.forEach((item) => {
        item.serialize(serializer);
    });
}
exports.serializeVectorWithoutLength = serializeVectorWithoutLength;
function calculateContentLength(value) {
    const serializer = new aptos_1.BCS.Serializer();
    serializeVectorWithoutLength(value, serializer);
    return serializer.getBytes().length;
}
exports.calculateContentLength = calculateContentLength;
function isOutOfBoundError(e) {
    return e.message.match(/Reached to the end of buffer/) !== null;
}
exports.isOutOfBoundError = isOutOfBoundError;
function isEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}
exports.isEqual = isEqual;
function replaceTableValue(compiled, tableType, oldValue, newValue) {
    switch (tableType) {
        case table_types_1.TableType.IDENTIFIERS: {
            compiled.identifiers = compiled.identifiers.map((identifier, index) => {
                if (identifier.value === oldValue) {
                    return new basic_1.Identifier(newValue);
                }
                return identifier;
            });
            break;
        }
        case table_types_1.TableType.ADDRESS_IDENTIFIERS: {
            compiled.addressIdentifiers = compiled.addressIdentifiers.map((addressIdentifier, index) => {
                if (addressIdentifier.address.length != oldValue.length ||
                    addressIdentifier.address.length != newValue.length) {
                    throw new Error('Invalid address length');
                }
                if (isEqual(addressIdentifier.address, oldValue)) {
                    return new basic_1.AddressIdentifier(newValue);
                }
                return addressIdentifier;
            });
            break;
        }
        default:
            throw new Error(`Unsupported table type: ${tableType}, ${table_types_1.TableType[tableType]}`);
    }
}
exports.replaceTableValue = replaceTableValue;
function rebuildCompileScriptBytecode(bytecode, addresses, names) {
    const code = typeof bytecode === 'string' ? (0, utils_1.hexToBytes)(bytecode) : bytecode;
    const deserializer = new aptos_1.BCS.Deserializer(code);
    const raw = script.CompiledScriptRaw.deserialize(deserializer);
    const compiledScript = script.CompiledScript.from(raw);
    for (const item of addresses) {
        replaceTableValue(compiledScript, table_types_1.TableType.ADDRESS_IDENTIFIERS, item.oldValue, item.newValue);
    }
    for (const item of names) {
        replaceTableValue(compiledScript, table_types_1.TableType.IDENTIFIERS, item.oldValue, item.newValue);
    }
    const serializer = new aptos_1.BCS.Serializer();
    compiledScript.serialize(serializer);
    const result = Buffer.from(serializer.getBytes()).toString('hex');
    return result;
}
exports.rebuildCompileScriptBytecode = rebuildCompileScriptBytecode;
