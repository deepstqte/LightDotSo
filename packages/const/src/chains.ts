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

import {
  mainnet,
  base,
  polygon,
  optimism,
  sepolia,
  polygonMumbai,
  arbitrum,
  gnosis,
  bsc,
  avalanche,
  baseSepolia,
  optimismSepolia,
  arbitrumSepolia,
} from "viem/chains";
import type { Chain } from "viem/chains";

// -----------------------------------------------------------------------------
// Mainnet
// -----------------------------------------------------------------------------

export const MAINNET_CHAINS = [
  mainnet,
  optimism,
  bsc,
  gnosis,
  polygon,
  base,
  avalanche,
  arbitrum,
] as readonly [Chain, ...Chain[]];

// -----------------------------------------------------------------------------
// Testnet
// -----------------------------------------------------------------------------

export const TESTNET_CHAINS = [
  sepolia,
  polygonMumbai,
  baseSepolia,
  optimismSepolia,
  arbitrumSepolia,
] as readonly [Chain, ...Chain[]];

// -----------------------------------------------------------------------------
// All
// -----------------------------------------------------------------------------

export const CHAINS = [...MAINNET_CHAINS, ...TESTNET_CHAINS] as const;