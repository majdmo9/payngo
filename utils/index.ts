export const storeFront = async (query: any, variables = {}) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_ACCESS_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
};
