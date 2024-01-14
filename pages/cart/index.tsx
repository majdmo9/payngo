import Cart from "@payngo/components/Cart";
import { ProductsResponse } from "@payngo/types/products";
import { storeFront } from "@payngo/utils";
import { queryListOfProducts } from "@payngo/utils/schemas";
import { GetServerSideProps, GetStaticProps } from "next";

const CartPage = ({ cartItems }: { cartItems: ProductsResponse["edges"] }) => (
  <main className="flex min-h-screen flex-col items-center justify-between sm:p-24">
    <Cart cartItems={cartItems} />
  </main>
);

export default CartPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const cartItemsIds = (JSON.parse((query?.cartItems as string) ?? "[]") as string[]).map(fullId => {
    const fullIdArray = fullId.split("/");
    return fullIdArray[fullIdArray.length - 1];
  });

  const { data } = await storeFront(queryListOfProducts, {
    query: cartItemsIds.join(" OR "),
  });

  return { props: { cartItems: data.products.edges } };
};
