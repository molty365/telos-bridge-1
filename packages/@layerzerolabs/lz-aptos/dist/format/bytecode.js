"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LT = exports.NEQ = exports.EQ = exports.NOT = exports.AND = exports.OR = exports.SHR = exports.SHL = exports.XOR = exports.BIT_AND = exports.BIT_OR = exports.DIV = exports.MOD = exports.MUL = exports.SUB = exports.ADD = exports.WRITE_REF = exports.READ_REF = exports.UNPACK_GENERIC = exports.UNPACK = exports.PACK_GENERIC = exports.PACK = exports.CALL_GENERIC = exports.CALL = exports.IMM_BORROW_FIELD_GENERIC = exports.IMM_BORROW_FIELD = exports.MUT_BORROW_FIELD_GENERIC = exports.MUT_BORROW_FIELD = exports.IMM_BORROW_LOC = exports.MUT_BORROW_LOC = exports.ST_LOC = exports.MOVE_LOC = exports.COPY_LOC = exports.LD_FALSE = exports.LD_TRUE = exports.LD_CONST = exports.CAST_U128 = exports.CAST_U64 = exports.CAST_U8 = exports.LD_U128 = exports.LD_U64 = exports.LD_U8 = exports.BRANCH = exports.BR_FALSE = exports.BR_TRUE = exports.RET = exports.ROP = exports.BinaryBytecode = exports.UnaryBytecode = exports.Bytecode = void 0;
exports.CAST_U256 = exports.CAST_U32 = exports.CAST_U16 = exports.LD_U256 = exports.LD_U32 = exports.LD_U16 = exports.VEC_SWAP = exports.VEC_UNPACK = exports.VEC_POP_BACK = exports.VEC_PUSH_BACK = exports.VEC_MUT_BORROW = exports.VEC_IMM_BORROW = exports.VEC_LEN = exports.VEC_PACK = exports.FREEZE_REF = exports.MOVE_TO_GENERIC = exports.MOVE_TO = exports.MOVE_FROM_GENERIC = exports.MOVE_FROM = exports.IMM_BORROW_GLOBAL_GENERIC = exports.IMM_BORROW_GLOBAL = exports.MUT_BORROW_GLOBAL_GENERIC = exports.MUT_BORROW_GLOBAL = exports.EXISTS_GENERIC = exports.EXISTS = exports.NOP = exports.ABORT = exports.GE = exports.LE = exports.GT = void 0;
const basic_1 = require("./basic");
class Bytecode {
    static deserialize(deserializer) {
        throw new Error('Not implemented');
    }
}
exports.Bytecode = Bytecode;
class UnaryBytecode extends Bytecode {
    constructor(opcode) {
        super();
        this.opcode = opcode;
    }
    serialize(serializer) {
        serializer.serializeU8(this.opcode);
    }
    static deserialize(deserializer) {
        const opcode = deserializer.deserializeU8();
        return new UnaryBytecode(opcode);
    }
}
exports.UnaryBytecode = UnaryBytecode;
class BinaryBytecode extends Bytecode {
    constructor(opcode, operand) {
        super();
        this.opcode = opcode;
        this.operand = operand;
    }
    serialize(serializer) {
        serializer.serializeU8(this.opcode);
        this.operand.serialize(serializer);
    }
    static deserialize(deserializer) {
        const opcode = deserializer.deserializeU8();
        const index = basic_1.Index.deserialize(deserializer);
        return new BinaryBytecode(opcode, index);
    }
}
exports.BinaryBytecode = BinaryBytecode;
class ROP extends UnaryBytecode {
}
exports.ROP = ROP;
class RET extends UnaryBytecode {
}
exports.RET = RET;
class BR_TRUE extends BinaryBytecode {
}
exports.BR_TRUE = BR_TRUE;
class BR_FALSE extends BinaryBytecode {
}
exports.BR_FALSE = BR_FALSE;
class BRANCH extends BinaryBytecode {
}
exports.BRANCH = BRANCH;
class LD_U8 extends Bytecode {
    constructor(opcode, value) {
        super();
        this.opcode = opcode;
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU8(this.opcode);
        serializer.serializeU8(this.value);
    }
    static deserialize(deserializer) {
        const opcode = deserializer.deserializeU8();
        const value = deserializer.deserializeU8();
        return new LD_U8(opcode, value);
    }
}
exports.LD_U8 = LD_U8;
class LD_U64 extends Bytecode {
    constructor(opcode, value) {
        super();
        this.opcode = opcode;
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU8(this.opcode);
        serializer.serializeU64(this.value);
    }
    static deserialize(deserializer) {
        const opcode = deserializer.deserializeU8();
        const value = deserializer.deserializeU64();
        return new LD_U64(opcode, value);
    }
}
exports.LD_U64 = LD_U64;
class LD_U128 extends Bytecode {
    constructor(opcode, value) {
        super();
        this.opcode = opcode;
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU8(this.opcode);
        serializer.serializeU128(this.value);
    }
    static deserialize(deserializer) {
        const opcode = deserializer.deserializeU8();
        const value = deserializer.deserializeU128();
        return new LD_U128(opcode, value);
    }
}
exports.LD_U128 = LD_U128;
class CAST_U8 extends UnaryBytecode {
}
exports.CAST_U8 = CAST_U8;
class CAST_U64 extends UnaryBytecode {
}
exports.CAST_U64 = CAST_U64;
class CAST_U128 extends UnaryBytecode {
}
exports.CAST_U128 = CAST_U128;
class LD_CONST extends BinaryBytecode {
}
exports.LD_CONST = LD_CONST;
class LD_TRUE extends UnaryBytecode {
}
exports.LD_TRUE = LD_TRUE;
class LD_FALSE extends UnaryBytecode {
}
exports.LD_FALSE = LD_FALSE;
class COPY_LOC extends BinaryBytecode {
}
exports.COPY_LOC = COPY_LOC;
class MOVE_LOC extends BinaryBytecode {
}
exports.MOVE_LOC = MOVE_LOC;
class ST_LOC extends BinaryBytecode {
}
exports.ST_LOC = ST_LOC;
class MUT_BORROW_LOC extends BinaryBytecode {
}
exports.MUT_BORROW_LOC = MUT_BORROW_LOC;
class IMM_BORROW_LOC extends BinaryBytecode {
}
exports.IMM_BORROW_LOC = IMM_BORROW_LOC;
class MUT_BORROW_FIELD extends BinaryBytecode {
}
exports.MUT_BORROW_FIELD = MUT_BORROW_FIELD;
class MUT_BORROW_FIELD_GENERIC extends BinaryBytecode {
}
exports.MUT_BORROW_FIELD_GENERIC = MUT_BORROW_FIELD_GENERIC;
class IMM_BORROW_FIELD extends BinaryBytecode {
}
exports.IMM_BORROW_FIELD = IMM_BORROW_FIELD;
class IMM_BORROW_FIELD_GENERIC extends BinaryBytecode {
}
exports.IMM_BORROW_FIELD_GENERIC = IMM_BORROW_FIELD_GENERIC;
class CALL extends BinaryBytecode {
}
exports.CALL = CALL;
class CALL_GENERIC extends BinaryBytecode {
}
exports.CALL_GENERIC = CALL_GENERIC;
class PACK extends BinaryBytecode {
}
exports.PACK = PACK;
class PACK_GENERIC extends BinaryBytecode {
}
exports.PACK_GENERIC = PACK_GENERIC;
class UNPACK extends BinaryBytecode {
}
exports.UNPACK = UNPACK;
class UNPACK_GENERIC extends BinaryBytecode {
}
exports.UNPACK_GENERIC = UNPACK_GENERIC;
class READ_REF extends UnaryBytecode {
}
exports.READ_REF = READ_REF;
class WRITE_REF extends UnaryBytecode {
}
exports.WRITE_REF = WRITE_REF;
class ADD extends UnaryBytecode {
}
exports.ADD = ADD;
class SUB extends UnaryBytecode {
}
exports.SUB = SUB;
class MUL extends UnaryBytecode {
}
exports.MUL = MUL;
class MOD extends UnaryBytecode {
}
exports.MOD = MOD;
class DIV extends UnaryBytecode {
}
exports.DIV = DIV;
class BIT_OR extends UnaryBytecode {
}
exports.BIT_OR = BIT_OR;
class BIT_AND extends UnaryBytecode {
}
exports.BIT_AND = BIT_AND;
class XOR extends UnaryBytecode {
}
exports.XOR = XOR;
class SHL extends UnaryBytecode {
}
exports.SHL = SHL;
class SHR extends UnaryBytecode {
}
exports.SHR = SHR;
class OR extends UnaryBytecode {
}
exports.OR = OR;
class AND extends UnaryBytecode {
}
exports.AND = AND;
class NOT extends UnaryBytecode {
}
exports.NOT = NOT;
class EQ extends UnaryBytecode {
}
exports.EQ = EQ;
class NEQ extends UnaryBytecode {
}
exports.NEQ = NEQ;
class LT extends UnaryBytecode {
}
exports.LT = LT;
class GT extends UnaryBytecode {
}
exports.GT = GT;
class LE extends UnaryBytecode {
}
exports.LE = LE;
class GE extends UnaryBytecode {
}
exports.GE = GE;
class ABORT extends UnaryBytecode {
}
exports.ABORT = ABORT;
class NOP extends UnaryBytecode {
}
exports.NOP = NOP;
class EXISTS extends BinaryBytecode {
}
exports.EXISTS = EXISTS;
class EXISTS_GENERIC extends BinaryBytecode {
}
exports.EXISTS_GENERIC = EXISTS_GENERIC;
class MUT_BORROW_GLOBAL extends BinaryBytecode {
}
exports.MUT_BORROW_GLOBAL = MUT_BORROW_GLOBAL;
class MUT_BORROW_GLOBAL_GENERIC extends BinaryBytecode {
}
exports.MUT_BORROW_GLOBAL_GENERIC = MUT_BORROW_GLOBAL_GENERIC;
class IMM_BORROW_GLOBAL extends BinaryBytecode {
}
exports.IMM_BORROW_GLOBAL = IMM_BORROW_GLOBAL;
class IMM_BORROW_GLOBAL_GENERIC extends BinaryBytecode {
}
exports.IMM_BORROW_GLOBAL_GENERIC = IMM_BORROW_GLOBAL_GENERIC;
class MOVE_FROM extends BinaryBytecode {
}
exports.MOVE_FROM = MOVE_FROM;
class MOVE_FROM_GENERIC extends BinaryBytecode {
}
exports.MOVE_FROM_GENERIC = MOVE_FROM_GENERIC;
class MOVE_TO extends BinaryBytecode {
}
exports.MOVE_TO = MOVE_TO;
class MOVE_TO_GENERIC extends BinaryBytecode {
}
exports.MOVE_TO_GENERIC = MOVE_TO_GENERIC;
class FREEZE_REF extends UnaryBytecode {
}
exports.FREEZE_REF = FREEZE_REF;
class VEC_PACK extends Bytecode {
    constructor(opcode, operand, value) {
        super();
        this.opcode = opcode;
        this.operand = operand;
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU8(this.opcode);
        this.operand.serialize(serializer);
        serializer.serializeU64(this.value);
    }
    static deserialize(deserializer) {
        const opcode = deserializer.deserializeU8();
        const operand = basic_1.Index.deserialize(deserializer);
        const value = deserializer.deserializeU64();
        return new VEC_PACK(opcode, operand, value);
    }
}
exports.VEC_PACK = VEC_PACK;
class VEC_LEN extends BinaryBytecode {
}
exports.VEC_LEN = VEC_LEN;
class VEC_IMM_BORROW extends BinaryBytecode {
}
exports.VEC_IMM_BORROW = VEC_IMM_BORROW;
class VEC_MUT_BORROW extends BinaryBytecode {
}
exports.VEC_MUT_BORROW = VEC_MUT_BORROW;
class VEC_PUSH_BACK extends BinaryBytecode {
}
exports.VEC_PUSH_BACK = VEC_PUSH_BACK;
class VEC_POP_BACK extends BinaryBytecode {
}
exports.VEC_POP_BACK = VEC_POP_BACK;
class VEC_UNPACK extends Bytecode {
    constructor(opcode, operand, value) {
        super();
        this.opcode = opcode;
        this.operand = operand;
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU8(this.opcode);
        this.operand.serialize(serializer);
        serializer.serializeU64(this.value);
    }
    static deserialize(deserializer) {
        const opcode = deserializer.deserializeU8();
        const operand = basic_1.Index.deserialize(deserializer);
        const value = deserializer.deserializeU64();
        return new VEC_UNPACK(opcode, operand, value);
    }
}
exports.VEC_UNPACK = VEC_UNPACK;
class VEC_SWAP extends BinaryBytecode {
}
exports.VEC_SWAP = VEC_SWAP;
class LD_U16 extends Bytecode {
    constructor(opcode, value) {
        super();
        this.opcode = opcode;
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU8(this.opcode);
        serializer.serializeU16(this.value);
    }
    static deserialize(deserializer) {
        const opcode = deserializer.deserializeU8();
        const value = deserializer.deserializeU16();
        return new LD_U16(opcode, value);
    }
}
exports.LD_U16 = LD_U16;
class LD_U32 extends Bytecode {
    constructor(opcode, value) {
        super();
        this.opcode = opcode;
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU8(this.opcode);
        serializer.serializeU32(this.value);
    }
    static deserialize(deserializer) {
        const opcode = deserializer.deserializeU8();
        const value = deserializer.deserializeU16();
        return new LD_U32(opcode, value);
    }
}
exports.LD_U32 = LD_U32;
class LD_U256 extends Bytecode {
    constructor(opcode, value) {
        super();
        this.opcode = opcode;
        this.value = value;
    }
    serialize(serializer) {
        throw new Error('Method not implemented.');
    }
    static deserialize(deserializer) {
        throw new Error('Method not implemented.');
    }
}
exports.LD_U256 = LD_U256;
class CAST_U16 extends UnaryBytecode {
}
exports.CAST_U16 = CAST_U16;
class CAST_U32 extends UnaryBytecode {
}
exports.CAST_U32 = CAST_U32;
class CAST_U256 extends UnaryBytecode {
}
exports.CAST_U256 = CAST_U256;
