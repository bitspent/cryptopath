# CryptoPath

Lightweight library for deriving public keys and verifying derived signed messages using elliptic curve cryptography, specifically secp256k1. The library supports public key derivation along specified paths and chain codes.

## Installation

Install the package via npm:

```bash
npm install cryptopath
```

## Usage

### `getDerivedPubKey`

```javascript
const { getDerivedPubKey } = require('cryptopath');

// Public Key (in hexadecimal format)
const hexPubKey = "03f7233f937751a5e93c862476ac2fa72ba224af2357f2f9b0476ad8def0ff8be6";

// Chain Code (in hexadecimal format)
const hexChainCode = "03aa287e23cbf70094f485a01b31614dfb3cbb02e095092f8967324e405cc8c7";

// Derivation Path (BIP32 format)
const path = "m/44'/60'/0'/0/0";

// Derive the public key
const derivedPubKey = getDerivedPubKey(hexPubKey, hexChainCode, path);

// Expected Output: 02e3bd0c4d3d97511e0003794fef879ba8550c796e4289b0c1682443b21ab162fd
console.log(derivedPubKey);
```

### `verifyDerivedSignature`

```javascript
const { verifyDerivedSignature } = require('cryptopath');

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

// { valid: true, recoveredPubKey, derivedPubkey }
const result = verifyDerivedSignature(hexMessage, sig.r, sig.s, sig.v, hexPubKey, hexChainCode, path);

console.log(result);
```

## How It Works

CryptoPath derives public keys from a given extended public key and chain code using a specified derivation path. This process is crucial in cryptographic applications where secure, deterministic key generation is required. The library leverages the secp256k1 elliptic curve, which is widely used in blockchain technology.

## API Reference

### `getDerivedPubKey(hexPubKey, hexChainCode, path)`

Derives a public key from an extended public key, chain code, and derivation path.

- **Parameters:**
  - `hexPubKey` (string): The extended public key in hexadecimal format.
  - `hexChainCode` (string): The chain code in hexadecimal format.
  - `path` (string): The derivation path in BIP32 format, such as `"m/44'/60'/0'/0/0"`.

- **Returns:**
  - A string representing the derived public key in hexadecimal format.

### `verifyDerivedSignature(hexMessage, r, s, v, hexPubKey, hexChainCode, path)`

Verifies a signature derived from a message using the provided public key, chain code, and derivation path.

- **Parameters:**
  - `hexMessage` (string): The message in hexadecimal format.
  - `r` (string): The `r` value of the ECDSA signature.
  - `s` (string): The `s` value of the ECDSA signature.
  - `v` (number): The recovery parameter.
  - `hexPubKey` (string): The public key in hexadecimal format.
  - `hexChainCode` (string): The chain code in hexadecimal format.
  - `path` (string): The derivation path in BIP32 format.

- **Returns:**
  - An object containing:
    - `valid` (boolean): Whether the signature is valid.
    - `recoveredPubKey` (string): The recovered public key in hexadecimal format.
    - `derivedPubKey` (string): The derived public key in hexadecimal format.

## Contributing

Contributions are welcome! If you have suggestions for improvements, additional utilities, or have found bugs, please feel free to open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.