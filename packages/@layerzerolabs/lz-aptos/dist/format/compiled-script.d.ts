import { BCS } from 'aptos';
import { AbilitySet, AddressIdentifier, Code, FunctionHandle, FunctionInstantiation, Header, Identifier, Index, ModuleHandle, StructHandle, Tables } from './basic';
export declare class CompiledScriptRaw {
    header: Header;
    tables: Tables;
    typeParameters: BCS.Seq<AbilitySet>;
    parameters: Index;
    code: Code;
    constructor(header: Header, tables: Tables, typeParameters: BCS.Seq<AbilitySet>, parameters: Index, code: Code);
    static deserialize(deserializer: BCS.Deserializer): CompiledScriptRaw;
    serialize(serializer: BCS.Serializer): void;
}
export declare class CompiledScript {
    header: Header;
    table: Tables;
    moduleHandles: ModuleHandle[];
    structHandles: StructHandle[];
    functionHandles: FunctionHandle[];
    functionInstatiations: FunctionInstantiation[];
    signatures: BCS.Bytes;
    constantPool: BCS.Bytes;
    metadata: BCS.Bytes;
    identifiers: Identifier[];
    addressIdentifiers: AddressIdentifier[];
    typeParameters: BCS.Seq<AbilitySet>;
    parameters: Index;
    code: Code;
    static from(raw: CompiledScriptRaw): CompiledScript;
    serialize(serializer: BCS.Serializer): void;
}
