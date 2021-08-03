const isUnder24hSincePurchased = (lastPurchaseDate) => {
  const now = Math.floor(new Date() / 1000); // unix timestamp of the current time (seconds)
  return now - lastPurchaseDate < 24 * 60 * 60; // return boolean based on whether 24 hours has elapsed
};

export default isUnder24hSincePurchased;
