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
  feed: {
    id: string;
    links: Link[];
    __typename: string;
  };
};

const LinksList = () => {
  const { data } = useQuery<Feed>(FEED_QUERY);

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
