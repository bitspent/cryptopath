const elliptic = require('elliptic');
const crypto = require('crypto');
const BN = require('bn.js');
const base58 = require('bs58');

const secp256k1 = new elliptic.ec('secp256k1');

class ExtendedKey {
    constructor(publicKey, depth, childIndex, chainCode, parentFP, version) {
        this.publicKey = publicKey;
        this.depth = depth;
        this.childIndex = childIndex;
        this.chainCode = chainCode;
        this.parentFP = parentFP;
        this.version = version;
    }

    toString() {
        const childNumBytes = Buffer.alloc(4);
        childNumBytes.writeUInt32BE(this.childIndex, 0);

        const serializedBytes = Buffer.concat([
            this.version,
            Buffer.from([this.depth]),
            this.parentFP,
            childNumBytes,
            this.chainCode,
            serializeCompressed(this.publicKey.getX(), this.publicKey.getY()),
        ]);

        const checkSum = doubleHash(serializedBytes).slice(0, 4);
        return base58.encode(Buffer.concat([serializedBytes, checkSum]));
    }
}

function serializeCompressed(publicKeyX, publicKeyY) {
    const format = publicKeyY.isOdd() ? 0x03 : 0x02;
    return Buffer.concat([Buffer.from([format]), publicKeyX.toArrayLike(Buffer, 'be', 32)]);
}

function doubleHash(buf) {
    return crypto.createHash('sha256').update(
        crypto.createHash('sha256').update(buf).digest()
    ).digest();
}

function hmacSHA512(key, data) {
    return crypto.createHmac('sha512', key).update(data).digest();
}

function hash160(buf) {
    return crypto.createHash('ripemd160').update(
        crypto.createHash('sha256').update(buf).digest()
    ).digest();
}

function deriveChildKeyFromHierarchy(indicesHierarchy, pk, curve) {
    let k = pk;
    let ilNum = new BN(0);

    for (let index of indicesHierarchy) {
        const result = deriveChildKey(index, k, curve);
        ilNum = ilNum.add(result.ilNum).umod(curve.n);
        k = result.childKey;
    }
    return { ilNum, childKey: k };
}

function deriveChildKey(index, pk, curve) {
    if (index >= 0x80000000) {
        throw new Error("The index must be non-hardened");
    }

    const pkPublicKeyBytes = serializeCompressed(pk.publicKey.getX(), pk.publicKey.getY());

    const data = Buffer.concat([pkPublicKeyBytes, Buffer.alloc(4)]);
    data.writeUInt32BE(index, pkPublicKeyBytes.length);

    const ilr = hmacSHA512(pk.chainCode, data);
    const il = new BN(ilr.slice(0, 32));
    const childChainCode = ilr.slice(32);

    if (il.cmp(curve.n) >= 0 || il.isZero()) {
        throw new Error("Invalid derived key");
    }

    const deltaG = curve.g.mul(il);
    const childPublicKey = pk.publicKey.add(deltaG);

    return {
        ilNum: il,
        childKey: new ExtendedKey(
            childPublicKey,
            pk.depth + 1,
            index,
            childChainCode,
            hash160(pkPublicKeyBytes).slice(0, 4),
            pk.version
        ),
    };
}

function getDerivePathBytes(derivePath) {
    return derivePath
        .split('/')
        .filter(item => item && item !== 'm')
        .map(item => {
            const intResult = parseInt(item.replace("'", ""), 10);
            if (intResult < 0 || intResult > 0xffffffff) {
                throw new Error(`integer value ${intResult} cannot fit into a uint32`);
            }
            return intResult;
        });
}

function getDerivedPubKey(hexPubKey, hexChainCode, path) {
    if (!hexPubKey || !hexChainCode || !path) {
        throw new Error("empty input");
    }

    const pubKey = secp256k1.keyFromPublic(Buffer.from(hexPubKey, 'hex'));
    const pathBuf = getDerivePathBytes(path);
    const chainCodeBuf = Buffer.from(hexChainCode, 'hex');

    const { childKey } = deriveChildKeyFromHierarchy(pathBuf, new ExtendedKey(pubKey.getPublic(), 0, 0, chainCodeBuf, Buffer.alloc(4), Buffer.alloc(4)), secp256k1);

    return serializeCompressed(childKey.publicKey.getX(), childKey.publicKey.getY()).toString('hex');
}

module.exports = {
    getDerivedPubKey
};