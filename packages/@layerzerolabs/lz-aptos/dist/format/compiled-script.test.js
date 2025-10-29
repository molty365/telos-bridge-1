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
const script = __importStar(require("./compiled-script"));
const aptos = __importStar(require("aptos"));
const aptos_1 = require("aptos");
const utils_1 = require("./utils");
const table_types_1 = require("./table-types");
describe('CompiledScript', () => {
    const BYTECODE = 'a11ceb0b0500000006010006020604030a0a051419072d4c087960000001010202000307000104030100020504020004060c030a020a02010a08000003030a020a0202060c0a080009747970655f696e666f07636f756e74657208656e64706f696e740854797065496e666f106c7a5f726563656976655f7479706573166275696c645f6c7a5f726563656976655f74797065730000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000bead000000000000000000000000000000000000000000000000000000000000cafe000001090b010b020b0311000c040b000b04110102';
    const BYTECODE2 = 'a11ceb0b0500000006010006020604030a0a051419072d50087d60000001010202000307000104030100020504020004060c030a020a02010a08000003030a020a0202060c0a080009747970655f696e666f0b636f696e5f62726964676508656e64706f696e740854797065496e666f106c7a5f726563656976655f7479706573166275696c645f6c7a5f726563656976655f74797065730000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000beef000000000000000000000000000000000000000000000000000000000000cafe000001090b010b020b0311000c040b000b04110102';
    it('deserialize/serialize bytecode with CompileScriptRaw', () => {
        const deserializer = new aptos_1.BCS.Deserializer(Buffer.from(BYTECODE, 'hex'));
        const compiledScript = script.CompiledScriptRaw.deserialize(deserializer);
        expect(compiledScript).toBeTruthy();
        const serializer = new aptos_1.BCS.Serializer();
        compiledScript.serialize(serializer);
        const actual = Buffer.from(serializer.getBytes()).toString('hex');
        expect(actual).toEqual(BYTECODE);
    });
    it('deserialize with CompileScriptRaw, and serialize with CompiledScript', () => {
        const deserializer = new aptos_1.BCS.Deserializer(Buffer.from(BYTECODE, 'hex'));
        const raw = script.CompiledScriptRaw.deserialize(deserializer);
        expect(raw).toBeTruthy();
        {
            const serializer = new aptos_1.BCS.Serializer();
            raw.serialize(serializer);
            const actual = Buffer.from(serializer.getBytes()).toString('hex');
            expect(actual).toEqual(BYTECODE);
        }
        const compiledScript = script.CompiledScript.from(raw);
        expect(compiledScript).toBeTruthy();
        // console.log(compiledScript)
        // console.log(JSON.stringify(compiledScript, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2))
        (0, utils_1.replaceTableValue)(compiledScript, table_types_1.TableType.IDENTIFIERS, 'counter', 'coin_bridge');
        (0, utils_1.replaceTableValue)(compiledScript, table_types_1.TableType.ADDRESS_IDENTIFIERS, aptos.HexString.ensure('0x000000000000000000000000000000000000000000000000000000000000bead').toUint8Array(), aptos.HexString.ensure('0x000000000000000000000000000000000000000000000000000000000000beef').toUint8Array());
        const serializer = new aptos_1.BCS.Serializer();
        compiledScript.serialize(serializer);
        const actual = Buffer.from(serializer.getBytes()).toString('hex');
        expect(actual).toEqual(BYTECODE2);
    });
    it('', () => {
        const actual = (0, utils_1.rebuildCompileScriptBytecode)(BYTECODE2, [
            {
                oldValue: aptos.HexString.ensure('0x000000000000000000000000000000000000000000000000000000000000beef').toUint8Array(),
                newValue: aptos.HexString.ensure('0x000000000000000000000000000000000000000000000000000000000000bead').toUint8Array(),
            },
        ], [{ oldValue: 'coin_bridge', newValue: 'counter' }]);
        expect(actual).toEqual(BYTECODE);
    });
});
