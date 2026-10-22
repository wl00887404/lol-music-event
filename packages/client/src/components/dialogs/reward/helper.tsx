export const getIconSrc = (key: string) => {
  return `/rewards/icons/${key.replace("free-", "paid-")}.png`;
};

export const getTitleSrc = (key: string) => {
  // paid-idol-card-title
  // paid-idol-box-title
  // kda-cdc-blades-title
  // 這三個特別高，再看看要不要做特別的處理

  return `/rewards/titles/${key.replace("free-", "paid-")}-title.png`;
};
