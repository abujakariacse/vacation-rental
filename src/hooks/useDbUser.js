import { useQuery } from "react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import { ENDPOINT } from "../config/env";

const useDbUser = () => {
    const [user] = useAuthState(auth);
    return useQuery(
        ["dbUser", user?.email],
        async () => {
            if (!user?.email) return null;
            const res = await fetch(`${ENDPOINT}/user/${user.email}`);
            if (!res.ok) throw new Error("Could not fetch user profile");
            return res.json();
        },
        { enabled: !!user?.email }
    );
};

export default useDbUser;
