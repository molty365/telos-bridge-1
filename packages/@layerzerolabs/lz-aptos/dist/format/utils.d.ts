import { BCS } from 'aptos';
import { TableType } from './table-types';
import { AddressIdentifier, Identifier } from './basic';
interface Serializable {
    serialize(serializer: BCS.Serializer): void;
}
export declare function serializeVectorWithoutLength<T extends Serializable>(value: BCS.Seq<T>, serializer: BCS.Serializer): void;
export declare function calculateContentLength<T extends Serializable>(value: BCS.Seq<T>): number;
export declare function isOutOfBoundError(e: Error): boolean;
interface CompiledUnit {
    identifiers: Identifier[];
    addressIdentifiers: AddressIdentifier[];
}
export declare function isEqual(a: Uint8Array, b: Uint8Array): boolean;
export declare function replaceTableValue<T extends CompiledUnit>(compiled: T, tableType: TableType, oldValue: any, newValue: any): void;
export declare function rebuildCompileScriptBytecode(bytecode: string | Uint8Array, addresses: {
    oldValue: Uint8Array;
    newValue: Uint8Array;
}[], names: {
    oldValue: string;
    newValue: string;
}[]): string;
export {};
