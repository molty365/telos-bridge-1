import * as aptos from 'aptos';
export declare class TypeArgumentABI {
    readonly name: string;
    /**
     * Constructs a TypeArgumentABI instance.
     * @param name
     */
    constructor(name: string);
    serialize(serializer: aptos.BCS.Serializer): void;
    static deserialize(deserializer: aptos.BCS.Deserializer): TypeArgumentABI;
}
export declare class ArgumentABI {
    readonly name: string;
    readonly type_tag: aptos.TxnBuilderTypes.TypeTag;
    /**
     * Constructs an ArgumentABI instance.
     * @param name
     * @param type_tag
     */
    constructor(name: string, type_tag: aptos.TxnBuilderTypes.TypeTag);
    serialize(serializer: aptos.BCS.Serializer): void;
    static deserialize(deserializer: aptos.BCS.Deserializer): TypeArgumentABI;
}
export declare abstract class ScriptABI {
    abstract serialize(serializer: aptos.BCS.Serializer): void;
    static deserialize(deserializer: aptos.BCS.Deserializer): ScriptABI;
}
export declare class TransactionScriptABI extends ScriptABI {
    readonly name: string;
    readonly doc: string;
    readonly code: aptos.BCS.Bytes;
    readonly ty_args: aptos.BCS.Seq<TypeArgumentABI>;
    readonly args: aptos.BCS.Seq<ArgumentABI>;
    /**
     * Constructs a TransactionScriptABI instance.
     * @param name Entry function name
     * @param doc
     * @param code
     * @param ty_args
     * @param args
     */
    constructor(name: string, doc: string, code: aptos.BCS.Bytes, ty_args: aptos.BCS.Seq<TypeArgumentABI>, args: aptos.BCS.Seq<ArgumentABI>);
    serialize(serializer: aptos.BCS.Serializer): void;
    static load(deserializer: aptos.BCS.Deserializer): TransactionScriptABI;
}
export declare class EntryFunctionABI extends ScriptABI {
    readonly name: string;
    readonly module_name: aptos.TxnBuilderTypes.ModuleId;
    readonly doc: string;
    readonly ty_args: aptos.BCS.Seq<TypeArgumentABI>;
    readonly args: aptos.BCS.Seq<ArgumentABI>;
    /**
     * Constructs a EntryFunctionABI instance
     * @param name
     * @param module_name Fully qualified module id
     * @param doc
     * @param ty_args
     * @param args
     */
    constructor(name: string, module_name: aptos.TxnBuilderTypes.ModuleId, doc: string, ty_args: aptos.BCS.Seq<TypeArgumentABI>, args: aptos.BCS.Seq<ArgumentABI>);
    serialize(serializer: aptos.BCS.Serializer): void;
    static load(deserializer: aptos.BCS.Deserializer): EntryFunctionABI;
}
