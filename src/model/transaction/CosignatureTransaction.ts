/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { KeyPair, SignSchema } from '../../core/crypto';
import { Convert } from '../../core/format/Convert';
import {Account} from '../account/Account';
import {AggregateTransaction} from './AggregateTransaction';
import {CosignatureSignedTransaction} from './CosignatureSignedTransaction';
import { Transaction } from './Transaction';

/**
 * Cosignature transaction is used to sign an aggregate transactions with missing cosignatures.
 */
export class CosignatureTransaction {
    /**
     * @param transactionToCosign
     */
    constructor(/**
                 * Transaction to cosign.
                 */
                public readonly transactionToCosign: AggregateTransaction) {

    }

    /**
     * Create a cosignature transaction
     * @param transactionToCosign - Transaction to cosign.
     * @returns {CosignatureTransaction}
     */
    public static create(transactionToCosign: AggregateTransaction): CosignatureTransaction {
        return new CosignatureTransaction(transactionToCosign);
    }

    /**
     * Co-sign transaction with transaction payload (off chain)
     * Creating a new CosignatureSignedTransaction
     * @param account - The signing account
     * @param payload - off transaction payload (aggregated transaction is unannounced)
     * @param generationHash - Network generation hash
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {CosignatureSignedTransaction}
     */
    public static signTransactionPayload(account: Account,
                                         payload: string,
                                         generationHash: string,
                                         signSchema: SignSchema = SignSchema.SHA3): CosignatureSignedTransaction {
        /**
         * For aggregated complete transaction, cosignatories are gathered off chain announced.
         */
        const transactionHash = Transaction.createTransactionHash(payload, Array.from(Convert.hexToUint8(generationHash)));
        const hashBytes = Convert.hexToUint8(transactionHash);
        const signature = KeyPair.sign(account, new Uint8Array(hashBytes), signSchema);
        return new CosignatureSignedTransaction(
            Convert.uint8ToHex(hashBytes),
            Convert.uint8ToHex(signature),
            account.publicKey,
        );
    }

    /**
     * @internal
     * Serialize and sign transaction creating a new SignedTransaction
     * @param account
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {CosignatureSignedTransaction}
     */
    public signWith(account: Account, signSchema: SignSchema = SignSchema.SHA3): CosignatureSignedTransaction {
        if (!this.transactionToCosign.transactionInfo!.hash) {
            throw new Error('Transaction to cosign should be announced first');
        }
        const hash = this.transactionToCosign.transactionInfo!.hash;
        const hashBytes = Convert.hexToUint8(hash ? hash : '');
        const signature = KeyPair.sign(account, new Uint8Array(hashBytes), signSchema);
        return new CosignatureSignedTransaction(
            hash ? hash : '',
            Convert.uint8ToHex(signature),
            account.publicKey,
        );
    }
}
