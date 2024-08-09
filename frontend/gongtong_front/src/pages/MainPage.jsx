import Pagination from "../common/components/Pagination";
import ClassListDropdown from "../components/ClassList/ClassListDropdown";
import SearchBar from "./../components/ClassList/SearchBar";

const mainPage = () => {
  return (
    <>
      <div>Helloworld</div>
      <Pagination />
      <SearchBar />
      <div className="left-3/4">
        <ClassListDropdown />
      </div>
    </>
  );
};

export default mainPage;
