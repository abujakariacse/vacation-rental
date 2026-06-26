import { useEffect, useState } from "react";
import auth from "../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";
import UserImage from "../images/icons/user.png";

const useProfilePhoto = () => {
  const [user] = useAuthState(auth);
  const [shownImage, setShownImage] = useState(UserImage);
  useEffect(() => {
    setShownImage(user?.photoURL || UserImage);
  }, [user?.photoURL]);
  return shownImage;
};
export default useProfilePhoto;
