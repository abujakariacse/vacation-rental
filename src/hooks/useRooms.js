import { useQuery } from "react-query";
import { ENDPOINT } from "../config/env";
const useRooms = () => {
  const { data: rooms, isLoading } = useQuery("rooms", () =>
    fetch(`${ENDPOINT}/rooms`).then((res) => res.json()),
  );

  return [rooms, isLoading];
};
export default useRooms;
