import { useQuery } from 'react-query';
const useRooms = () => {
    const { data: rooms, isLoading } = useQuery('rooms', () => fetch('http://localhost:5000/rooms')
        .then(res => res.json()))
    return [rooms, isLoading]
}
export default useRooms;