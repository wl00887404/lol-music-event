const BASE = import.meta.env.VITE_IMAGE_BASE_URL ?? "";
export const imgUri = (path: string) => {
  if (path.startsWith("/")) {
    return `${BASE}/${path.replace(/^\//, "")}`;
  }

  return path;
};
