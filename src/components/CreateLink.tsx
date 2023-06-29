import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { FEED_QUERY, Feed } from "./LinksList";

const CREATE_LINK_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    description: "",
    url: "",
  });

  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url,
    },
    onCompleted: () => router.push("/"),

    update: (cache, { data: { post } }) => {
      const data = cache.readQuery<Feed>({
        query: FEED_QUERY,
      });
      if (data) {
        cache.writeQuery({
          query: FEED_QUERY,
          data: {
            feed: {
              links: [post, ...data.feed.links],
            },
          },
        });
      }
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createLink();
        }}
      >
        <div className='flex flex-column'>
          <input
            className='mb2'
            value={formState.description}
            onChange={(e) =>
              setFormState({
                ...formState,
                description: e.target.value,
              })
            }
            type='text'
            placeholder='A description for the link'
          />
          <input
            className='mb2'
            value={formState.url}
            onChange={(e) =>
              setFormState({
                ...formState,
                url: e.target.value,
              })
            }
            type='text'
            placeholder='The URL for the link'
          />
        </div>
        <button type='submit' className='button'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateLink;
