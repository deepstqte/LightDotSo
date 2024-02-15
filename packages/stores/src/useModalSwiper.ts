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

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

type DevStore = {
  pageIndex: number;
  setPageIndex: (index: number) => void;
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export const useModalSwiper = create(
  devtools<DevStore>(
    set => ({
      pageIndex: 0,
      setPageIndex: (index: number) => set({ pageIndex: index }),
    }),
    {
      anonymousActionType: "useModalSwiper",
      name: "DevStore",
      serialize: { options: true },
    },
  ),
);
