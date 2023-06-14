import { useQuery } from "react-query";
const useBlogs = () => {
  const { data: blogs, isLoading } = useQuery("blogs", () =>
    fetch("http://localhost:5000/blogs").then((res) => res.json())
  );
  return [blogs, isLoading];
};
export default useBlogs;
