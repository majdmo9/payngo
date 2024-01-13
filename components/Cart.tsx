import { useEffect, useState } from "react";
import Image from "next/image";

import { ProductsResponse } from "@payngo/types/products";
import { formatCurrency } from "@payngo/utils/currency";
import { storeFront } from "@payngo/utils";
import { checkoutListMutation } from "@payngo/utils/schemas";
import Loader from "./Loader";
import { LocalStorageVarivables } from "@payngo/constants/localStorag";
import { useRouter } from "next/router";

interface Props {
  cartItems: ProductsResponse["edges"];
}

const Cart = ({ cartItems }: Props) => {
  const router = useRouter();
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const { data } = await storeFront(checkoutListMutation({ ids: cartItems.map(item => item.node.variants.edges[0].node.id) }));
    const { webUrl } = data.checkoutCreate.checkout;
    setTimeout(() => {
      window.open(webUrl, "_blank");
    });
    setLoading(false);
  };

  const handleRemoveItem = (id: string) => {
    const currentItems = JSON.parse(localStorage.getItem(LocalStorageVarivables.CART_ITEMS) ?? "[]") as string[];
    const filteredItems = currentItems.filter(item => item !== id);
    localStorage.setItem(LocalStorageVarivables.CART_ITEMS, JSON.stringify(filteredItems));
    if (!filteredItems.length) {
      router.replace("/");
      return;
    }
    router.replace({ pathname: "/cart", query: { cartItems: JSON.stringify(filteredItems) } });
  };

  useEffect(() => {
    const totalPrice = cartItems.reduce((accumulator, currentValue) => accumulator + Number(currentValue.node.priceRange.minVariantPrice.amount), 0);
    setSubtotal(totalPrice);
  }, [cartItems]);

  return (
    <section className="flex items-center justify-start font-poppins w-full">
      <div className="flex-1 px-4 mx-auto max-w-7xl lg:py-4 md:px-6">
        <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="mb-8 text-4xl font-bold dark:text-white">Your Cart</h2>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-8 xl:w-8/12 xl:mb-0">
              <div className="flex flex-wrap items-center mb-6 -mx-4 md:mb-8">
                <div className="w-full md:block hidden px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
                  <h2 className="font-bold text-gray-500 dark:text-white">Product name</h2>
                </div>
                <div className="hidden px-4 lg:block lg:w-2/12">
                  <h2 className="font-bold text-gray-500 dark:text-white">Price</h2>
                </div>
              </div>
              <div className="py-4 mb-8 border-t border-b border-gray-200 dark:border-gray-300">
                {cartItems.map(item => (
                  <div key={item.node.id} className="flex flex-wrap items-center mb-6 -mx-4 md:mb-8">
                    <div className="w-full px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
                      <div className="flex flex-wrap items-center -mx-4">
                        <div className="w-full px-4 mb-3 md:w-1/3">
                          <div className="w-full h-96 md:h-24 md:w-24">
                            <Image width={300} height={300} src={item.node.images.edges[0].node.url} alt="" className="object-cover w-full h-full" />
                          </div>
                        </div>
                        <div className="w-2/3 px-4">
                          <h2 className="mb-2 text-xl font-bold dark:text-white">{item.node.title}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="hidden px-4 lg:block lg:w-2/12">
                      <p className="text-lg font-bold text-blue-500 dark:text-white">
                        {formatCurrency(Number(item.node.priceRange.minVariantPrice.amount))}
                      </p>
                    </div>
                    <div className="hidden px-4 lg:block lg:w-2/12">
                      <button onClick={() => handleRemoveItem(item.node.id)} className="text-md font-semibold text-red-500">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full px-4 xl:w-4/12">
              <div className="p-6 border border-blue-100 dark:bg-gray-900 dark:border-gray-900 bg-blue-50 md:p-8 rounded-lg">
                <h2 className="mb-8 text-3xl font-bold text-gray-700 dark:text-white">Order Summary</h2>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-300 dark:border-gray-700 ">
                  <span className="text-gray-700 dark:text-white">Subtotal</span>
                  <span className="text-xl font-bold text-gray-700 dark:text-white ">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between pb-4 mb-4 ">
                  <span className="text-gray-700 dark:text-white ">Shipping</span>
                  <span className="text-xl font-bold text-gray-700 dark:text-white ">Free</span>
                </div>
                <div className="flex items-center justify-between pb-4 mb-4 ">
                  <span className="text-gray-700 dark:text-white">Order Total</span>
                  <span className="text-xl font-bold text-gray-700 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between ">
                  <button
                    onClick={handleCheckout}
                    className="flex justify-between items-center p-4 w-full font-semibold text-center text-gray-100 uppercase bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    <div /> Checkout {isLoading ? <Loader /> : <div />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
