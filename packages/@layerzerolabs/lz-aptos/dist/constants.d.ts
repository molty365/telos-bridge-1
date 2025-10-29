import { ChainStage } from '@layerzerolabs/lz-sdk';
import { Environment } from './types';
export declare const NODE_URL: {
    [env in Environment]: string;
};
export declare const FAUCET_URL: {
    [env in Environment]: string;
};
export declare const LAYERZERO_ADDRESS: {
    [stage in ChainStage]?: string;
};
export declare const LAYERZERO_APPS_ADDRESS: {
    [stage in ChainStage]?: string;
};
export declare const ORACLE_ADDRESS: {
    [stage in ChainStage]?: string;
};
export declare const ORACLE_SIGNER_ADDRESS: {
    [stage in ChainStage]?: string;
};
export declare const RELAYER_SIGNER_ADDRESS: {
    [stage in ChainStage]?: string;
};
export declare const EXECUTOR_ADDRESS: {
    [stage in ChainStage]?: string;
};
export declare const EXECUTOR_PUBKEY: {
    [stage in ChainStage]?: string;
};
export declare const BRIDGE_ADDRESS: {
    [stage in ChainStage]?: string;
};
