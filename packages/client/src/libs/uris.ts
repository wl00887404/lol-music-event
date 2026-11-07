const BASE = import.meta.env.VITE_IMAGE_BASE_URL ?? "";

export const imgUri = (path: string) => {
  if (path.startsWith("/")) {
    return `${BASE}/${path.replace(/^\//, "")}`;
  }

  return path;
};

export function profileUri(image: number | string) {
  const version = (window as any).gameVersion || "16.22.1";
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${image}.png`;
}
