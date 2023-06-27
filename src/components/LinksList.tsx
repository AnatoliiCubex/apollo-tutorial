import React from "react";
import { useQuery, gql } from "@apollo/client";

import LinkItem from "./LinkItem";

const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

type Feed = {
  feed: {
    id: string;
    links: {
      createdAt: string;
      description: string;
      id: string;
      url: string;
      __typename: string;
    }[];
    __typename: string;
  };
};

const LinksList = () => {
  const { data } = useQuery<Feed>(FEED_QUERY);

  return (
    <div>
      {data && (
        <>
          {data.feed.links.map((link) => (
            <LinkItem
              key={link.id}
              description={link.description}
              url={link.url}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default LinksList;
