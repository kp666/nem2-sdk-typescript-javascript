/*
 * Copyright 2019 NEM
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

import { Convert } from '../../core/format/Convert';
import { AccountAddressRestrictionTransaction } from '../../model/transaction/AccountAddressRestrictionTransaction';
import { AccountLinkTransaction } from '../../model/transaction/AccountLinkTransaction';
import { AccountMetadataTransaction } from '../../model/transaction/AccountMetadataTransaction';
import { AccountMosaicRestrictionTransaction } from '../../model/transaction/AccountMosaicRestrictionTransaction';
import { AccountOperationRestrictionTransaction } from '../../model/transaction/AccountOperationRestrictionTransaction';
import { AddressAliasTransaction } from '../../model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../model/transaction/AggregateTransaction';
import { LockFundsTransaction } from '../../model/transaction/LockFundsTransaction';
import { MosaicAddressRestrictionTransaction } from '../../model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicAliasTransaction } from '../../model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../model/transaction/MosaicDefinitionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../../model/transaction/MosaicGlobalRestrictionTransaction';
import { MosaicMetadataTransaction } from '../../model/transaction/MosaicMetadataTransaction';
import { MosaicSupplyChangeTransaction } from '../../model/transaction/MosaicSupplyChangeTransaction';
import { MultisigAccountModificationTransaction } from '../../model/transaction/MultisigAccountModificationTransaction';
import { NamespaceMetadataTransaction } from '../../model/transaction/NamespaceMetadataTransaction';
import { NamespaceRegistrationTransaction } from '../../model/transaction/NamespaceRegistrationTransaction';
import { SecretLockTransaction } from '../../model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../../model/transaction/SecretProofTransaction';
import { Transaction } from '../../model/transaction/Transaction';
import { TransactionType } from '../../model/transaction/TransactionType';
import { TransferTransaction } from '../../model/transaction/TransferTransaction';

/**
 * @internal
 * @param transaction - The transaction class object
 * @returns JSON object
 * @constructor
 */
