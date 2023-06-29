import React from "react";
import { gql, useMutation } from "@apollo/client";

import { FEED_QUERY, Feed, Link } from "./LinksList";
import { timeDifferenceForDate } from "@/utils/timeDifference";
import { AUTH_TOKEN, LINKS_PER_PAGE } from "@/constants";

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
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

const take = LINKS_PER_PAGE;
const skip = 0;
const orderBy = { createdAt: "desc" };

type Props = {
  link: Link;
  index: number;
};

const LinkItem: React.FC<Props> = ({ link, index }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const [upVote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id,
    },
    update: (cache, { data: { vote } }) => {
      const data = cache.readQuery<Feed>({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy,
        },
      });

      const updatedLinks = data?.feed.links.map((feedLink) => {
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote],
          };
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks,
          },
        },
        variables: {
          take,
          skip,
          orderBy,
        },
      });
    },
  });

  return (
    <div className='flex mt2 items-start'>
      <div className='flex items-center'>
        <span className='gray'>{index + 1}.</span>
        {authToken && (
          <div
            className='ml1 gray f11'
            style={{ cursor: "pointer" }}
            onClick={() => upVote()}
          >
            ▲
          </div>
        )}
      </div>
      <div className='ml1'>
        <div>
          {link.description} ({link.url})
        </div>
        {
          <div className='f6 lh-copy gray'>
            {link.votes.length} votes | by{" "}
            {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        }
      </div>
    </div>
  );
};

export default LinkItem;
