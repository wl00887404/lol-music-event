function Empty() {
  return (
    <div className="font-[500] leading-[1.2] text-center py-[0.75em] md:py-[1.25em]">
      <div className="text-[#fff9e5] text-[1em] md:text-[1.5em] ">
        無匹配目標
        <br />
        搜尋範圍內未發現符合條件的資料，請調整關鍵字後重試
      </div>
    </div>
  );
}

export default Empty;
