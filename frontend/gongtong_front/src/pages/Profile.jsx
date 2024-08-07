import useProfileStore from "../store/ProfileStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Category from "../components/Profile/Category";

const Profile = () => {
  const { username } = useParams();
  const informations = useProfileStore((state) => state.otherInformations);
  const fetchInformations = useProfileStore(
    (state) => state.fetchOtherInformations
  );
  // const teachedClasses = useProfileStore((state) => state.teachedClasses)

  useEffect(() => {
    fetchInformations(username);
    console.log(informations);
  }, []);

  return (
    <>
      <div>
        <Category informations={informations} />
      </div>
    </>
  );
};
export default Profile;
