import toast from "@/components/toast";
import { useRef, useCallback, useState } from "react";

function useSvgDownload(filename: string, width: number, height: number) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const svgOnLoad = () => {
    toast.debug("svg onload");
    setIsLoaded(true);
  };

  const download = useCallback(async () => {
    const svg = svgRef.current;
    if (!svg) return;
    if (!isLoaded) return;

    // 確保字型真的 ready
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const svgString = new XMLSerializer().serializeToString(svg);
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

    const imgEl = new Image();
    const canvas = document.createElement("canvas");
    canvas.width = width || svg.width.baseVal.value;
    canvas.height = height || svg.height.baseVal.value;

    const main = async () => {
      setIsCapturing(true);
      toast.debug("imgEl onload");

      // 確保 bitmap 真的 decode 完成
      if (imgEl.decode) {
        try {
          // toast.debug("imgEl await decode");
          await imgEl.decode();
          // toast.debug("imgEl finish decode");
        } catch (e) {
          toast.debug("decode failed: " + e);
        }
      }

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(imgEl, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        // 產生圖片失敗了，過 0.1 秒後再試一次
        toast.debug(`blob.size: ${blob.size}`);
        if (blob.size < 30_000) {
          return setTimeout(() => {
            main();
          }, 100);
        }

        // console.log(blob.size);
        toast.debug("canvas toBlob");

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        setIsCapturing(false);
      }, "image/jpeg");
    };

    imgEl.onload = main;
    imgEl.src = dataUrl;
  }, [filename, height, width, isLoaded]);

  return { svgRef, download, svgOnLoad, isLoaded, isCapturing };
}

export default useSvgDownload;
