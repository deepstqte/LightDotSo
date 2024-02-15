// Copyright 2023-2024 Light, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { BigInt } from "@graphprotocol/graph-ts";
import { test, assert } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import { handleUserOperationFromCalldata } from "../src/user-operation";
// import { EntryPoint__getUserOpHashInputUserOpStruct as UserOperationStructTuple } from "../generated/EntryPointv0.6.0/EntryPoint";

// From: https://thegraph.com/docs/en/developing/unit-testing-framework

test("Success", () => {
  // https://sepolia.etherscan.io/tx/0x87efb66c2b17af424b7fd2584d268eb1c301b9337eaad3137be5c4c7bbd574bf
  let opStruct = handleUserOperationFromCalldata(
    "0x1fad948c0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000d53eb5203e367bbdd4f72338938224881fc501ab0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000010dbbe70128929723c1b982e53c51653232e4ff20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000004c4b4000000000000000000000000000000000000000000000000000000000004c4b40000000000000000000000000000000000000000000000000000000000000c350000000000000000000000000000000000000000000000000000000001122e6ea000000000000000000000000000000000000000000000000000000001122e6ea000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000000580000000000756d3e6464f5efe7e413a0af1c7474183815c8b7f285c774a1c925209bebaab24662b22e7cf32e2f7a412bfcb1bf52294b9ed60000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000095000000000018d32df916ff115a25fbefc70baf8b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006517bc953e0624bf37d995fbcab5ccab2dc2589bcfc6bac1581d161a135ce749e1099fe032c83e21360fa516bdd13cb080e4090b924ce7a06459d837ee3556037ea21e381c0000000000000000000000000000000000000000000000000000000000000000000000000000000000004a0001000000010001783610798879fb9af654e2a99929e00e82c3a0f4288c08bc30266b64dc3e23285d634f6658fdeeb5ba9193b5e935a42a1d9bdf5007144707c9082e6eda5d8fbd1b0100000000000000000000000000000000000000000000",
    new BigInt(0),
  );

  assert.assertNotNull(opStruct);
  log.info("Info!", [opStruct.signature.toHexString()]);
  // let expected = new UserOperationStructTuple();

  // assert.tupleEquals(opStruct, expected);
});
