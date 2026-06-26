import { useQuery } from "react-query";
import { ENDPOINT } from "../config/env";
const useBlogs = () => {
  const { data: blogs, isLoading } = useQuery("blogs", () =>
    fetch(`${ENDPOINT}/blogs`).then((res) => res.json()),
  );
  return [blogs, isLoading];
};
export default useBlogs;
