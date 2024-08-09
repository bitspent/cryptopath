const assert = require('assert');
const { getDerivedPubKey } = require('../lib/index');

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
