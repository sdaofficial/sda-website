import { gql } from '@apollo/client';
import apolloClient from './apollo-client';

const GET_PAGE_BY_ID = gql`
  query GetPageById($id: String!) {
    page(id: $id) {
      pageTitle
      pageSlug
      pageSectionsCollection {
        items {
          ... on SectionBlock {
            internalName
            sectionTheme
            sectionLayout
            sectionEyebrow
            sectionHeading
            sectionHeadingHighlights
            sectionBody
            sectionImageStyle
            sectionImagesCollection(limit: 5) {
              items {
                description
                url
              }
            }
            sectionCtAsCollection(limit: 5) {
              items {
                ctaLabel
                ctaUrl
              }
            }
            sectionStatisticsCollection(limit: 5) {
              items {
                statLabel
                statValue
              }
            }
            subBlocks {
              title
              body
            }
            videoUrl
            videoCaption
            videoSubcaption
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
