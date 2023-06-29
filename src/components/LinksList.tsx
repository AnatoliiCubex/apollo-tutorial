import React from "react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { getLinksToRender, getQueryVariables } from "@/utils/linksListPage";

import LinkItem from "./LinkItem";
import { LINKS_PER_PAGE } from "@/constants";

export const FEED_QUERY = gql`
  query FeedQuery($take: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

export type Link = {
  createdAt: string;
  description: string;
  id: string;
  url: string;
  __typename: string;
  postedBy: {
    id: string;
    name: string;
  };
  votes: {
    id: string;
    user: {
      id: string;
    };
  }[];
};

export type Feed = {
  newLink: Link;
  feed: {
    id: string;
    links: Link[];
    __typename: string;
    count: number;
  };
};

const LinksList = () => {
  const router = useRouter();
  const isNewPage = router.pathname.includes("new");
  const page = Number(router.query.page);
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

  const { data, loading, error, subscribeToMore } = useQuery<Feed>(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page),
  });

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(({ id }) => id === newLink.id);
      if (exists) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename,
        },
      });
    },
  });

  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION,
  });

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      <div>
        {data && (
          <>
            {getLinksToRender(isNewPage, data).map((link, index) => (
              <LinkItem key={link.id} link={link} index={index + pageIndex} />
            ))}
            {isNewPage && (
              <div className='flex ml4 mv3 gray'>
                <div
                  className='pointer mr2'
                  onClick={() => {
                    if (page > 1) {
                      router.push(`/new/${page - 1}`);
                    }
                  }}
                >
                  Previous
                </div>
                <div
                  className='pointer'
                  onClick={() => {
                    if (page <= data.feed.count / LINKS_PER_PAGE) {
                      const nextPage = page + 1;
                      router.push(`/new/${nextPage}`);
                    }
                  }}
                >
                  Next
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LinksList;
