export const getIconSrc = (key: string) => {
  return `/rewards/icons/${key.replace("free-", "paid-")}.png`;
};

export const getTitleSrc = (key: string) => {
  return `/rewards/titles/${key.replace("free-", "paid-")}-title.png`;
};
