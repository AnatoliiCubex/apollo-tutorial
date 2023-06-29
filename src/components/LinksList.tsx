import React from "react";
import { useQuery, gql } from "@apollo/client";

import LinkItem from "./LinkItem";

export const FEED_QUERY = gql`
  {
    feed {
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
  };
};

const LinksList = () => {
  const { data, loading, error, subscribeToMore } = useQuery<Feed>(FEED_QUERY);
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
    <div>
      {data && (
        <>
          {data.feed.links.map((link, i) => (
            <LinkItem key={link.id} link={link} index={i} />
          ))}
        </>
      )}
    </div>
  );
};

export default LinksList;
