export const getProducts = `
query Products {
  products(first: 6) {
    edges {
      node {
        id
        title
        priceRange{
          minVariantPrice{
            amount
          }
        }
        images(first: 1) {
          edges {
            node {
              url(transform: {})
            }
          }
        }
        variants(first: 1){
          edges{
            node{
              id
            }
          }
        }
      }
    } 
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
`;

export const paginateProducts = `
query Products($after: String!) {
  products(first: 6,after: $after) {
    edges {
      node {
        id
        title
        priceRange{
          minVariantPrice{
            amount
          }
        }
        images(first: 1) {
          edges {
            node {
              url(transform: {})
            }
          }
        }
        variants(first: 1){
          edges{
            node{
              id
            }
          }
        }
      }
    } 
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
`;

export const checkoutMutation = `
  mutation checkoutCreate($variantId: ID!) {
    checkoutCreate(input: { lineItems: { variantId: $variantId, quantity: 1 } }) {
      checkout {
        webUrl
      }
    }
  }
`;
