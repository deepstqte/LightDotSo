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

import { useModals } from "@lightdotso/stores";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import type { FC, ReactNode } from "react";
import { Modal } from "../modal";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface ModalInterceptionProps {
  children: ReactNode;
  type: "op" | "notifications" | "send";
  footerContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const ModalInterception: FC<ModalInterceptionProps> = ({
  children,
  footerContent,
  type,
}) => {
  // ---------------------------------------------------------------------------
  // Stores
  // ---------------------------------------------------------------------------

  const {
    isNotificationsModalVisible,
    isOpModalVisible,
    isSendModalVisible,
    showNotificationsModal,
    showOpModal,
    showSendModal,
    hideNotificationsModal,
    hideOpModal,
    hideSendModal,
  } = useModals();

  // ---------------------------------------------------------------------------
  // Next Hooks
  // ---------------------------------------------------------------------------

  const router = useRouter();
  const pathname = usePathname();

  // ---------------------------------------------------------------------------
  // Memoized Hooks
  // ---------------------------------------------------------------------------

  const isOpen = useMemo(() => {
    switch (type) {
      case "op":
        return isOpModalVisible;
      case "notifications":
        return isNotificationsModalVisible;
      case "send":
        return isSendModalVisible;
    }
  }, [isNotificationsModalVisible, isOpModalVisible, isSendModalVisible, type]);

  // ---------------------------------------------------------------------------
  // Callback Hooks
  // ---------------------------------------------------------------------------

  const onDismiss = useCallback(() => {
    switch (type) {
      case "op":
        hideOpModal();
        router.back();
        break;
      case "notifications":
        hideNotificationsModal();
        router.back();
        break;
      case "send":
        hideSendModal();
        router.back();
        break;
    }
  }, [hideNotificationsModal, hideOpModal, hideSendModal, router, type]);

  // ---------------------------------------------------------------------------
  // Effect Hooks
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (isOpen) {
      return;
    }

    switch (type) {
      case "op":
        if (pathname.includes("op")) {
          showOpModal();
        }
        break;
      case "notifications":
        if (pathname.includes("notifications")) {
          showNotificationsModal();
        }
        break;
      case "send":
        if (pathname.includes("send")) {
          showSendModal();
        }
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, type]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (!isOpen) {
    return null;
  }

  return (
    <Modal footerContent={footerContent} open={isOpen} onClose={onDismiss}>
      {children}
    </Modal>
  );
};