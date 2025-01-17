export const check_for_soup = (cartItems) => {
  let i = 0;
  const len = cartItems.length;
  while (i < len) {
    if (cartItems[i].id === 4) return true;
    i++;
  }
  return false;
};

export const check_for_bread = (cartItems) => {
  let i = 0;
  const len = cartItems.length;
  while (i < len) {
    if (cartItems[i].id === 1) return true;
    i++;
  }
  return false;
};

export const check_for_offers = (item) => {
  let freeItems = 0;

  switch (item.id) {
    case 3: // Cheese logic
      if (item.quantity === 1) {
        freeItems = 1; // Special case: 1 cheese gets 1 free
      } else {
        freeItems = Math.floor(item.quantity / 2); // General case
      }
      break;

    default:
      freeItems = 0; // No offers for other items
      break;
  }

  // Return savings as the cost of the free items
  return freeItems * item.price;
};

