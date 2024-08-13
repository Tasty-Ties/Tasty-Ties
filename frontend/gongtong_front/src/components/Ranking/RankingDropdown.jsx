import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

const RankingDropdown = ({ sort, onSortChange }) => {
  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <Button className="bg-transparent text-black text-sm border border-2 shadow-none mb-4 px-4 py-2">
          {sort === "weekly"
            ? "주간"
            : sort === "monthly"
            ? "월간"
            : sort === "yearly"
            ? "연간"
            : "종합"}
        </Button>
      </MenuHandler>
      <MenuList>
        <MenuItem onClick={() => onSortChange("weekly")}>주간</MenuItem>
        <MenuItem onClick={() => onSortChange("monthly")}>월간</MenuItem>
        <MenuItem onClick={() => onSortChange("yearly")}>연간</MenuItem>
        <MenuItem onClick={() => onSortChange("total")}>종합</MenuItem>
      </MenuList>
    </Menu>
  );
};
export default RankingDropdown;
