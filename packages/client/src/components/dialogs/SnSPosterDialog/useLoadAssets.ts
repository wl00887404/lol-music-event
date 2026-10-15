import toast from "@/components/toast";
import { useState, useEffect } from "react";

interface Assets {
  fontBase64: string;
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

function useLoadAssets(fontPath: string, imagePath: string) {
  const [assets, setAssets] = useState<Assets | null>(null);

  useEffect(() => {
    Promise.all([fetchBase64(fontPath), fetchBase64(imagePath)]).then(
      ([fontBase64, imageBase64]) => {
        toast.debug("assets onload");
        setAssets({ fontBase64, imageBase64 });
      },
    );
  }, [fontPath, imagePath]);

  return assets;
}

export default useLoadAssets;
