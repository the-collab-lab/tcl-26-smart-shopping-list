const isRecentlyPurchased = (lastPurchaseDate) => {
  const now = Math.floor(new Date() / 1000); // unix timestamp of the current time (seconds)
  return now - lastPurchaseDate < 24 * 60 * 60; // return boolean based on whether 24 hours has elapsed
};

const isPurchaseWithinUndoWindow = (lastPurchaseDate) => {
  const now = Math.floor(new Date() / 1000); // unix timestamp of the current time (seconds)
  return now - lastPurchaseDate < 5 * 60; // return boolean based on whether more than 5 minutes has elapsed
};

export { isRecentlyPurchased, isPurchaseWithinUndoWindow };
