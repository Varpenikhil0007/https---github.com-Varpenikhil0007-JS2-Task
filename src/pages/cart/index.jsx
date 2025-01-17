import React, { useState } from "react";
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

  const [message, setMessage] = useState(""); // State to store success/error message

  const isSoupPresent = check_for_soup(cartItems);
  const isBreadPresent = check_for_bread(cartItems);

  let itemsPricing = {};
let subTotal = 0;  // Total cost of the items you're paying for
let savings = 0;   // Total savings
let amount = 0;    // Total amount to be paid

cartItems.forEach((item) => {
  const itemPrice = item.price * item.quantity; // Total price before offers

  // Calculate savings using check_for_offers
  const saving = check_for_offers(item);

  // Calculate the total quantity (including free items)
  const freeItems = saving / item.price; // Free items based on savings
  const totalQuantity = item.quantity + freeItems;

  // Subtotal is calculated as the total quantity times the price
  const itemCost = totalQuantity * item.price;

  subTotal += itemCost; // Total cost before any discounts
  savings += saving;    // Accumulate savings (cost of free items)
  amount += itemCost - saving; // Final amount to be paid (after subtracting savings)

  itemsPricing[item.id] = {
    itemPrice,
    saving,
    itemCost,
  };
});


  

  const uploadToFirebase = async () => {
    try {
      await addDoc(collection(db, "bills"), {
        itemsPricing,
        billAmount: {
          subTotal,
          savings,
          amount,
        },
      });
      setMessage("Bill successfully added!"); // Set success message
      dispatch(emptyCart());
    } catch (e) {
      console.error("Error adding document:", e);
      setMessage("Error adding bill. Please try again."); // Set error message
    }
  };

  return (
    <>
      <div className="mt-20 p-3 max-w-lg mx-auto bg-white rounded-md drop-shadow-lg">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold ">Cart</h1>
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
              <p>Final Amount:</p>
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
            <Link to="/" className="text-red-500">
              Isn't look awful
            </Link>
          </p>
        )}
        {/* Display message */}
        {message && (
          <div
            className={`mt-4 text-center py-2 px-4 rounded ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;

