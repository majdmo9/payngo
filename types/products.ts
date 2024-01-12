export type Product = {
  id: string;
  title: string;
  priceRange: { minVariantPrice: { amount: string } };
  images: { edges: { node: { url: string } }[] };
  variants: { edges: { node: { id: string } }[] };
};

type ProductEdge = {
  node: Product;
};

export type ProductsResponse = {
  edges: ProductEdge[];
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
};
