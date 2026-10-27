import toast from "@/components/toast";
import { useState, useEffect } from "react";

interface Assets {
  font1Base64: string;
  font2Base64: string;
  imageBase64: string;
}

async function fetchBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function useLoadAssets(
  fontPath1: string,
  fontPath2: string,
  imagePath: string,
) {
  const [assets, setAssets] = useState<Assets | null>(null);

  useEffect(() => {
    Promise.all([
      fetchBase64(fontPath1),
      fetchBase64(fontPath2),
      fetchBase64(imagePath),
    ]).then(([font1Base64, font2Base64, imageBase64]) => {
      toast.debug("assets onload");
      setAssets({ font1Base64, font2Base64, imageBase64 });
    });
  }, [fontPath1, fontPath2, imagePath]);

  return assets;
}

export default useLoadAssets;
