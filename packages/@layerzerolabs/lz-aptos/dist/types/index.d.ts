/// <reference types="node" />
import * as aptos from 'aptos';
/**
 * consistent with aptos_std::type_info::TypeInfo
 */
export interface TypeInfo {
    account_address: string;
    module_name: string;
    struct_name: string;
}
/**
 * extend {@link TypeInfo}
 */
export interface TypeInfoEx extends TypeInfo {
    /**
     * a value in `account_address::module_name::struct_name` format
     */
    type: string;
}
export interface UlnConfigType {
    inbound_confirmations: aptos.BCS.Uint64;
    oracle: string;
    outbound_confirmations: aptos.BCS.Uint64;
    relayer: string;
}
export interface Packet {
    nonce: string | aptos.BCS.Uint64;
    src_chain_id: string | aptos.BCS.Uint16;
    src_address: Buffer;
    dst_chain_id: string | aptos.BCS.Uint16;
    dst_address: Buffer;
    payload: Buffer;
}
export interface UlnSignerFee {
    base_fee: aptos.BCS.Uint64;
    fee_per_byte: aptos.BCS.Uint64;
}
export declare enum Environment {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    DEVNET = "devnet",
    LOCAL = "local"
}
