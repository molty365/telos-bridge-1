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
exports.load_handles = exports.load_address_identifiers = exports.load_identifiers = exports.load_function_instantiations = exports.load_function_handles = exports.load_struct_handles = exports.load_module_handles = exports.AddressIdentifier = exports.Identifier = exports.FunctionInstantiation = exports.FunctionHandle = exports.StructHandle = exports.StructTypeParameter = exports.ModuleHandle = exports.Header = exports.Code = exports.Index = exports.AbilitySet = exports.Tables = exports.Table = void 0;
const aptos = __importStar(require("aptos"));
const aptos_1 = require("aptos");
const opcodes_1 = require("./opcodes");
const Bytecode = __importStar(require("./bytecode"));
const utils_1 = require("./utils");
class Table {
    constructor(kind, offset, count) {
        this.kind = kind;
        this.offset = offset;
        this.count = count;
    }
    static deserialize(deserializer) {
        const kind = deserializer.deserializeUleb128AsU32();
        const offset = deserializer.deserializeUleb128AsU32();
        const count = deserializer.deserializeUleb128AsU32();
        return new Table(kind, offset, count);
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(this.kind);
        serializer.serializeU32AsUleb128(this.offset);
        serializer.serializeU32AsUleb128(this.count);
    }
}
exports.Table = Table;
class Tables {
    constructor(tables, data) {
        this.tables = tables;
        this.data = data;
    }
    static deserialize(deserializer) {
        const count = deserializer.deserializeUleb128AsU32();
        let tables = [];
        for (let i = 0; i < count; i++) {
            const table = Table.deserialize(deserializer);
            tables.push(table);
        }
        tables = tables.sort((a, b) => a.kind - b.kind);
        let currentOffset = 0;
        let tableTypes = new Set();
        for (let table of tables) {
            if (table.offset != currentOffset) {
                throw new Error('Invalid table offset');
            }
            if (table.count == 0) {
                throw new Error('Invalid table count');
            }
            if (tableTypes.has(table.kind)) {
                throw new Error('Duplicate table kind');
            }
            tableTypes.add(table.kind);
            currentOffset += table.count;
        }
        const data = deserializer.deserializeFixedBytes(currentOffset);
        return new Tables(tables, data);
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(this.tables.length);
        const tables = this.tables.sort((a, b) => a.kind - b.kind);
        for (let table of tables) {
            table.serialize(serializer);
        }
        serializer.serializeFixedBytes(this.data);
    }
}
exports.Tables = Tables;
class AbilitySet {
    constructor(ability) {
        this.ability = ability;
    }
    static deserialize(deserializer) {
        const ability = deserializer.deserializeUleb128AsU32();
        if (ability > 0xff) {
            throw new Error('Invalid ability');
        }
        return new AbilitySet(ability);
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(this.ability);
    }
}
exports.AbilitySet = AbilitySet;
class Index {
    constructor(index) {
        this.index = index;
    }
    static deserialize(deserializer) {
        const index = deserializer.deserializeUleb128AsU32();
        return new Index(index);
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(this.index);
    }
}
exports.Index = Index;
class Code {
    constructor(locals, count, codes) {
        this.locals = locals;
        this.count = count;
        this.codes = codes;
    }
    static deserialize(deserializer) {
        const locals = Index.deserialize(deserializer);
        const count = deserializer.deserializeUleb128AsU32();
        let codes = [];
        for (let i = 0; i < count; i++) {
            const opcode = deserializer.deserializeU8();
            const bytecode = ((opcode) => {
                switch (opcode) {
                    case opcodes_1.Opcodes.POP:
                        return new Bytecode.ROP(opcode);
                    case opcodes_1.Opcodes.RET:
                        return new Bytecode.RET(opcode);
                    case opcodes_1.Opcodes.BR_TRUE:
                        return new Bytecode.BR_TRUE(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.BR_FALSE:
                        return new Bytecode.BR_FALSE(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.BRANCH:
                        return new Bytecode.BRANCH(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.LD_U8:
                        return new Bytecode.LD_U8(opcode, deserializer.deserializeU8());
                    case opcodes_1.Opcodes.LD_U64:
                        return new Bytecode.LD_U64(opcode, deserializer.deserializeU64());
                    case opcodes_1.Opcodes.LD_U128:
                        return new Bytecode.LD_U128(opcode, deserializer.deserializeU128());
                    case opcodes_1.Opcodes.CAST_U8:
                        return new Bytecode.CAST_U8(opcode);
                    case opcodes_1.Opcodes.CAST_U64:
                        return new Bytecode.CAST_U64(opcode);
                    case opcodes_1.Opcodes.CAST_U128:
                        return new Bytecode.CAST_U128(opcode);
                    case opcodes_1.Opcodes.LD_CONST:
                        return new Bytecode.LD_CONST(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.LD_TRUE:
                        return new Bytecode.LD_TRUE(opcode);
                    case opcodes_1.Opcodes.LD_FALSE:
                        return new Bytecode.LD_FALSE(opcode);
                    case opcodes_1.Opcodes.COPY_LOC:
                        return new Bytecode.COPY_LOC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.MOVE_LOC:
                        return new Bytecode.MOVE_LOC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.ST_LOC:
                        return new Bytecode.ST_LOC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.MUT_BORROW_LOC:
                        return new Bytecode.MUT_BORROW_LOC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.IMM_BORROW_LOC:
                        return new Bytecode.IMM_BORROW_LOC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.MUT_BORROW_FIELD:
                        return new Bytecode.MUT_BORROW_FIELD(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.MUT_BORROW_FIELD_GENERIC:
                        return new Bytecode.MUT_BORROW_FIELD_GENERIC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.IMM_BORROW_FIELD:
                        return new Bytecode.IMM_BORROW_FIELD(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.IMM_BORROW_FIELD_GENERIC:
                        return new Bytecode.IMM_BORROW_FIELD_GENERIC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.CALL:
                        return new Bytecode.CALL(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.CALL_GENERIC:
                        return new Bytecode.CALL_GENERIC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.PACK:
                        return new Bytecode.PACK(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.PACK_GENERIC:
                        return new Bytecode.PACK_GENERIC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.UNPACK:
                        return new Bytecode.UNPACK(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.UNPACK_GENERIC:
                        return new Bytecode.UNPACK_GENERIC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.READ_REF:
                        return new Bytecode.READ_REF(opcode);
                    case opcodes_1.Opcodes.WRITE_REF:
                        return new Bytecode.WRITE_REF(opcode);
                    case opcodes_1.Opcodes.ADD:
                        return new Bytecode.ADD(opcode);
                    case opcodes_1.Opcodes.SUB:
                        return new Bytecode.SUB(opcode);
                    case opcodes_1.Opcodes.MUL:
                        return new Bytecode.MUL(opcode);
                    case opcodes_1.Opcodes.MOD:
                        return new Bytecode.MOD(opcode);
                    case opcodes_1.Opcodes.DIV:
                        return new Bytecode.DIV(opcode);
                    case opcodes_1.Opcodes.BIT_OR:
                        return new Bytecode.BIT_OR(opcode);
                    case opcodes_1.Opcodes.BIT_AND:
                        return new Bytecode.BIT_AND(opcode);
                    case opcodes_1.Opcodes.XOR:
                        return new Bytecode.XOR(opcode);
                    case opcodes_1.Opcodes.SHL:
                        return new Bytecode.SHL(opcode);
                    case opcodes_1.Opcodes.SHR:
                        return new Bytecode.SHR(opcode);
                    case opcodes_1.Opcodes.OR:
                        return new Bytecode.OR(opcode);
                    case opcodes_1.Opcodes.AND:
                        return new Bytecode.AND(opcode);
                    case opcodes_1.Opcodes.NOT:
                        return new Bytecode.NOT(opcode);
                    case opcodes_1.Opcodes.EQ:
                        return new Bytecode.EQ(opcode);
                    case opcodes_1.Opcodes.NEQ:
                        return new Bytecode.NEQ(opcode);
                    case opcodes_1.Opcodes.LT:
                        return new Bytecode.LT(opcode);
                    case opcodes_1.Opcodes.GT:
                        return new Bytecode.GT(opcode);
                    case opcodes_1.Opcodes.LE:
                        return new Bytecode.LE(opcode);
                    case opcodes_1.Opcodes.GE:
                        return new Bytecode.GE(opcode);
                    case opcodes_1.Opcodes.ABORT:
                        return new Bytecode.ABORT(opcode);
                    case opcodes_1.Opcodes.NOP:
                        return new Bytecode.NOP(opcode);
                    case opcodes_1.Opcodes.EXISTS:
                        return new Bytecode.EXISTS(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.EXISTS_GENERIC:
                        return new Bytecode.EXISTS_GENERIC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.MUT_BORROW_GLOBAL:
                        return new Bytecode.MUT_BORROW_GLOBAL(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.MUT_BORROW_GLOBAL_GENERIC:
                        return new Bytecode.MUT_BORROW_GLOBAL_GENERIC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.IMM_BORROW_GLOBAL:
                        return new Bytecode.IMM_BORROW_GLOBAL(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.IMM_BORROW_GLOBAL_GENERIC:
                        return new Bytecode.IMM_BORROW_GLOBAL_GENERIC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.MOVE_FROM:
                        return new Bytecode.MOVE_FROM(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.MOVE_FROM_GENERIC:
                        return new Bytecode.MOVE_FROM_GENERIC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.MOVE_TO:
                        return new Bytecode.MOVE_TO(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.MOVE_TO_GENERIC:
                        return new Bytecode.MOVE_TO_GENERIC(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.FREEZE_REF:
                        return new Bytecode.FREEZE_REF(opcode);
                    case opcodes_1.Opcodes.VEC_PACK:
                        return new Bytecode.VEC_PACK(opcode, Index.deserialize(deserializer), deserializer.deserializeU64());
                    case opcodes_1.Opcodes.VEC_LEN:
                        return new Bytecode.VEC_LEN(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.VEC_IMM_BORROW:
                        return new Bytecode.VEC_IMM_BORROW(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.VEC_MUT_BORROW:
                        return new Bytecode.VEC_MUT_BORROW(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.VEC_PUSH_BACK:
                        return new Bytecode.VEC_PUSH_BACK(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.VEC_POP_BACK:
                        return new Bytecode.VEC_POP_BACK(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.VEC_UNPACK:
                        return new Bytecode.VEC_UNPACK(opcode, Index.deserialize(deserializer), deserializer.deserializeU64());
                    case opcodes_1.Opcodes.VEC_SWAP:
                        return new Bytecode.VEC_SWAP(opcode, Index.deserialize(deserializer));
                    case opcodes_1.Opcodes.LD_U16:
                        return new Bytecode.LD_U16(opcode, deserializer.deserializeU16());
                    case opcodes_1.Opcodes.LD_U32:
                        return new Bytecode.LD_U32(opcode, deserializer.deserializeU32());
                    case opcodes_1.Opcodes.LD_U256:
                        throw new Error('Not supported yet');
                    case opcodes_1.Opcodes.CAST_U16:
                        return new Bytecode.CAST_U16(opcode);
                    case opcodes_1.Opcodes.CAST_U32:
                        return new Bytecode.CAST_U32(opcode);
                    case opcodes_1.Opcodes.CAST_U256:
                        return new Bytecode.CAST_U256(opcode);
                    default:
                        throw new Error(`Unknown opcode: ${opcode}`);
                }
            })(opcode);
            codes.push(bytecode);
        }
        return new Code(locals, count, codes);
    }
    serialize(serializer) {
        this.locals.serialize(serializer);
        serializer.serializeU32AsUleb128(this.count);
        for (const code of this.codes) {
            code.serialize(serializer);
        }
    }
}
exports.Code = Code;
class Header {
    constructor(magic, version) {
        this.magic = magic;
        this.version = version;
    }
    static deserialize(deserializer) {
        const magic = deserializer.deserializeFixedBytes(4);
        const version = deserializer.deserializeU32();
        return new Header(magic, version);
    }
    serialize(serializer) {
        serializer.serializeFixedBytes(this.magic);
        serializer.serializeU32(this.version);
    }
}
exports.Header = Header;
class ModuleHandle {
    constructor(address, name) {
        this.address = address;
        this.name = name;
    }
    static deserialize(deserializer) {
        const address = Index.deserialize(deserializer);
        const name = Index.deserialize(deserializer);
        return new ModuleHandle(address, name);
    }
    serialize(serializer) {
        this.address.serialize(serializer);
        this.name.serialize(serializer);
    }
}
exports.ModuleHandle = ModuleHandle;
class StructTypeParameter {
    constructor(constraints, isPhantom) {
        this.constraints = constraints;
        this.isPhantom = isPhantom;
    }
    static deserialize(deserializer) {
        const constraints = AbilitySet.deserialize(deserializer);
        const isPhantom = deserializer.deserializeUleb128AsU32() !== 0;
        return new StructTypeParameter(constraints, isPhantom);
    }
    serialize(serializer) {
        this.constraints.serialize(serializer);
        serializer.serializeU32AsUleb128(this.isPhantom ? 1 : 0);
    }
}
exports.StructTypeParameter = StructTypeParameter;
class StructHandle {
    constructor(module, name, abilities, typeParameters) {
        this.module = module;
        this.name = name;
        this.abilities = abilities;
        this.typeParameters = typeParameters;
    }
    static deserialize(deserializer) {
        const module = Index.deserialize(deserializer);
        const name = Index.deserialize(deserializer);
        const abilities = AbilitySet.deserialize(deserializer);
        const typeParameters = aptos_1.BCS.deserializeVector(deserializer, StructTypeParameter);
        return new StructHandle(module, name, abilities, typeParameters);
    }
    serialize(serializer) {
        this.module.serialize(serializer);
        this.name.serialize(serializer);
        this.abilities.serialize(serializer);
        aptos_1.BCS.serializeVector(this.typeParameters, serializer);
    }
}
exports.StructHandle = StructHandle;
class FunctionHandle {
    constructor(module, name, parameters, return_, typeParameters) {
        this.module = module;
        this.name = name;
        this.parameters = parameters;
        this.return_ = return_;
        this.typeParameters = typeParameters;
    }
    static deserialize(deserializer) {
        const module = Index.deserialize(deserializer);
        const name = Index.deserialize(deserializer);
        const parameters = Index.deserialize(deserializer);
        const return_ = Index.deserialize(deserializer);
        const typeParameters = aptos_1.BCS.deserializeVector(deserializer, AbilitySet);
        return new FunctionHandle(module, name, parameters, return_, typeParameters);
    }
    serialize(serializer) {
        this.module.serialize(serializer);
        this.name.serialize(serializer);
        this.parameters.serialize(serializer);
        this.return_.serialize(serializer);
        aptos_1.BCS.serializeVector(this.typeParameters, serializer);
    }
}
exports.FunctionHandle = FunctionHandle;
class FunctionInstantiation {
    constructor(handle, typeParameters) {
        this.handle = handle;
        this.typeParameters = typeParameters;
    }
    static deserialize(deserializer) {
        const handle = Index.deserialize(deserializer);
        const typeParameters = aptos_1.BCS.deserializeVector(deserializer, Index);
        return new FunctionInstantiation(handle, typeParameters);
    }
    serialize(serializer) {
        this.handle.serialize(serializer);
        aptos_1.BCS.serializeVector(this.typeParameters, serializer);
    }
}
exports.FunctionInstantiation = FunctionInstantiation;
class Identifier {
    constructor(value) {
        this.value = value;
    }
    static deserialize(deserializer) {
        const value = deserializer.deserializeStr();
        return new Identifier(value);
    }
    serialize(serializer) {
        serializer.serializeStr(this.value);
    }
}
exports.Identifier = Identifier;
// NOTE: AccountAddress is 20/32/16 bytes
class AddressIdentifier {
    constructor(address) {
        this.address = address;
    }
    static deserialize(deserializer) {
        const address = deserializer.deserializeFixedBytes(32);
        return new AddressIdentifier(address);
    }
    static fromJSON(value) {
        const bytes = aptos.HexString.ensure(value.toString()).toUint8Array();
        return new AddressIdentifier(bytes);
    }
    serialize(serializer) {
        serializer.serializeFixedBytes(this.address);
    }
    toJSON() {
        return aptos.HexString.fromUint8Array(this.address).toString();
    }
}
exports.AddressIdentifier = AddressIdentifier;
function load_module_handles(deserializer) {
    return load_handles(deserializer, ModuleHandle);
}
exports.load_module_handles = load_module_handles;
function load_struct_handles(deserializer) {
    return load_handles(deserializer, StructHandle);
}
exports.load_struct_handles = load_struct_handles;
function load_function_handles(deserializer) {
    return load_handles(deserializer, FunctionHandle);
}
exports.load_function_handles = load_function_handles;
function load_function_instantiations(deserializer) {
    return load_handles(deserializer, FunctionInstantiation);
}
exports.load_function_instantiations = load_function_instantiations;
function load_identifiers(deserializer) {
    return load_handles(deserializer, Identifier);
}
exports.load_identifiers = load_identifiers;
function load_address_identifiers(deserializer) {
    return load_handles(deserializer, AddressIdentifier);
}
exports.load_address_identifiers = load_address_identifiers;
function load_handles(deserializer, cls) {
    let handles = [];
    try {
        while (true) {
            const handle = cls.deserialize(deserializer);
            handles.push(handle);
        }
    }
    catch (e) {
        if (!(e instanceof Error && (0, utils_1.isOutOfBoundError)(e))) {
            throw e;
        }
    }
    return handles;
}
exports.load_handles = load_handles;
