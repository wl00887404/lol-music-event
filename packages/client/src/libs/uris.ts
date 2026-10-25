const BASE = import.meta.env.VITE_IMAGE_BASE_URL ?? "";
export const imgUri = (path: string) => `${BASE}/${path.replace(/^\//, "")}`;
