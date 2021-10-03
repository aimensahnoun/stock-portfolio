export const setPortfolio = (portfolioData) => ({
  type: "SET_PORTFOLIO",
  payload: portfolioData,
});

export const addStock = (stockData) => ({
  type: "ADD_STOCK",
  payload: stockData,
});
