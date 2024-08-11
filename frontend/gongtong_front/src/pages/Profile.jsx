import useProfileStore from "../store/ProfileStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import OtherCategory from "../components/Profile/OtherCategory";

const Profile = () => {
  const { username } = useParams();
  const informations = useProfileStore((state) => state.otherInformations);
  const fetchInformations = useProfileStore(
    (state) => state.fetchOtherInformations
  );

  useEffect(() => {
    fetchInformations(username);
  }, []);

  return (
    <>
      <div className="w-3/4 mt-10 mx-auto content-center">
        <OtherCategory informations={informations} />
      </div>
    </>
  );
};
export default Profile;