export const SerializeTransactionToJSON = (transaction: Transaction): any => {
    switch (transaction.type) {
        case TransactionType.LINK_ACCOUNT:
            return {
                remotePublicKey: (transaction as AccountLinkTransaction).remotePublicKey,
                linkAction: (transaction as AccountLinkTransaction).linkAction,
            };
        case TransactionType.ADDRESS_ALIAS:
            return {
                aliasAction: (transaction as AddressAliasTransaction).aliasAction,
                namespaceId: (transaction as AddressAliasTransaction).namespaceId.toHex(),
                address: (transaction as AddressAliasTransaction).address.toDTO(),
            };
        case TransactionType.AGGREGATE_BONDED:
        case TransactionType.AGGREGATE_COMPLETE:
            return {
                transactions: (transaction as AggregateTransaction).innerTransactions.map((innerTransaction) => {
                    return innerTransaction.toJSON();
                }),
                cosignatures: (transaction as AggregateTransaction).cosignatures.map((cosignature) => {
                    return cosignature.toDTO();
                }),
            };
        case TransactionType.LOCK:
            return {
                mosaicId: (transaction as LockFundsTransaction).mosaic.id.id,
                amount: (transaction as LockFundsTransaction).mosaic.amount.toString(),
                duration: (transaction as LockFundsTransaction).duration.toString(),
                hash: (transaction as LockFundsTransaction).hash,
            };
        case TransactionType.ACCOUNT_RESTRICTION_ADDRESS:
            return {
                restrictionType: (transaction as AccountAddressRestrictionTransaction).restrictionType,
                modifications: (transaction as AccountAddressRestrictionTransaction).
                    modifications.map((modification) => {
                        return modification.toDTO();
                    }),
            };
        case TransactionType.ACCOUNT_RESTRICTION_OPERATION:
            return {
                restrictionType: (transaction as AccountOperationRestrictionTransaction).restrictionType,
                modifications: (transaction as AccountOperationRestrictionTransaction).
                    modifications.map((modification) => {
                        return modification.toDTO();
                    }),
            };
        case TransactionType.ACCOUNT_RESTRICTION_MOSAIC:
            return {
                restrictionType: (transaction as AccountMosaicRestrictionTransaction).restrictionType,
                modifications: (transaction as AccountMosaicRestrictionTransaction).modifications.map((modification) => {
                        return modification.toDTO();
                    }),
            };
        case TransactionType.MODIFY_MULTISIG_ACCOUNT:
            return {
                minApprovalDelta: (transaction as MultisigAccountModificationTransaction).minApprovalDelta,
                minRemovalDelta: (transaction as MultisigAccountModificationTransaction).minRemovalDelta,
                modifications: (transaction as MultisigAccountModificationTransaction).modifications.map((modification) => {
                        return modification.toDTO();
                    }),
            };
        case TransactionType.MOSAIC_ALIAS:
            return {
                aliasAction: (transaction as MosaicAliasTransaction).aliasAction,
                namespaceId: (transaction as MosaicAliasTransaction).namespaceId.toHex(),
                mosaicId: (transaction as MosaicAliasTransaction).mosaicId.toHex(),
            };
        case TransactionType.MOSAIC_DEFINITION:
            return {
                nonce: (transaction as MosaicDefinitionTransaction).nonce,
                mosaicId: (transaction as MosaicDefinitionTransaction).mosaicId.toHex(),
                flags: (transaction as MosaicDefinitionTransaction).flags.getValue(),
                divisibility: (transaction as MosaicDefinitionTransaction).divisibility,
                duration: (transaction as MosaicDefinitionTransaction).duration.toString(),
            };
        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            return {
                mosaicId: (transaction as MosaicSupplyChangeTransaction).mosaicId.toHex(),
                direction: (transaction as MosaicSupplyChangeTransaction).direction,
                delta: (transaction as MosaicSupplyChangeTransaction).delta.toString(),
            };
        case TransactionType.REGISTER_NAMESPACE:
            const registerNamespaceDuration = (transaction as NamespaceRegistrationTransaction).duration;
            const registerNamespaceParentId = (transaction as NamespaceRegistrationTransaction).parentId;

            const jsonObject = {
                namespaceType: (transaction as NamespaceRegistrationTransaction).namespaceType,
                namespaceName: (transaction as NamespaceRegistrationTransaction).namespaceName,
                id: (transaction as NamespaceRegistrationTransaction).namespaceId.toHex(),
            };

            if (registerNamespaceDuration) {
                Object.assign(jsonObject, {duration: registerNamespaceDuration.toString()});
            }
            if (registerNamespaceParentId) {
                Object.assign(jsonObject, {parentId: registerNamespaceParentId.toHex()});
            }
            return jsonObject;
        case TransactionType.SECRET_LOCK:
            return {
                mosaicId: (transaction as SecretLockTransaction).mosaic.id.id,
                amount: (transaction as SecretLockTransaction).mosaic.amount.toString(),
                duration: (transaction as SecretLockTransaction).duration.toString(),
                hashAlgorithm: (transaction as SecretLockTransaction).hashType,
                secret: (transaction as SecretLockTransaction).secret,
                recipientAddress: (transaction as SecretLockTransaction).recipientAddress.toDTO(),
            };
        case TransactionType.SECRET_PROOF:
            return {
                hashAlgorithm: (transaction as SecretProofTransaction).hashType,
                secret: (transaction as SecretProofTransaction).secret,
                recipientAddress: (transaction as SecretProofTransaction).recipientAddress.toDTO(),
                proof: (transaction as SecretProofTransaction).proof,
            };
        case TransactionType.TRANSFER:
            return {
                recipientAddress: (transaction as TransferTransaction).recipientAddress.toDTO(),
                mosaics: (transaction as TransferTransaction).mosaics.map((mosaic) => {
                    return mosaic.toDTO();
                }),
                message: (transaction as TransferTransaction).message.toDTO(),
            };
        case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
            return {
                mosaicId: (transaction as MosaicGlobalRestrictionTransaction).mosaicId.toHex(),
                referenceMosaicId: (transaction as MosaicGlobalRestrictionTransaction).referenceMosaicId.toHex(),
                restrictionKey: (transaction as MosaicGlobalRestrictionTransaction).restrictionKey.toString(),
                previousRestrictionValue: (transaction as MosaicGlobalRestrictionTransaction).previousRestrictionValue.toString(),
                previousRestrictionType: (transaction as MosaicGlobalRestrictionTransaction).previousRestrictionType,
                newRestrictionValue: (transaction as MosaicGlobalRestrictionTransaction).newRestrictionValue.toString(),
                newRestrictionType: (transaction as MosaicGlobalRestrictionTransaction).newRestrictionType,
            };
        case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
            return {
                mosaicId: (transaction as MosaicAddressRestrictionTransaction).mosaicId.toHex(),
                restrictionKey: (transaction as MosaicAddressRestrictionTransaction).restrictionKey.toString(),
                targetAddress: (transaction as MosaicAddressRestrictionTransaction).targetAddress.toDTO(),
                previousRestrictionValue: (transaction as MosaicAddressRestrictionTransaction).previousRestrictionValue.toString(),
                newRestrictionValue: (transaction as MosaicAddressRestrictionTransaction).newRestrictionValue.toString(),

            };
        case TransactionType.ACCOUNT_METADATA_TRANSACTION:
            return {
                targetPublicKey: (transaction as AccountMetadataTransaction).targetPublicKey,
                scopedMetadataKey: (transaction as AccountMetadataTransaction).scopedMetadataKey.toString(),
                valueSizeDelta: (transaction as AccountMetadataTransaction).valueSizeDelta,
                valueSize: (transaction as AccountMetadataTransaction).value.length,
                value: Convert.uint8ToHex((transaction as AccountMetadataTransaction).value),

            };
        case TransactionType.MOSAIC_METADATA_TRANSACTION:
            return {
                targetPublicKey: (transaction as MosaicMetadataTransaction).targetPublicKey,
                scopedMetadataKey: (transaction as MosaicMetadataTransaction).scopedMetadataKey.toString(),
                valueSizeDelta: (transaction as MosaicMetadataTransaction).valueSizeDelta,
                targetMosaicId: (transaction as MosaicMetadataTransaction).targetMosaicId.id.toHex(),
                valueSize: (transaction as MosaicMetadataTransaction).value.length,
                value: Convert.uint8ToHex((transaction as MosaicMetadataTransaction).value),

            };
        case TransactionType.NAMESPACE_METADATA_TRANSACTION:
            return {
                targetPublicKey: (transaction as NamespaceMetadataTransaction).targetPublicKey,
                scopedMetadataKey: (transaction as NamespaceMetadataTransaction).scopedMetadataKey.toString(),
                valueSizeDelta: (transaction as NamespaceMetadataTransaction).valueSizeDelta,
                targetNamespaceId: (transaction as NamespaceMetadataTransaction).targetNamespaceId.id.toHex(),
                valueSize: (transaction as NamespaceMetadataTransaction).value.length,
                value: Convert.uint8ToHex((transaction as NamespaceMetadataTransaction).value),

            };
        default:
            throw new Error ('Transaction type not implemented yet.');
    }

};
