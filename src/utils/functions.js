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

export const check_for_offers = (item, itemPrice, isSoupPresent) => {
  let saving = 0;

  switch (item.id) {
    case 1: // Bread
      if (isSoupPresent) saving = itemPrice / 2;
      break;

      case 3: // Cheese (Buy 1 Get 1 Free)
      // Calculate savings equal to the cost of one cheese per item
      saving = item.quantity * item.price;
      break;

    case 5: // Butter
      saving = itemPrice / 3; // 33% off
      break;

    default:
      saving = 0;
      break;
  }

  return saving;
};
