import { gql } from '@apollo/client';
import apolloClient from './apollo-client';

const GET_PAGE_BY_ID = gql`
  query GetPageById($id: String!) {
    page(id: $id) {
      title
      slug
      seoMetadata {
        metaTitle
        metaDescription
      }
      sectionsCollection(limit: 10) {
        items {
          ... on SectionBlock {
            internalName
            theme
            layout
            eyebrow
            heading
            headingHighlights
            body
            imageStyle
            imagesCollection {
              items {
                caption
                altText
                imageAsset {
                  url
                }
              }
            }
            ctAsCollection(limit: 5) {
              items {
                label
                url
                openInNewTab
                style
              }
            }
            statisticsCollection(limit: 5) {
              items {
                label
                value
                heading
                body
                ctaText
                ctaUrl
                grantsCollection(limit: 3) {
                  items {
                    name
                    body
                    url {
                      url
                      label
                    }
                    imageAsset {
                      caption
                      altText
                      imageAsset {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getPageById(id) {
  const { data } = await apolloClient.query({
    query: GET_PAGE_BY_ID,
    variables: { id },
  });
  return data?.page ?? undefined;
}

const contentful = {
  getPageById,
};

export default contentful;
