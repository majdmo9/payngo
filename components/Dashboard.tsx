import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { PlusIcon, ShoppingBagIcon } from "@heroicons/react/16/solid";
import InfiniteScroll from "react-infinite-scroll-component";

import { ProductsResponse } from "@payngo/types/products";
import { storeFront } from "@payngo/utils";
import { formatCurrency } from "@payngo/utils/currency";
import { checkoutMutation, paginateProducts } from "@payngo/utils/schemas";
import { LocalStorageVarivables } from "@payngo/constants/localStorag";

import Badge from "./generals/Badge";
import Loader from "./Loader";
import SearchBar from "./SearchBar";
import { useIsMobile } from "@payngo/hooks/useIsMobile";

const Dashboard = ({ edges, pageInfo }: ProductsResponse) => {
  const router = useRouter();
  const { isMobile } = useIsMobile();

  const [isLoading, setLoading] = useState("");
  const [products, setProducts] = useState(edges);
  const [productsToRender, setProductsToRender] = useState(edges);
  const [haseNext, setHasNext] = useState(pageInfo.hasNextPage);
  const [searchText, setSearchText] = useState("");
  const [cartItems, setCartItems] = useState<string[]>([]);

  const handleCheckout = async (id: string) => {
    setLoading(id);
    const { data } = await storeFront(checkoutMutation, { variantId: id });
    const { webUrl } = data.checkoutCreate.checkout;
    setTimeout(() => {
      window.open(webUrl, "_blank");
    });
    setLoading("");
  };

  const handleAddToCart = (id: string) => {
    localStorage.setItem(LocalStorageVarivables.CART_ITEMS, JSON.stringify(Array.from(new Set([...cartItems, id]))));
    setCartItems(JSON.parse(localStorage.getItem(LocalStorageVarivables.CART_ITEMS) ?? "[]"));
  };

  const paginate = async () => {
    const { data } = await storeFront(paginateProducts, { after: pageInfo.endCursor });
    setProducts(prev => Array.from(new Set([...prev, ...data.products.edges])));
    setProductsToRender(prev => Array.from(new Set([...prev, ...data.products.edges])));
    setHasNext(data.products.pageInfo.hasNextPage);
  };

  useEffect(() => {
    if (!searchText) {
      setProductsToRender(products);
      return;
    }
    setProductsToRender(products.filter(el => el.node.title.toLowerCase().includes(searchText)));
  }, [searchText]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCartItems(JSON.parse(localStorage.getItem(LocalStorageVarivables.CART_ITEMS) ?? "[]"));
    }
  }, []);

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex w-full gap-4 py-4 dark:bg-gray-800 sm:bg-transparent sm:dark:bg-transparent bg-gray-300 sticky top-0 sm:relative sm:gap-8 items-center px-4 sm:px-8">
        <SearchBar text={searchText} setText={setSearchText} />
        <button
          onClick={() => {
            router.push({ pathname: "/cart", query: { cartItems: localStorage.getItem(LocalStorageVarivables.CART_ITEMS) } });
          }}
          className="relative bg-gray-50 hover:bg-gray-700 border border-gray-300 text-gray-500 dark:disabled:bg-gray-400 disabled:bg-gray-100 disabled:text-gray-200 hover:text-gray-50 rounded-lg p-1 transition-all dark:text-gray-50 dark:bg-gray-700 dark:border-gray-600"
          disabled={!cartItems.length}
        >
          <Badge count={cartItems.length} />
          <ShoppingBagIcon className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>
      </div>
      <InfiniteScroll
        dataLength={productsToRender.length}
        hasMore={!!productsToRender.length && haseNext}
        next={paginate}
        loader={<Loader />}
        className="flex flex-wrap gap-8 justify-center px-20 py-4 sm:py-12"
      >
        {!!productsToRender.length ? (
          productsToRender.map(product => (
            <div className="items-start flex flex-col gap-4 shadow-lg p-4 rounded-lg bg-white justify-between" key={product.node.id}>
              <p className="font-semibold text-md dark:text-black">{product.node.title.toUpperCase()}</p>
              <Image className="rounded-lg" alt="nft-image" width={300} height={300} src={product.node.images.edges[0].node.url} />
              <div className="flex justify-between items-center w-full gap-4 sm:font-semibold text-sm">
                <button
                  onClick={() => handleAddToCart(product.node.id)}
                  className="flex justify-between  text-white bg-blue-600 ml-auto disabled:bg-gray-50 disabled:text-gray-300 p-2 rounded-lg w-full items-center"
                  disabled={cartItems.includes(product.node.id)}
                >
                  <div />
                  {isMobile ? <ShoppingBagIcon className="w-5 h-5" /> : "ADD TO CART"}
                  {!isMobile ? <PlusIcon className="w-4 h-4" /> : <></>}
                  <div />
                </button>
                <button
                  onClick={() => handleCheckout(product.node.variants.edges[0].node.id)}
                  className="flex justify-between text-white bg-blue-600 ml-auto p-2 rounded-lg w-full items-center"
                >
                  <div />
                  {!isMobile ? "BUY" : <></>} {formatCurrency(Number(product.node.priceRange.minVariantPrice.amount))}
                  {isLoading === product.node.variants.edges[0].node.id ? <Loader /> : <div />}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No Products...😔</div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default Dashboard;
