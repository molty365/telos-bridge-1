"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompiledScript = exports.CompiledScriptRaw = void 0;
const aptos_1 = require("aptos");
const basic_1 = require("./basic");
const table_types_1 = require("./table-types");
const utils_1 = require("./utils");
class CompiledScriptRaw {
    constructor(header, tables, typeParameters, parameters, code) {
        this.header = header;
        this.tables = tables;
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.code = code;
    }
    static deserialize(deserializer) {
        const header = basic_1.Header.deserialize(deserializer);
        const table = basic_1.Tables.deserialize(deserializer);
        const typeParameters = aptos_1.BCS.deserializeVector(deserializer, basic_1.AbilitySet);
        const parameters = basic_1.Index.deserialize(deserializer);
        const code = basic_1.Code.deserialize(deserializer);
        return new CompiledScriptRaw(header, table, typeParameters, parameters, code);
    }
    serialize(serializer) {
        this.header.serialize(serializer);
        this.tables.serialize(serializer);
        aptos_1.BCS.serializeVector(this.typeParameters, serializer);
        this.parameters.serialize(serializer);
        this.code.serialize(serializer);
    }
}
exports.CompiledScriptRaw = CompiledScriptRaw;
class CompiledScript {
    constructor() {
        this.moduleHandles = [];
        this.structHandles = [];
        this.functionHandles = [];
        this.functionInstatiations = [];
        this.identifiers = [];
        this.addressIdentifiers = [];
    }
    static from(raw) {
        // return new CompiledScript(raw)
        const script = new CompiledScript();
        script.header = raw.header;
        script.table = raw.tables;
        script.typeParameters = raw.typeParameters;
        script.parameters = raw.parameters;
        script.code = raw.code;
        for (const table of raw.tables.tables) {
            const data = raw.tables.data.subarray(table.offset, table.offset + table.count);
            const deserializer = new aptos_1.BCS.Deserializer(data);
            switch (table.kind) {
                case table_types_1.TableType.MODULE_HANDLES:
                    script.moduleHandles = (0, basic_1.load_module_handles)(deserializer);
                    break;
                case table_types_1.TableType.STRUCT_HANDLES:
                    script.structHandles = (0, basic_1.load_struct_handles)(deserializer);
                    break;
                case table_types_1.TableType.FUNCTION_HANDLES:
                    script.functionHandles = (0, basic_1.load_function_handles)(deserializer);
                    break;
                case table_types_1.TableType.FUNCTION_INST:
                    script.functionInstatiations = (0, basic_1.load_function_instantiations)(deserializer);
                    break;
                case table_types_1.TableType.SIGNATURES:
                    script.signatures = data;
                    break;
                case table_types_1.TableType.CONSTANT_POOL:
                    script.constantPool = data;
                    break;
                case table_types_1.TableType.METADATA:
                    script.metadata = data;
                    break;
                case table_types_1.TableType.IDENTIFIERS:
                    script.identifiers = (0, basic_1.load_identifiers)(deserializer);
                    break;
                case table_types_1.TableType.ADDRESS_IDENTIFIERS:
                    script.addressIdentifiers = (0, basic_1.load_address_identifiers)(deserializer);
                    break;
                default:
                    throw new Error(`Unsupported table type: ${table.kind}, ${table_types_1.TableType[table.kind]}`);
            }
        }
        return script;
    }
    serialize(serializer) {
        this.header.serialize(serializer);
        const tables = this.table.tables.sort((a, b) => a.kind - b.kind);
        serializer.serializeU32AsUleb128(tables.length);
        let offset = 0;
        for (const table of tables) {
            table.offset = offset;
            switch (table.kind) {
                case table_types_1.TableType.IDENTIFIERS:
                    const length = (0, utils_1.calculateContentLength)(this.identifiers);
                    table.count = length;
                    break;
            }
            table.serialize(serializer);
            offset += table.count;
        }
        for (const table of tables) {
            switch (table.kind) {
                case table_types_1.TableType.MODULE_HANDLES:
                    (0, utils_1.serializeVectorWithoutLength)(this.moduleHandles, serializer);
                    break;
                case table_types_1.TableType.STRUCT_HANDLES:
                    (0, utils_1.serializeVectorWithoutLength)(this.structHandles, serializer);
                    break;
                case table_types_1.TableType.FUNCTION_HANDLES:
                    (0, utils_1.serializeVectorWithoutLength)(this.functionHandles, serializer);
                    break;
                case table_types_1.TableType.FUNCTION_INST:
                    (0, utils_1.serializeVectorWithoutLength)(this.functionInstatiations, serializer);
                    break;
                case table_types_1.TableType.SIGNATURES:
                    serializer.serializeFixedBytes(this.signatures);
                    break;
                case table_types_1.TableType.CONSTANT_POOL:
                    serializer.serializeFixedBytes(this.constantPool);
                    break;
                case table_types_1.TableType.METADATA:
                    serializer.serializeFixedBytes(this.metadata);
                    break;
                case table_types_1.TableType.IDENTIFIERS:
                    (0, utils_1.serializeVectorWithoutLength)(this.identifiers, serializer);
                    break;
                case table_types_1.TableType.ADDRESS_IDENTIFIERS:
                    (0, utils_1.serializeVectorWithoutLength)(this.addressIdentifiers, serializer);
                    break;
                default:
                    throw new Error(`Unsupported table type: ${table.kind}, ${table_types_1.TableType[table.kind]}`);
            }
        }
        aptos_1.BCS.serializeVector(this.typeParameters, serializer);
        this.parameters.serialize(serializer);
        this.code.serialize(serializer);
    }
}
exports.CompiledScript = CompiledScript;
