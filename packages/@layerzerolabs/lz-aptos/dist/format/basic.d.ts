import { BCS } from 'aptos';
import * as Bytecode from './bytecode';
export declare class Table {
    kind: BCS.Uint8;
    offset: BCS.Uint32;
    count: BCS.Uint32;
    constructor(kind: BCS.Uint8, offset: BCS.Uint32, count: BCS.Uint32);
    static deserialize(deserializer: BCS.Deserializer): Table;
    serialize(serializer: BCS.Serializer): void;
}
export declare class Tables {
    tables: BCS.Seq<Table>;
    data: BCS.Bytes;
    constructor(tables: BCS.Seq<Table>, data: BCS.Bytes);
    static deserialize(deserializer: BCS.Deserializer): Tables;
    serialize(serializer: BCS.Serializer): void;
}
export declare class AbilitySet {
    ability: BCS.Uint8;
    constructor(ability: BCS.Uint8);
    static deserialize(deserializer: BCS.Deserializer): AbilitySet;
    serialize(serializer: BCS.Serializer): void;
}
export declare class Index {
    index: BCS.Uint32;
    constructor(index: BCS.Uint32);
    static deserialize(deserializer: BCS.Deserializer): Index;
    serialize(serializer: BCS.Serializer): void;
}
export declare class Code {
    locals: Index;
    count: BCS.Uint32;
    codes: BCS.Seq<Bytecode.Bytecode>;
    constructor(locals: Index, count: BCS.Uint32, codes: BCS.Seq<Bytecode.Bytecode>);
    static deserialize(deserializer: BCS.Deserializer): Code;
    serialize(serializer: BCS.Serializer): void;
}
export declare class Header {
    magic: BCS.Bytes;
    version: BCS.Uint32;
    constructor(magic: BCS.Bytes, version: BCS.Uint32);
    static deserialize(deserializer: BCS.Deserializer): Header;
    serialize(serializer: BCS.Serializer): void;
}
export declare class ModuleHandle {
    address: Index;
    name: Index;
    constructor(address: Index, name: Index);
    static deserialize(deserializer: BCS.Deserializer): ModuleHandle;
    serialize(serializer: BCS.Serializer): void;
}
export declare class StructTypeParameter {
    constraints: AbilitySet;
    isPhantom: boolean;
    constructor(constraints: AbilitySet, isPhantom: boolean);
    static deserialize(deserializer: BCS.Deserializer): StructTypeParameter;
    serialize(serializer: BCS.Serializer): void;
}
export declare class StructHandle {
    module: Index;
    name: Index;
    abilities: AbilitySet;
    typeParameters: BCS.Seq<Index>;
    constructor(module: Index, name: Index, abilities: AbilitySet, typeParameters: BCS.Seq<Index>);
    static deserialize(deserializer: BCS.Deserializer): StructHandle;
    serialize(serializer: BCS.Serializer): void;
}
export declare class FunctionHandle {
    module: Index;
    name: Index;
    parameters: Index;
    return_: Index;
    typeParameters: BCS.Seq<AbilitySet>;
    constructor(module: Index, name: Index, parameters: Index, return_: Index, typeParameters: BCS.Seq<AbilitySet>);
    static deserialize(deserializer: BCS.Deserializer): FunctionHandle;
    serialize(serializer: BCS.Serializer): void;
}
export declare class FunctionInstantiation {
    handle: Index;
    typeParameters: BCS.Seq<Index>;
    constructor(handle: Index, typeParameters: BCS.Seq<Index>);
    static deserialize(deserializer: BCS.Deserializer): FunctionInstantiation;
    serialize(serializer: BCS.Serializer): void;
}
export declare class Identifier {
    value: string;
    constructor(value: string);
    static deserialize(deserializer: BCS.Deserializer): Identifier;
    serialize(serializer: BCS.Serializer): void;
}
export declare class AddressIdentifier {
    address: BCS.Bytes;
    constructor(address: BCS.Bytes);
    static deserialize(deserializer: BCS.Deserializer): AddressIdentifier;
    static fromJSON(value: Object): AddressIdentifier;
    serialize(serializer: BCS.Serializer): void;
    toJSON(): string;
}
export declare function load_module_handles(deserializer: BCS.Deserializer): BCS.Seq<ModuleHandle>;
export declare function load_struct_handles(deserializer: BCS.Deserializer): BCS.Seq<StructHandle>;
export declare function load_function_handles(deserializer: BCS.Deserializer): BCS.Seq<FunctionHandle>;
export declare function load_function_instantiations(deserializer: BCS.Deserializer): BCS.Seq<FunctionInstantiation>;
export declare function load_identifiers(deserializer: BCS.Deserializer): BCS.Seq<Identifier>;
export declare function load_address_identifiers(deserializer: BCS.Deserializer): BCS.Seq<AddressIdentifier>;
export declare function load_handles(deserializer: BCS.Deserializer, cls: any): any[];
