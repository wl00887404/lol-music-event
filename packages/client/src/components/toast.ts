import { toast as baseToast } from "sonner";

export const dismiss = baseToast.dismiss;

export function success(message: string) {
  return baseToast.success(message, {
    position: "top-center",
    style: {
      backgroundColor: "#d1e7dd",
      color: "#0f5132",
      borderColor: "#badbcc",
    },
  });
}

export function error(message: string) {
  return baseToast.error(message, {
    position: "top-center",
    style: {
      backgroundColor: "#f8d7da",
      color: "#842029",
      borderColor: "#f5c2c7",
    },
  });
}

export function info(message: string) {
  return baseToast.info(message, {
    position: "top-center",
    style: {
      backgroundColor: "#e2e3e5",
      color: "#41464b",
      borderColor: "##d3d6d8",
    },
  });
}

export function debug(message: string) {
  const active = window.location.search.includes("debug");
  if (!active) return;
  return baseToast.info(message, {
    position: "top-center",
    style: {
      backgroundColor: "rgb(207, 244, 252)",
      color: "rgb(5, 81, 96)",
      borderColor: "rgb(158, 234, 249)",
    },
  });
}

const toast = { success, error, info, dismiss, debug };

export default toast;
