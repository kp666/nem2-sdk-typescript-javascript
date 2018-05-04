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

import { sha3_256 } from 'js-sha3';
import { convert } from 'nem2-library';
import { TreeNodePosition, MerkleAuditProofPathNode } from './MerkleAuditProofPathNode';

/**
 * Describes a Merkle audit proof path
 */
export class MerkleAuditProof {
    readonly value: string;

    /**
     * @param rootNodeHash
     * @param transactionHash
     * @param merklePath
     */
    constructor(/**
                 * The hash for the Merkle tree root node.
                 */
                public readonly rootNodeHash: string,
                 /**
                 * The hash for the Merkle tree root node.
                 */
                public readonly transactionHash: string,
                 /**
                 * The Merkle audit proof path.
                 */
                public readonly merklePath: MerkleAuditProofPathNode[]
    ) {}

    /**
     * Returns whether the Merkle audit proof is consistent or not.
     * @return {boolean}
     */
    public isConsistent(): boolean {
        var lastHash = this.transactionHash;
        for (var auditProofPathItem of this.merklePath) {
            if (auditProofPathItem.position === TreeNodePosition.Left) {
                lastHash = sha3_256(this.concatUint8Arrays(convert.hexToUint8(auditProofPathItem.hash), convert.hexToUint8(lastHash)).buffer);
            }
            else {
                lastHash = sha3_256(this.concatUint8Arrays(convert.hexToUint8(lastHash), convert.hexToUint8(auditProofPathItem.hash)).buffer);
            }
        }
        return lastHash === this.rootNodeHash;
    }

    private concatUint8Arrays(buffer1: Uint8Array, buffer2: Uint8Array): Uint8Array  {
        var resultBuffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        resultBuffer.set(new Uint8Array(buffer1), 0);
        resultBuffer.set(new Uint8Array(buffer2), buffer1.byteLength);
        return resultBuffer;
    }
}
