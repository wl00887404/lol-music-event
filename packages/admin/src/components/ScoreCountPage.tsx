import { useQuery } from "@tanstack/react-query";
import Chart from "chart.js/auto";
import { useEffect, useMemo, useRef } from "react";
import { getScoreCount } from "../apis";
import { Flex, Space } from "antd";

function ScoreCountPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data } = useQuery({
    queryKey: ["getScoreCount"],
    queryFn: getScoreCount,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!data) return;

    const chart = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.map((d) => d.score),
        datasets: [
          {
            label: "人數",
            data: data.map((d) => d.count),
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            anchor: "end", // 標籤貼在長條頂端
            align: "top", // 顯示在長條上方
            formatter: (value: number) => value,
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => chart.destroy();
  }, [data]);

  const { average, median, maxScore } = useMemo(() => {
    if (!data) return { average: "-", median: "-", maxScore: "-" };

    const flatData = [];
    let totalScore = 0;
    let totalCount = 0;

    for (const { score, count } of data) {
      totalScore += score * count;
      totalCount += count;
      flatData.push(...Array(count).fill(score));
    }

    const midIndex = Math.floor(totalCount / 2);
    return {
      average: (totalScore / totalCount).toFixed(2),
      median:
        totalCount % 2 == 0
          ? (flatData[midIndex] + flatData[midIndex + 1]) / 2
          : flatData[midIndex],
      maxScore: data[data.length - 1].score,
    };
  }, [data]);

  return (
    <Flex vertical gap="medium">
      <Space size="large">
        <div>平均數：{average}</div>
        <div>中位數：{median}</div>
        <div>最大值：{maxScore}</div>
      </Space>
      <canvas ref={canvasRef} id="score-count" />
    </Flex>
  );
}

export default ScoreCountPage;
