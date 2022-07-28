import { useQuery } from 'react-query';
const useRooms = () => {
    const { data: rooms, isLoading } = useQuery('rooms', () => fetch('https://vacation-rental-aj.herokuapp.com/rooms')
        .then(res => res.json()))
    return [rooms, isLoading]
}
export default useRooms;