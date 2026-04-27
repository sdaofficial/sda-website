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
          __typename
          ... on SectionBlock {
            internalName
            theme
            layout
            eyebrow
            heading
            headingHighlights
            body
            subBlocksCollection(limit: 5) {
              items {
                title
                body
              }
            }
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
            videoUrl
            videoCaption
            videoSubcaption
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
          ... on EventsSectionBlock {
            internalName
            theme
            heading
            eventsCollection(limit: 5) {
              items {
                title
                description
                dateTime
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
          ... on TestimonialBlock {
            internalName
            theme
            eyebrow
            heading
            headingHighlights
            subheading
            testimonialsCollection(limit: 20) {
              items {
                author
                body
                imageAsset {
                  caption
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
