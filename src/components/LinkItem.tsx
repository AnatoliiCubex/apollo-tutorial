import React from "react";

type Props = {
  description: string;
  url: string;
};
const LinkItem: React.FC<Props> = ({ description, url }) => {
  return (
    <div>
      <div>
        {description} ({url})
      </div>
    </div>
  );
};

export default LinkItem;
