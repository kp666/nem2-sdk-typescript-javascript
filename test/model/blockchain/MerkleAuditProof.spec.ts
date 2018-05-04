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

import { expect } from 'chai';
import { MerkleAuditProof } from '../../../src/model/blockchain/MerkleAuditProof';
import { MerkleAuditProofPathNode, TreeNodePosition } from '../../../src/model/blockchain/MerkleAuditProofPathNode';

const chainMerkleTree = [
    "16d28dd7af87b86c79273450470e96f22c66f8ef4598064603699b69f10464d0",
    "586b203612b0e5ca695cff677a5b784e4368b79c1a7b272036105753a915edc9",
    "aa1dfff01b3aba492188195df4d77af25ff9d57df4ea0fd6fe498d572b6e67fd",
    "8d25b2639a7d12feaaaef34358b215e97533f9ffdda5b9fadfd8ecc229695263",
    "8ab2f19a47c5b30cc389ae1580f0472b4d3afeea83cdf0f707d03ed76b15a00c",
    "b9840c4eadb6724a2dfca81d5e90ef3f4ee91beb63a58fa91a4f05e951f08fcf",
    "b9840c4eadb6724a2dfca81d5e90ef3f4ee91beb63a58fa91a4f05e951f08fcf"
];

describe('isConsistent', () => {
    it('Should be consistent for a valid single transaction audit proof', () => {
        const singleTransactionHash = "16d28dd7af87b86c79273450470e96f22c66f8ef4598064603699b69f10464d0";
        expect(new MerkleAuditProof(singleTransactionHash, singleTransactionHash, []).isConsistent()).to.be.true;
    });

    it('Should be inconsistent for an invalid single transaction audit proof', () => {
        const singleTransactionHash = "16d28dd7af87b86c79273450470e96f22c66f8ef4598064603699b69f10464d0";
        expect(new MerkleAuditProof(singleTransactionHash.replace("1", "a"), singleTransactionHash, []).isConsistent()).to.be.false;
    });

    it('Should be consistent for a valid audit proof', () => {
        const auditProofPath = [
            new MerkleAuditProofPathNode(chainMerkleTree[6], TreeNodePosition.Right),
            new MerkleAuditProofPathNode(chainMerkleTree[1], TreeNodePosition.Left)
        ]
        expect(new MerkleAuditProof(chainMerkleTree[0], chainMerkleTree[5], auditProofPath).isConsistent()).to.be.true;

        const auditProofPath2 = [
            new MerkleAuditProofPathNode(chainMerkleTree[4], TreeNodePosition.Right),
            new MerkleAuditProofPathNode(chainMerkleTree[2], TreeNodePosition.Right)
        ]
        expect(new MerkleAuditProof(chainMerkleTree[0], chainMerkleTree[3], auditProofPath2).isConsistent()).to.be.true;
    });

    it('Should be inconsistent for invalid audit proof', () => {
        const auditProofPath = [
            new MerkleAuditProofPathNode(chainMerkleTree[6], TreeNodePosition.Right),
            new MerkleAuditProofPathNode(chainMerkleTree[1], TreeNodePosition.Left)
        ]
        expect(new MerkleAuditProof(chainMerkleTree[1], chainMerkleTree[5], auditProofPath).isConsistent()).to.be.false;
    });
});
