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

import type {
  NotificationListParams,
  NotificationListCountParams,
} from "@lightdotso/params";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import type { inferQueryKeys } from "@lukemorales/query-key-factory";

// -----------------------------------------------------------------------------
// Keys
// -----------------------------------------------------------------------------

export const notification = createQueryKeys("notification", {
  list: (params: NotificationListParams) => ({
    queryKey: [{ params }],
  }),
  listCount: (params: NotificationListCountParams) => ({
    queryKey: [{ params }],
  }),
});

// -----------------------------------------------------------------------------
// Infer
// -----------------------------------------------------------------------------

export type NotificationKeys = inferQueryKeys<typeof notification>;