import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";

import CartItem from "../../components/CartItem";
import {
  check_for_bread,
  check_for_offers,
  check_for_soup,
} from "../../utils/functions";
import { db } from "../../utils/firebase";
import { emptyCart } from "../../features/cartSlice";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [message, setMessage] = useState(""); // State for showing the message

  const isSoupPresent = check_for_soup(cartItems);
  const isBreadPresent = check_for_bread(cartItems);

  let itemsPricing = {};
  let subTotal = 0; // Total cost of items including free ones
  let savings = 0; // Total savings from offers
  let amount = 0; // Final amount to be paid

  cartItems.forEach((item) => {
    const itemPrice = item.price * item.quantity; // Total price before offers
    const { saving, itemCost } = check_for_offers(item, cartItems);

    subTotal += itemPrice;
    savings += saving;
    amount = subTotal - savings;

    itemsPricing[item.id] = {
      itemPrice,
      saving,
      itemCost,
    };
  });

  const uploadToFirebase = async () => {
    // Empty the cart immediately
    dispatch(emptyCart());
    setMessage("Bill added successfully!"); // Show success message
  
    try {
      await addDoc(collection(db, "bills"), {
        itemsPricing,
        billAmount: {
          subTotal,
          savings,
          amount,
        },
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error adding document: ", error.message);
      setMessage("Failed to add the bill. Please try again."); // Set error message
    }
  };
  

  return (
    <>
      <div className="mt-20 p-3 max-w-lg mx-auto bg-white rounded-md drop-shadow-lg">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold ">Basket</h1>
          <Link to="/">
            <button className="text-violet-500 font-medium rounded-sm py-1 px-2 text-xs bg-gray-200 hover:bg-violet-600 hover:text-white">
              Go back
            </button>
          </Link>
        </div>
        <hr className="h-px mt-2 mb-3 bg-gray-200 border-2 dark:bg-gray-700" />
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item) => (
              <div key={item.id}>
                <CartItem
                  item={item}
                  itemsPricing={itemsPricing}
                  isSoupPresent={isSoupPresent}
                  isBreadPresent={isBreadPresent}
                />
                <hr className="h-px my-0 bg-gray-200 border-1 dark:bg-gray-700" />
              </div>
            ))}

            <div className="mx-2 my-2 flex justify-between">
              <p>Sub Total:</p>
              <p>₹ {subTotal}</p>
            </div>
            <div className="mx-2 my-2 flex justify-between text-red-500">
              <p>Savings:</p>
              <p>₹ {savings}</p>
            </div>
            <div className="mx-2 my-2 flex justify-between font-medium">
              <p>Total Amount:</p>
              <p>₹ {amount}</p>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={uploadToFirebase}
                className="text-violet-500 font-medium rounded-sm py-2 px-3 text-xs bg-gray-200 hover:bg-violet-600 hover:text-white"
              >
                Add Bill To Firebase
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm ">
            Empty Cart,{" "}
            <Link to="/" className="text-violet-500">
              let's fill it up!
            </Link>
          </p>
        )}

        {/* Display success or error message */}
        {message && (
          <div className="mt-4 text-center">
            <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
