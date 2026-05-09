import type { ComponentType } from "react";
import ProfileOne from "../components/modals/profile/profileOne";
import ProfileTwo from "../components/modals/profile/profileTwo";
import DeleteActionModal from "../components/modals/action/delete";
import LogoutActionModal from "../components/modals/action/logout";

type ModalComponent = ComponentType<{
  modalId: string;
  data?: unknown; // Ensuring data is optional
}>;

export const MODAL_REGISTRY = {
  "profile-1": ProfileOne,
  "profile-2": ProfileTwo,
  "delete-action": DeleteActionModal,
  "log-out": LogoutActionModal,
} as const satisfies Record<string, ModalComponent>;

export type ModalType = keyof typeof MODAL_REGISTRY;
