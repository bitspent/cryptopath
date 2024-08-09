# CryptoPath
Lightweight lib for deriving public keys using elliptic curve cryptography (specifically secp256k1).
Initially for Publick keys Derivation along specified paths and chaincodes.

## Installation
Install the package via npm:

```bash
npm install cryptopath
```

## Usage

### Node.js Example

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

### How It Works

CryptoPath derives public keys from a given extended public key and chain code using a specified derivation path. 
This process is crucial in cryptographic applications where secure, deterministic key generation is required.
The library leverages the secp256k1 elliptic curve, which is widely used in blockchain technology.

### API Reference

#### `getDerivedPubKey(hexPubKey, hexChainCode, path)`

Derives a public key from an extended public key, chain code, and derivation path.

- **Parameters:**
  - `hexPubKey` (string): The extended public key in hexadecimal format.
  - `hexChainCode` (string): The chain code in hexadecimal format.
  - `path` (string): The derivation path in BIP32 format, such as `"m/44'/60'/0'/0/0"`.

- **Returns:**
  - A string representing the derived public key in hexadecimal format.

## Contributing

Contributions are welcome!
If you have suggestions for improvements and additional utilities or have found bugs, please feel free to open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.