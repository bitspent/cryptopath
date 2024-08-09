const assert = require('assert');
const { getDerivedPubKey, verifyDerivedSignature } = require('../lib/index');

describe('getDerivedPubKey', function () {
    it('should derive the expected public key', function () {
        const hexPubKey = "03f7233f937751a5e93c862476ac2fa72ba224af2357f2f9b0476ad8def0ff8be6";
        const hexChainCode = "03aa287e23cbf70094f485a01b31614dfb3cbb02e095092f8967324e405cc8c7";
        const path = "m/44'/60'/0'/0/0";
        const expected = "02e3bd0c4d3d97511e0003794fef879ba8550c796e4289b0c1682443b21ab162fd";

        const result = getDerivedPubKey(hexPubKey, hexChainCode, path);
        assert.strictEqual(result, expected);
    });
});


describe('verifySignature', function () {
    it('should be a valid derived signature', function () {

        const message = "hi";

        const sig = {
            r: "16278155f86fe2e2fe733eebd22288047d6ae86abed2885798f563dbad3a7a01",
            s: "64b18c69e901125668b0b450094ac9ebc2a33eb3d9cbab4f135fea4bed54a35a",
            v: 0 // recovery_param
        };

        const hexPubKey = "03f7233f937751a5e93c862476ac2fa72ba224af2357f2f9b0476ad8def0ff8be6";
        const hexChainCode = "03aa287e23cbf70094f485a01b31614dfb3cbb02e095092f8967324e405cc8c7";
        const path = "m/44'/60'/0'/0/0";

        const hexMessage = Buffer.from(message, 'ascii').toString('hex');

        const result = verifyDerivedSignature(hexMessage, sig.r, sig.s, sig.v, hexPubKey, hexChainCode, path);
        const expected = true;

        assert.strictEqual(result.valid, expected);
    });
});