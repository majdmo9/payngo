import Dashboard from "@payngo/components/Dashboard";
import { ProductsResponse } from "@payngo/types/products";
import { storeFront } from "@payngo/utils";
import { getProducts } from "@payngo/utils/schemas";

export default function Home({ pageInfo, edges }: ProductsResponse) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24">
      <Dashboard edges={edges} pageInfo={pageInfo} />
    </main>
  );
}

export const getStaticProps = async () => {
  const { data } = await storeFront(getProducts);

  return {
    props: { pageInfo: data.products.pageInfo, edges: data.products.edges },
  };
};
