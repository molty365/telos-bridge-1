import { SDK } from '../index';
import { Channel } from './channel';
import { Endpoint } from './endpoint';
import { Executor } from './executor';
import { Uln } from './uln';
import { MsgLibConfig } from './msglib_config';
import { ExecutorConfig } from './executor_config';
import { MsgLibAuth } from './msglib_auth';
export declare class Layerzero {
    Channel: Channel;
    Executor: Executor;
    Endpoint: Endpoint;
    Uln: Uln;
    MsgLibConfig: MsgLibConfig;
    MsgLibAuth: MsgLibAuth;
    ExecutorConfig: ExecutorConfig;
    constructor(sdk: SDK);
}
