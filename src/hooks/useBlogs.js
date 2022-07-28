import { useQuery } from "react-query";
const useBlogs = () => {
    const { data: blogs, isLoading } = useQuery('blogs', () =>
        fetch('https://vacation-rental-aj.herokuapp.com/blogs')
            .then(res => res.json()))
    return [blogs, isLoading]
}
export default useBlogs;