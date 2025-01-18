export const check_for_soup = (cartItems) => {
  return cartItems.some((item) => item.id === 4); // Soup ID = 4
};

// Function to check if bread is present in the cart
export const check_for_bread = (cartItems) => {
  return cartItems.some((item) => item.id === 1); // Bread ID = 1
};

export const check_for_offers = (item, cartItems) => {
  let saving = 0;
  let itemCost = item.price * item.quantity;

  switch (item.id) {
    case 3: // Cheese Offer
      if (item.quantity === 1) {
        saving = item.price; // If 1 cheese, 1 free
        itemCost = item.price; // Item cost equals item price when only 1 cheese
      } else {
        const freeCheeses = Math.floor(item.quantity / 2); // 1 free for every 2 purchased
        saving = freeCheeses * item.price;
        itemCost = item.price * item.quantity //- saving; // Adjust cost
      }
      break;

      case 1: // Bread Offer
      const isSoupPresent = check_for_soup(cartItems);
      if (isSoupPresent) {
        saving = item.price / 2; // Half price for one bread
        itemCost = item.price * item.quantity - saving; // Apply saving for only one bread
      } else {
        itemCost = item.price * item.quantity; // No discount if soup is not present
      }
      break;
    

    case 5: // Butter Offer
      saving = (item.price / 3) * item.quantity; // One-third off each butter
      itemCost = item.price * item.quantity - saving;
      break;

    default:
      saving = 0;
      itemCost = item.price * item.quantity;
      break;
  }

  return { saving, itemCost };
};
