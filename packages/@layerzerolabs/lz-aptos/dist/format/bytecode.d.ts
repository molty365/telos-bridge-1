import { Opcodes } from './opcodes';
import { BCS } from 'aptos';
import { Index } from './basic';
export declare abstract class Bytecode {
    abstract serialize(serializer: BCS.Serializer): void;
    static deserialize(deserializer: BCS.Deserializer): Bytecode;
}
export declare class UnaryBytecode extends Bytecode {
    opcode: Opcodes;
    constructor(opcode: Opcodes);
    serialize(serializer: BCS.Serializer): void;
    static deserialize(deserializer: BCS.Deserializer): Bytecode;
}
export declare class BinaryBytecode extends Bytecode {
    opcode: Opcodes;
    operand: Index;
    constructor(opcode: Opcodes, operand: Index);
    serialize(serializer: BCS.Serializer): void;
    static deserialize(deserializer: BCS.Deserializer): Bytecode;
}
export declare class ROP extends UnaryBytecode {
}
export declare class RET extends UnaryBytecode {
}
export declare class BR_TRUE extends BinaryBytecode {
}
export declare class BR_FALSE extends BinaryBytecode {
}
export declare class BRANCH extends BinaryBytecode {
}
export declare class LD_U8 extends Bytecode {
    opcode: Opcodes;
    value: BCS.Uint8;
    constructor(opcode: Opcodes, value: BCS.Uint8);
    serialize(serializer: BCS.Serializer): void;
    static deserialize(deserializer: BCS.Deserializer): Bytecode;
}
export declare class LD_U64 extends Bytecode {
    opcode: Opcodes;
    value: BCS.Uint64;
    constructor(opcode: Opcodes, value: BCS.Uint64);
    serialize(serializer: BCS.Serializer): void;
    static deserialize(deserializer: BCS.Deserializer): Bytecode;
}
export declare class LD_U128 extends Bytecode {
    opcode: Opcodes;
    value: BCS.Uint128;
    constructor(opcode: Opcodes, value: BCS.Uint128);
    serialize(serializer: BCS.Serializer): void;
    static deserialize(deserializer: BCS.Deserializer): Bytecode;
}
export declare class CAST_U8 extends UnaryBytecode {
}
export declare class CAST_U64 extends UnaryBytecode {
}
export declare class CAST_U128 extends UnaryBytecode {
}
export declare class LD_CONST extends BinaryBytecode {
}
export declare class LD_TRUE extends UnaryBytecode {
}
export declare class LD_FALSE extends UnaryBytecode {
}
export declare class COPY_LOC extends BinaryBytecode {
}
export declare class MOVE_LOC extends BinaryBytecode {
}
export declare class ST_LOC extends BinaryBytecode {
}
export declare class MUT_BORROW_LOC extends BinaryBytecode {
}
export declare class IMM_BORROW_LOC extends BinaryBytecode {
}
export declare class MUT_BORROW_FIELD extends BinaryBytecode {
}
export declare class MUT_BORROW_FIELD_GENERIC extends BinaryBytecode {
}
export declare class IMM_BORROW_FIELD extends BinaryBytecode {
}
export declare class IMM_BORROW_FIELD_GENERIC extends BinaryBytecode {
}
export declare class CALL extends BinaryBytecode {
}
export declare class CALL_GENERIC extends BinaryBytecode {
}
export declare class PACK extends BinaryBytecode {
}
export declare class PACK_GENERIC extends BinaryBytecode {
}
export declare class UNPACK extends BinaryBytecode {
}
export declare class UNPACK_GENERIC extends BinaryBytecode {
}
export declare class READ_REF extends UnaryBytecode {
}
export declare class WRITE_REF extends UnaryBytecode {
}
export declare class ADD extends UnaryBytecode {
}
export declare class SUB extends UnaryBytecode {
}
export declare class MUL extends UnaryBytecode {
}
export declare class MOD extends UnaryBytecode {
}
export declare class DIV extends UnaryBytecode {
}
export declare class BIT_OR extends UnaryBytecode {
}
export declare class BIT_AND extends UnaryBytecode {
}
export declare class XOR extends UnaryBytecode {
}
export declare class SHL extends UnaryBytecode {
}
export declare class SHR extends UnaryBytecode {
}
export declare class OR extends UnaryBytecode {
}
export declare class AND extends UnaryBytecode {
}
export declare class NOT extends UnaryBytecode {
}
export declare class EQ extends UnaryBytecode {
}
export declare class NEQ extends UnaryBytecode {
}
export declare class LT extends UnaryBytecode {
}
export declare class GT extends UnaryBytecode {
}
export declare class LE extends UnaryBytecode {
}
export declare class GE extends UnaryBytecode {
}
export declare class ABORT extends UnaryBytecode {
}
export declare class NOP extends UnaryBytecode {
}
export declare class EXISTS extends BinaryBytecode {
}
export declare class EXISTS_GENERIC extends BinaryBytecode {
}
export declare class MUT_BORROW_GLOBAL extends BinaryBytecode {
}
export declare class MUT_BORROW_GLOBAL_GENERIC extends BinaryBytecode {
}
export declare class IMM_BORROW_GLOBAL extends BinaryBytecode {
}
export declare class IMM_BORROW_GLOBAL_GENERIC extends BinaryBytecode {
}
export declare class MOVE_FROM extends BinaryBytecode {
}
export declare class MOVE_FROM_GENERIC extends BinaryBytecode {
}
export declare class MOVE_TO extends BinaryBytecode {
}
export declare class MOVE_TO_GENERIC extends BinaryBytecode {
}
export declare class FREEZE_REF extends UnaryBytecode {
}
export declare class VEC_PACK extends Bytecode {
    opcode: Opcodes;
    operand: Index;
    value: BCS.Uint64;
    constructor(opcode: Opcodes, operand: Index, value: BCS.Uint64);
    serialize(serializer: BCS.Serializer): void;
    static deserialize(deserializer: BCS.Deserializer): Bytecode;
}
export declare class VEC_LEN extends BinaryBytecode {
}
export declare class VEC_IMM_BORROW extends BinaryBytecode {
}
export declare class VEC_MUT_BORROW extends BinaryBytecode {
}
export declare class VEC_PUSH_BACK extends BinaryBytecode {
}
export declare class VEC_POP_BACK extends BinaryBytecode {
}
export declare class VEC_UNPACK extends Bytecode {
    opcode: Opcodes;
    operand: Index;
    value: BCS.Uint64;
    constructor(opcode: Opcodes, operand: Index, value: BCS.Uint64);
    serialize(serializer: BCS.Serializer): void;
    static deserialize(deserializer: BCS.Deserializer): Bytecode;
}
export declare class VEC_SWAP extends BinaryBytecode {
}
export declare class LD_U16 extends Bytecode {
    opcode: Opcodes;
    value: BCS.Uint16;
    constructor(opcode: Opcodes, value: BCS.Uint16);
    serialize(serializer: BCS.Serializer): void;
    static deserialize(deserializer: BCS.Deserializer): Bytecode;
}
export declare class LD_U32 extends Bytecode {
    opcode: Opcodes;
    value: BCS.Uint32;
    constructor(opcode: Opcodes, value: BCS.Uint32);
    serialize(serializer: BCS.Serializer): void;
    static deserialize(deserializer: BCS.Deserializer): Bytecode;
}
export declare class LD_U256 extends Bytecode {
    opcode: Opcodes;
    value: BCS.Bytes;
    constructor(opcode: Opcodes, value: BCS.Bytes);
    serialize(serializer: BCS.Serializer): void;
    static deserialize(deserializer: BCS.Deserializer): Bytecode;
}
export declare class CAST_U16 extends UnaryBytecode {
}
export declare class CAST_U32 extends UnaryBytecode {
}
export declare class CAST_U256 extends UnaryBytecode {
}
