import * as fs from 'fs';
import * as path from 'path';

import * as bip39 from 'bip39';
import { getAddressFromPublicKey } from '@solana/web3.js';
import { createKeyPairFromPrivateKeyBytes } from '@solana/keys';
import { derivePath } from "ed25519-hd-key"; 

const c = require('ansi-colors');

function getMnemonicFromFile(): string {
    const secretsPath = path.join(__dirname, '../secrets.json');

    if (!fs.existsSync(secretsPath)) {
        throw new Error('secrets.json file not found');
    }

    const rawData = fs.readFileSync(secretsPath, 'utf-8');
    const secrets = JSON.parse(rawData);

    if (!secrets.mnemonic) {
        throw new Error('Mnemonic not found in secrets.json');
    }

    return secrets.mnemonic;
}

async function createWalletFromSeed(mnemonic:string) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString("hex")).key;
    const keyPair = await createKeyPairFromPrivateKeyBytes(derivedSeed);
    const myPublicKeyAsAddress = await getAddressFromPublicKey(keyPair.publicKey);

    return myPublicKeyAsAddress;
}

async function main() {

    //Mnemonic stored in secrets.json was created with Solana Cli command "solana-keygen new --no-outfile"
    const seedPhrase = getMnemonicFromFile();

    const walletAddress = await createWalletFromSeed(seedPhrase);
    console.log('Wallet address: '+c.blue(walletAddress));
}

main().catch(err => {
    console.error("Error in main function:", err);
    process.exit(1);
});