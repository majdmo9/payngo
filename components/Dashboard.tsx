import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ProductsResponse } from "@payngo/types/products";
import { storeFront } from "@payngo/utils";
import { formatCurrency } from "@payngo/utils/currency";
import { checkoutMutation, paginateProducts } from "@payngo/utils/schemas";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "./Loader";
import SearchBar from "./SearchBar";

const Dashboard = ({ edges, pageInfo }: ProductsResponse) => {
  const [isLoading, setLoading] = useState("");
  const [products, setProducts] = useState(edges);
  const [productsToRender, setProductsToRender] = useState(edges);
  const [haseNext, setHasNext] = useState(pageInfo.hasNextPage);
  const [searchText, setSearchText] = useState("");

  const handleCheckout = async (id: string) => {
    setLoading(id);
    const { data } = await storeFront(checkoutMutation, { variantId: id });
    const { webUrl } = data.checkoutCreate.checkout;
    window.open(webUrl, "_blank");
    setLoading("");
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
    setProductsToRender(products.filter(el => el.node.title.includes(searchText)));
  }, [searchText]);

  return (
    <div className="flex flex-col gap-12 w-full items-center">
      <SearchBar text={searchText} setText={setSearchText} />
      <InfiniteScroll
        dataLength={productsToRender.length}
        hasMore={!!productsToRender.length && haseNext}
        next={paginate}
        loader={<Loader />}
        className="flex flex-wrap gap-8 justify-center"
      >
        {!!productsToRender.length ? (
          productsToRender.map(product => (
            <div className="items-start flex flex-col gap-4 shadow-lg p-4 rounded-lg bg-white justify-between" key={product.node.id}>
              <p className="font-semibold text-md dark:text-black">{product.node.title.toUpperCase()}</p>
              <Image className="rounded-lg" alt="nft-image" width={300} height={300} src={product.node.images.edges[0].node.url} />
              <button
                onClick={() => handleCheckout(product.node.variants.edges[0].node.id)}
                className="flex justify-between font-semibold  bg-blue-600 ml-auto p-2 rounded-lg w-full items-center"
              >
                <div />
                BUY {formatCurrency(Number(product.node.priceRange.minVariantPrice.amount))}
                {isLoading === product.node.variants.edges[0].node.id ? <Loader /> : <div />}
              </button>
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
