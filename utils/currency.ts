export const formatCurrency = (price: number) =>
  Intl.NumberFormat("en-IL", { style: "currency", currency: "ils", minimumFractionDigits: 0 }).format(price);
