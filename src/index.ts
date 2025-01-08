import * as bip39 from 'bip39';
import { getAddressFromPublicKey } from '@solana/web3.js';
import { createKeyPairFromPrivateKeyBytes } from '@solana/keys';
import { derivePath } from "ed25519-hd-key"; 

const c = require('ansi-colors');

async function createWalletFromSeed(mnemonic:string) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString("hex")).key;
    const keyPair = await createKeyPairFromPrivateKeyBytes(derivedSeed);
    const myPublicKeyAsAddress = await getAddressFromPublicKey(keyPair.publicKey);

    return myPublicKeyAsAddress;
}

async function main() {

    //Mnemonic created with Solana Cli command "solana-keygen new --no-outfile"
    const seedPhrase = '';

    const walletAddress = await createWalletFromSeed(seedPhrase);
    console.log('Wallet address: '+c.blue(walletAddress));
}

main().catch(err => {
    console.error("Error in main function:", err);
    process.exit(1);
});