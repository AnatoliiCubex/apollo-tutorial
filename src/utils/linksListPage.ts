import { Feed } from "@/components/LinksList";
import { LINKS_PER_PAGE } from "@/constants";

export const getQueryVariables = (isNewPage: boolean, page: number) => {
  // console.log(page);
  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const take = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = { createdAt: "desc" };
  return { take, skip, orderBy };
};

export const getLinksToRender = (isNewPage: boolean, data: Feed) => {
  if (!isNewPage) {
    return data.feed.links;
  }
  const rankedLinks = [...data.feed.links];
  rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
  return rankedLinks;
};
