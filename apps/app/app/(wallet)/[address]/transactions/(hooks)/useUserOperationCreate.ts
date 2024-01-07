// Copyright (C) 2023 Light, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

"use client";

import { createUserOperation } from "@lightdotso/client";
import { subdigestOf } from "@lightdotso/solutions";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Address, Hex } from "viem";
import {
  isAddressEqual,
  toBytes,
  hexToBytes,
  toHex,
  fromHex,
  decodeFunctionData,
} from "viem";
import { useSignMessage } from "wagmi";
import type { ConfigurationData } from "@/data";
import { useAuth } from "@/stores";
import type { UserOperation } from "@/types";
import { errorToast, successToast } from "@/utils";
import {
  lightWalletABI,
  lightWalletFactoryABI,
  useLightVerifyingPaymasterGetHash,
  useLightVerifyingPaymasterSenderNonce,
} from "@/wagmi";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

type UserOperationCreateProps = {
  address: Address;
  config: ConfigurationData;
  userOperation: UserOperation;
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const useUserOperationCreate = ({
  address,
  config: { owners, threshold },
  userOperation,
}: UserOperationCreateProps) => {
  // ---------------------------------------------------------------------------
  // Stores
  // ---------------------------------------------------------------------------

  const { address: userAddress } = useAuth();

  // ---------------------------------------------------------------------------
  // State Hooks
  // ---------------------------------------------------------------------------

  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // Next Hooks
  // ---------------------------------------------------------------------------

  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Local Variables
  // ---------------------------------------------------------------------------

  const subdigest = subdigestOf(
    address,
    hexToBytes(userOperation.hash as Hex),
    userOperation.chainId,
  );

  // ---------------------------------------------------------------------------
  // Wagmi
  // ---------------------------------------------------------------------------

  const {
    data,
    signMessage,
    isLoading: isSignLoading,
  } = useSignMessage({
    message: { raw: toBytes(subdigest) },
  });

  const { data: paymasterNonce } = useLightVerifyingPaymasterSenderNonce({
    address: userOperation.paymasterAndData.slice(0, 42) as Address,
    chainId: Number(userOperation.chainId),
    args: [userOperation.sender as Address],
  });

  const { data: paymasterHash } = useLightVerifyingPaymasterGetHash({
    address: userOperation.paymasterAndData.slice(0, 42) as Address,
    chainId: Number(userOperation.chainId),
    args: [
      {
        sender: userOperation.sender as Address,
        nonce: userOperation.nonce,
        initCode: userOperation.initCode as Hex,
        callData: userOperation.callData as Hex,
        callGasLimit: userOperation.callGasLimit,
        verificationGasLimit: userOperation.verificationGasLimit,
        preVerificationGas: userOperation.preVerificationGas,
        maxFeePerGas: userOperation.maxFeePerGas,
        maxPriorityFeePerGas: userOperation.maxPriorityFeePerGas,
        paymasterAndData: userOperation.paymasterAndData as Hex,
        signature: toHex(new Uint8Array([2])),
      },
      fromHex(`0x${userOperation.paymasterAndData.slice(154, 162)}`, "number"),
      fromHex(`0x${userOperation.paymasterAndData.slice(162, 170)}`, "number"),
    ],
  });

  // ---------------------------------------------------------------------------
  // Memoized Hooks
  // ---------------------------------------------------------------------------

  const owner = useMemo(() => {
    if (!userAddress) {
      return;
    }

    return owners?.find(owner =>
      isAddressEqual(owner.address as Address, userAddress),
    );
  }, [owners, userAddress]);

  const decodedInitCode = useMemo(() => {
    // If the initCode is `0x`, return
    if (userOperation.initCode === "0x") {
      return;
    }

    // Parse the initCode of the userOperation
    return decodeFunctionData({
      abi: lightWalletFactoryABI,
      data: `0x${userOperation.initCode.slice(42)}` as Hex,
    }).args;
  }, [userOperation.initCode]);

  const decodedCallData = useMemo(() => {
    // Parse the callData of tha args depending on the args type
    switch (userOperation.callData.slice(0, 10)) {
      // If the function selector is `execute` or `executeBatch`
      case "0xb61d27f6":
      case "0x47e1da2a":
        return decodeFunctionData({
          abi: lightWalletABI,
          data: userOperation.callData as Hex,
        }).args;
      default:
        return userOperation.callData;
    }
  }, [userOperation.callData]);

  // ---------------------------------------------------------------------------
  // Effect Hooks
  // ---------------------------------------------------------------------------

  // Sync the loading state
  useEffect(() => {
    setIsLoading(isSignLoading);
  }, [isSignLoading]);

  useEffect(() => {
    const fetchUserOp = async () => {
      if (!data || !owner || !userOperation) {
        return;
      }

      const res = await createUserOperation({
        params: {
          query: {
            chain_id: Number(userOperation.chainId),
          },
        },
        body: {
          signature: {
            owner_id: owner.id,
            signature: toHex(new Uint8Array([...toBytes(data), 2])),
            signature_type: 1,
          },
          user_operation: {
            chain_id: Number(userOperation.chainId),
            hash: userOperation.hash,
            nonce: Number(userOperation.nonce),
            init_code: userOperation.initCode,
            sender: userOperation.sender,
            call_data: userOperation.callData,
            call_gas_limit: Number(userOperation.callGasLimit),
            verification_gas_limit: Number(userOperation.verificationGasLimit),
            pre_verification_gas: Number(userOperation.preVerificationGas),
            max_fee_per_gas: Number(userOperation.maxFeePerGas),
            max_priority_fee_per_gas: Number(
              userOperation.maxPriorityFeePerGas,
            ),
            paymaster_and_data: userOperation.paymasterAndData,
          },
        },
      });

      res.match(
        _ => {
          successToast("You submitted the userOperation result");
          if (threshold >= owner.weight) {
            router.push(`/${address}/op/${userOperation.hash}`);
          }
        },
        err => {
          if (err instanceof Error) {
            errorToast(err.message);
          }
        },
      );
    };

    fetchUserOp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, owner, userOperation, subdigest, threshold, address]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return {
    isLoading,
    isCreatable: typeof owner !== "undefined",
    decodedCallData,
    decodedInitCode,
    paymasterHash,
    paymasterNonce,
    signMessage,
    subdigest,
    threshold,
  };
};
