"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountFromMnemonic = exports.getAccountFromPrivateKey = exports.getResourceAddress = exports.getLzReceiveTypeArguments = exports.getAddressFromPublicKey = exports.getSignedTransactionHash = exports.decodePayload = exports.applyGasLimitSafety = exports.makeSignFuncWithMultipleSigners = exports.stringToUint8Array = exports.paddingUint8Array = exports.convertToPaddedUint8Array = exports.bytesToUint8Array = exports.isErrorOfApiError = exports.convertBytesToUint64 = exports.convertUint64ToBytes = exports.isZeroAddress = exports.isSameAddress = exports.hexToAscii = exports.fullAddress = exports.multiSigSignedBCSTxn = exports.generateMultisig = exports.rebuildPacketFromEvent = exports.hashPacket = exports.hashBuffer = exports.decodePacketString = exports.decodePacket = exports.computeGuid = exports.encodePacket = exports.GAS_LIMIT_SAFETY_BPS = exports.ZERO_ADDRESS_BYTES = exports.ZERO_ADDRESS_HEX = void 0;
// scan packets from event history
const aptos = __importStar(require("aptos"));
const extended_buffer_1 = require("extended-buffer");
const bn_js_1 = __importDefault(require("bn.js"));
const crypto_1 = __importDefault(require("crypto"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const abi_1 = require("./abi");
const sha3_1 = require("@noble/hashes/sha3");
const utils_1 = require("@noble/hashes/utils");
const bip39 = __importStar(require("bip39"));
exports.ZERO_ADDRESS_HEX = fullAddress('0x0').toString();
exports.ZERO_ADDRESS_BYTES = fullAddress('0x0').toUint8Array();
exports.GAS_LIMIT_SAFETY_BPS = 2000;
function encodePacket(packet) {
    const encoded_packet = new extended_buffer_1.ExtendedBuffer();
    encoded_packet.writeBuffer(new bn_js_1.default(packet.nonce.toString()).toArrayLike(Buffer, 'be', 8));
    encoded_packet.writeUInt16BE(new bn_js_1.default(packet.src_chain_id).toNumber());
    encoded_packet.writeBuffer(packet.src_address);
    encoded_packet.writeUInt16BE(new bn_js_1.default(packet.dst_chain_id).toNumber());
    encoded_packet.writeBuffer(packet.dst_address);
    encoded_packet.writeBuffer(packet.payload);
    return encoded_packet.buffer;
}
exports.encodePacket = encodePacket;
function computeGuid(packet) {
    const encoded_packet = new extended_buffer_1.ExtendedBuffer();
    encoded_packet.writeBuffer(new bn_js_1.default(packet.nonce.toString()).toArrayLike(Buffer, 'be', 8));
    encoded_packet.writeUInt16BE(new bn_js_1.default(packet.src_chain_id).toNumber());
    encoded_packet.writeBuffer(packet.src_address);
    encoded_packet.writeUInt16BE(new bn_js_1.default(packet.dst_chain_id).toNumber());
    encoded_packet.writeBuffer(packet.dst_address);
    return hashBuffer(encoded_packet.buffer);
}
exports.computeGuid = computeGuid;
async function decodePacket(buf, getAddressSizeOfChain) {
    // based on encodePacket, implement decodePacket
    const extendedBuffer = new extended_buffer_1.ExtendedBuffer();
    extendedBuffer.writeBuffer(buf);
    const nonce = BigInt(new bn_js_1.default(Uint8Array.from(extendedBuffer.readBuffer(8, true)), 'be').toString());
    const src_chain_id = extendedBuffer.readUInt16BE();
    const src_address = extendedBuffer.readBuffer(32, true);
    const dst_chain_id = extendedBuffer.readUInt16BE();
    let addressSize = 0;
    if (typeof getAddressSizeOfChain === 'number') {
        addressSize = getAddressSizeOfChain;
    }
    else if (typeof getAddressSizeOfChain === 'function') {
        addressSize = await getAddressSizeOfChain(dst_chain_id);
    }
    const dst_address = extendedBuffer.readBuffer(addressSize, true);
    const payload = extendedBuffer.readBuffer(extendedBuffer.getReadableSize(), true);
    return {
        nonce,
        src_chain_id,
        src_address,
        dst_chain_id,
        dst_address,
        payload,
    };
}
exports.decodePacket = decodePacket;
async function decodePacketString(encodedPacket, dstAddressSize) {
    return decodePacket(Buffer.from(aptos.HexString.ensure(encodedPacket).toUint8Array()), dstAddressSize);
}
exports.decodePacketString = decodePacketString;
function hashBuffer(buf) {
    return crypto_1.default.createHash('sha3-256').update(buf).digest('hex');
}
exports.hashBuffer = hashBuffer;
function hashPacket(packet) {
    return hashBuffer(encodePacket(packet));
}
exports.hashPacket = hashPacket;
async function rebuildPacketFromEvent(event, getAddressSizeOfChain) {
    const hexValue = event.data.encoded_packet.replace(/^0x/, '');
    const input = Buffer.from(hexValue, 'hex');
    return decodePacket(input, getAddressSizeOfChain);
}
exports.rebuildPacketFromEvent = rebuildPacketFromEvent;
async function generateMultisig(publicKeys, threshold) {
    const multiSigPublicKey = new aptos.TxnBuilderTypes.MultiEd25519PublicKey(publicKeys.map((publicKey) => new aptos.TxnBuilderTypes.Ed25519PublicKey(publicKey)), threshold);
    const authKey = aptos.TxnBuilderTypes.AuthenticationKey.fromMultiEd25519PublicKey(multiSigPublicKey);
    return [multiSigPublicKey, authKey.derivedAddress().toString()];
}
exports.generateMultisig = generateMultisig;
function multiSigSignedBCSTxn(pubkey, rawTx, signatures, bitmap) {
    const txBuilder = new aptos.TransactionBuilderMultiEd25519(() => {
        return new aptos.TxnBuilderTypes.MultiEd25519Signature(signatures.map((signature) => new aptos.TxnBuilderTypes.Ed25519Signature(signature.toUint8Array())), aptos.TxnBuilderTypes.MultiEd25519Signature.createBitmap(bitmap));
    }, pubkey);
    return txBuilder.sign(rawTx);
}
exports.multiSigSignedBCSTxn = multiSigSignedBCSTxn;
function fullAddress(address) {
    const rawValue = aptos.HexString.ensure(address).noPrefix();
    return aptos.HexString.ensure(Buffer.concat([Buffer.alloc(64 - rawValue.length, '0'), Buffer.from(rawValue)]).toString());
}
exports.fullAddress = fullAddress;
function isHexStrict(hex) {
    return /^(-)?0x[0-9a-f]*$/i.test(hex);
}
//https://github.com/ChainSafe/web3.js/blob/release/1.7.5/packages/web3-utils/src/index.js#L166
function hexToAscii(hex) {
    (0, tiny_invariant_1.default)(isHexStrict(hex), `Invalid hex string ${hex}`);
    let str = '';
    let i = 0;
    const l = hex.length;
    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i += 2) {
        const code = parseInt(hex.slice(i, i + 2), 16);
        str += String.fromCharCode(code);
    }
    return str;
}
exports.hexToAscii = hexToAscii;
function isSameAddress(a, b) {
    return fullAddress(a).toString() == fullAddress(b).toString();
}
exports.isSameAddress = isSameAddress;
function isZeroAddress(a) {
    return isSameAddress(a, exports.ZERO_ADDRESS_HEX);
}
exports.isZeroAddress = isZeroAddress;
function convertUint64ToBytes(number) {
    return aptos.BCS.bcsSerializeUint64(number).reverse(); //big endian
}
exports.convertUint64ToBytes = convertUint64ToBytes;
function convertBytesToUint64(bytes) {
    return BigInt(new bn_js_1.default(bytes, 'be').toString());
}
exports.convertBytesToUint64 = convertBytesToUint64;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isErrorOfApiError(e, status) {
    if (e instanceof aptos.ApiError) {
        return e.status === status;
    }
    else if (e instanceof aptos.Types.ApiError) {
        return e.status === status;
    }
    else if (e instanceof Error && e.constructor.name.match(/ApiError[0-9]*/)) {
        if (Object.prototype.hasOwnProperty.call(e, 'vmErrorCode')) {
            const err = e;
            return err.status === status;
        }
        else if (Object.prototype.hasOwnProperty.call(e, 'request')) {
            const err = e;
            return err.status === status;
        }
    }
    else if (e instanceof Error) {
        if (Object.prototype.hasOwnProperty.call(e, 'status')) {
            return e.status === status;
        }
    }
    return false;
}
exports.isErrorOfApiError = isErrorOfApiError;
function bytesToUint8Array(data, length) {
    return Uint8Array.from([...new Uint8Array(length - data.length), ...data]);
}
exports.bytesToUint8Array = bytesToUint8Array;
function convertToPaddedUint8Array(str, length) {
    const value = Uint8Array.from(Buffer.from(str.replace(/^0x/i, '').padStart(length, '0'), 'hex'));
    return Uint8Array.from([...new Uint8Array(length - value.length), ...value]);
}
exports.convertToPaddedUint8Array = convertToPaddedUint8Array;
function paddingUint8Array(bytes, length) {
    return Uint8Array.from([...new Uint8Array(length - bytes.length), ...bytes]);
}
exports.paddingUint8Array = paddingUint8Array;
function stringToUint8Array(str) {
    return Uint8Array.from(Buffer.from(str.replace(/^0x/i, ''), 'hex'));
}
exports.stringToUint8Array = stringToUint8Array;
function makeSignFuncWithMultipleSigners(...signers) {
    return function (data) {
        const retval = signers.map((s, index) => {
            return {
                signature: s.signBuffer(data),
                bitmap: index,
            };
        });
        return Promise.resolve(retval);
    };
}
exports.makeSignFuncWithMultipleSigners = makeSignFuncWithMultipleSigners;
function applyGasLimitSafety(gasUsed) {
    return (BigInt(gasUsed) * BigInt(10000 + exports.GAS_LIMIT_SAFETY_BPS)) / BigInt(10000);
}
exports.applyGasLimitSafety = applyGasLimitSafety;
function decodePayload(payload) {
    const extendedBuffer = new extended_buffer_1.ExtendedBuffer();
    extendedBuffer.writeBuffer(payload);
    const packetType = extendedBuffer.readUInt8();
    const remoteCoinAddr = extendedBuffer.readBuffer(32, true);
    const receiverBytes = extendedBuffer.readBuffer(32, true);
    const amount = new bn_js_1.default(extendedBuffer.readBuffer(8, true));
    return {
        packetType,
        remoteCoinAddr,
        receiverBytes,
        amount,
    };
}
exports.decodePayload = decodePayload;
function getSignedTransactionHash(signedTransaction) {
    const deserializer = new aptos.BCS.Deserializer(signedTransaction);
    const userTxn = aptos.TxnBuilderTypes.UserTransaction.load(deserializer);
    const txnHash = aptos.HexString.fromUint8Array(userTxn.hash()).toString();
    return txnHash;
}
exports.getSignedTransactionHash = getSignedTransactionHash;
function getAddressFromPublicKey(publicKey) {
    const hash = sha3_1.sha3_256.create();
    hash.update(publicKey.toBytes());
    hash.update('\x00');
    return aptos.HexString.fromUint8Array(hash.digest());
}
exports.getAddressFromPublicKey = getAddressFromPublicKey;
/**
 * return the type arguments, which is needed to call lz_receive
 * @param bytecode - generated by `make compile-script-template`
 * @param sdk
 * @param publicKey - the public key of the signer who will submit transaction
 * @param dstAddress - UA address on Aptos, this function will get UA typeInfo({@link types.TypeInfoEx}) with dstAddress
 * @param srcChainId - the src chainId of the packet
 * @param srcAddress - the src address(UA address) of the packet
 * @param payload - the payload of the packet
 */
async function getLzReceiveTypeArguments(bytecode, sdk, publicKey, dstAddress, srcChainId, srcAddress, payload) {
    const uaAddress = aptos.HexString.ensure(Buffer.from(dstAddress).toString('hex'));
    const uaTypeInfo = await sdk.LayerzeroModule.Endpoint.getUATypeInfo(uaAddress);
    const ABIS = [
        new abi_1.TransactionScriptABI('main', '', bytecode, [], [
            new abi_1.ArgumentABI('src_chain_id', new aptos.TypeTagParser('u64').parseTypeTag()),
            new abi_1.ArgumentABI('src_address', new aptos.TypeTagParser('vector<u8>').parseTypeTag()),
            new abi_1.ArgumentABI('payload', new aptos.TypeTagParser('vector<u8>').parseTypeTag()),
        ]),
    ];
    const abis = ABIS.map((abi) => {
        const serializer = new aptos.BCS.Serializer();
        abi.serialize(serializer);
        return serializer.getBytes();
    });
    const builder = new aptos.TransactionBuilderABI(abis);
    const transaction = builder.buildTransactionPayload('main', [], [srcChainId, Uint8Array.from(srcAddress), Uint8Array.from(payload)]);
    const address = getAddressFromPublicKey(publicKey);
    const rawTransaction = await sdk.client.generateRawTransaction(address, transaction, {});
    const txns = await sdk.client.simulateTransaction(publicKey, rawTransaction);
    // console.log(txns)
    // console.log(txns[0].changes)
    const result = txns
        .flatMap((txn) => txn.changes)
        .filter((change) => change.type === 'write_resource' &&
        change.data.type.match(/::endpoint::TypeArguments$/))
        .map((change) => change.data.data)
        .flatMap((r) => {
        return r['types'];
    })
        .map((t) => {
        const account_address = fullAddress(t.account_address).toString();
        const module_name = hexToAscii(t.module_name);
        const struct_name = hexToAscii(t.struct_name);
        return `${account_address}::${module_name}::${struct_name}`;
    });
    return result;
}
exports.getLzReceiveTypeArguments = getLzReceiveTypeArguments;
const DERIVE_RESOURCE_ACCOUNT_SCHEME = 255;
function getResourceAddress(source, seed) {
    let bytes = [...aptos.HexString.ensure(source).toUint8Array(), ...seed, DERIVE_RESOURCE_ACCOUNT_SCHEME];
    const hash = crypto_1.default.createHash('sha3-256').update(Buffer.from(bytes)).digest('hex');
    return aptos.HexString.ensure(hash);
}
exports.getResourceAddress = getResourceAddress;
function getAccountFromPrivateKey(key) {
    const privateKeyBytes = Uint8Array.from(Buffer.from(aptos.HexString.ensure(key).noPrefix(), 'hex'));
    return new aptos.AptosAccount(privateKeyBytes);
}
exports.getAccountFromPrivateKey = getAccountFromPrivateKey;
function getAccountFromMnemonic(mnemonic, path = "m/44'/637'/0'/0'/0'") {
    //https://aptos.dev/guides/building-your-own-wallet/#creating-an-aptos-account
    if (!aptos.AptosAccount.isValidPath(path)) {
        throw new Error(`Invalid derivation path: ${path}`);
    }
    const normalizeMnemonics = mnemonic
        .trim()
        .split(/\s+/)
        .map((part) => part.toLowerCase())
        .join(' ');
    {
        const { key } = aptos.derivePath(path, (0, utils_1.bytesToHex)(bip39.mnemonicToSeedSync(normalizeMnemonics)));
        return new aptos.AptosAccount(new Uint8Array(key));
    }
}
exports.getAccountFromMnemonic = getAccountFromMnemonic;
