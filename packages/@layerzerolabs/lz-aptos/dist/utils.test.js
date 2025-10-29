"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
describe('test common functions for aptos', () => {
    const expectedPacket = {
        src_chain_id: 10108,
        src_address: Buffer.from('33a4cf3cabceb43904ec7609221ff391e682ec81d13a89f68a356885d28995b8', 'hex'),
        dst_chain_id: 10121,
        dst_address: Buffer.from('2afd0d8a477ad393d2234253407fb1cec92749d1', 'hex'),
        nonce: 1n,
        payload: Buffer.from('01000000000000000000000000cc0235a403e77c56d0f271054ad8bd3abcd21904000000000000000000000000b062bfe01b1cf94ffe7618657c0a7b23b909dbe10000000000004e2001', 'hex'),
    };
    const expectedEvent = {
        version: '12767',
        key: '0x0600000000000000dcf30c9b54f8a181953b6c906d14373b52da7d9b467c24720d8744dea3f3f580',
        sequence_number: '0',
        type: '0xdcf30c9b54f8a181953b6c906d14373b52da7d9b467c24720d8744dea3f3f580::packet_event::OutboundEvent',
        data: {
            encoded_packet: '0x0000000000000001277c33a4cf3cabceb43904ec7609221ff391e682ec81d13a89f68a356885d28995b827892afd0d8a477ad393d2234253407fb1cec92749d101000000000000000000000000cc0235a403e77c56d0f271054ad8bd3abcd21904000000000000000000000000b062bfe01b1cf94ffe7618657c0a7b23b909dbe10000000000004e2001',
        },
    };
    test('test event', async () => {
        const hexValue = expectedEvent.data.encoded_packet.replace(/^0x/, '');
        const input = Buffer.from(hexValue, 'hex');
        const packet = await (0, utils_1.decodePacket)(input, 20);
        const output = (0, utils_1.encodePacket)(packet);
        expect(output).toEqual(input);
    });
    test('test packet', async () => {
        const input = (0, utils_1.encodePacket)(expectedPacket);
        const packet = await (0, utils_1.decodePacket)(input, 20);
        expect(packet.nonce).toEqual(expectedPacket.nonce);
        expect(packet.src_chain_id).toEqual(expectedPacket.src_chain_id);
        expect(packet.src_address).toEqual(expectedPacket.src_address);
        expect(packet.dst_chain_id).toEqual(expectedPacket.dst_chain_id);
        expect(packet.dst_address).toEqual(expectedPacket.dst_address);
        expect(packet.payload).toEqual(expectedPacket.payload);
    });
    test('test hashPacket', async () => {
        const packet = await (0, utils_1.decodePacket)(Buffer.from(expectedEvent.data.encoded_packet.replace(/^0x/, ''), 'hex'), 32);
        const hash = (0, utils_1.hashPacket)(packet);
        expect(hash).toEqual('dfc7bfef9ecd6986f7d56e5731ad11239a14137db78ba0fc108b4e96893036a0');
    });
    test('output hash', () => {
        const expectedPacket = {
            src_chain_id: '10121',
            src_address: Buffer.from([
                42, 253, 13, 138, 71, 122, 211, 147, 210, 35, 66, 83, 64, 127, 177, 206, 201, 39, 73, 209,
            ]),
            dst_chain_id: '10108',
            dst_address: Buffer.from([
                51, 164, 207, 60, 171, 206, 180, 57, 4, 236, 118, 9, 34, 31, 243, 145, 230, 130, 236, 129, 209, 58, 137,
                246, 138, 53, 104, 133, 210, 137, 149, 184,
            ]),
            nonce: '1',
            payload: Buffer.from([
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 204, 2, 53, 164, 3, 231, 124, 86, 208, 242, 113, 5, 74, 216, 189,
                58, 188, 210, 25, 4, 20, 190, 116, 8, 8, 137, 220, 129, 182, 20, 89, 147, 104, 117, 222, 57, 69, 252,
                84, 206, 4, 222, 220, 135, 234, 199, 212, 188, 102, 84, 182, 229, 0, 0, 0, 0, 0, 15, 66, 64,
            ]),
        };
        const data = (0, utils_1.encodePacket)(expectedPacket);
        expect(data.length).toBe(137);
        const hash = (0, utils_1.hashPacket)(expectedPacket);
        expect(typeof hash === 'string').toBeTruthy();
        expect(hash.length).toBe(64);
        expect(hash).toMatch(/^[0-9a-f]+$/);
    });
    test('Object to array', () => {
        const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        {
            expect(array instanceof Uint8Array).toBeFalsy();
            expect(array instanceof Buffer).toBeFalsy();
            expect(array instanceof Array).toBeTruthy();
            expect(array instanceof Object).toBeTruthy();
            const object = JSON.parse(JSON.stringify(array));
            expect(object instanceof Uint8Array).toBeFalsy();
            expect(object instanceof Buffer).toBeFalsy();
            expect(object instanceof Array).toBeTruthy();
            expect(object instanceof Object).toBeTruthy();
        }
        const uint8Array = Uint8Array.from(array);
        {
            expect(uint8Array instanceof Uint8Array).toBeTruthy();
            expect(uint8Array instanceof Buffer).toBeFalsy();
            expect(uint8Array instanceof Array).toBeFalsy();
            expect(uint8Array instanceof Object).toBeFalsy();
            const object = JSON.parse(JSON.stringify(uint8Array));
            expect(object instanceof Uint8Array).toBeFalsy();
            expect(object instanceof Buffer).toBeFalsy();
            expect(object instanceof Array).toBeFalsy();
            expect(object instanceof Object).toBeTruthy();
            const buf = Buffer.from(uint8Array);
            expect(buf instanceof Uint8Array).toBeTruthy();
            expect(buf instanceof Buffer).toBeTruthy();
            expect(buf instanceof Array).toBeFalsy();
            expect(buf instanceof Object).toBeFalsy();
        }
    });
    test.each([
        [
            '0xc2846ea05319c339b3b52186ceae40b43d4e9cf6c7350336c3eb0b351d9394eb',
            '0x12e12de0af996d9611b0b78928cd9f4cbf50d94d972043cdd829baa77a78929b',
        ],
        [
            '0xdc2c034687f412821c515ca548e8a6e0cbfed76e683424c71a8ecc923daa66d6',
            '0x6d40fe47db1d75a888bebfd77a3a873d61022a221906010f24229a8f92d64785',
        ],
    ])('getResourceAddress', (sourceAddress, resourceAddress) => {
        const address = (0, utils_1.getResourceAddress)(sourceAddress, Uint8Array.from([0x1]));
        expect(address.toString()).toBe(resourceAddress);
    });
    test.each([
        [
            'test test test test test test test test test test test junk',
            [
                [`m/44'/637'/0'/0'/0'`, '0xbfef909638ef90885158fdab9f56e216fd811fe25b32ead0bc2a272d66522bb0'],
                [`m/44'/637'/0'/0'/1'`, '0xd8f318cab62a1142e1cd60f3f090331becc9a462a1a85180de8a99e2a27eadc0'],
            ],
        ],
    ])('getAccount from mnemonic', (mnemonic, keys) => {
        for (const item of keys) {
            const [path, address] = item;
            const account = (0, utils_1.getAccountFromMnemonic)(mnemonic, path);
            expect(account.address().toString()).toBe(address);
        }
    });
});
