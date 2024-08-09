import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const ClassListDropdown = ({ title, items, setClassification, setSort }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 px-3 py-2 text-base font-semibold text-gray-900 items-center">
          {title}
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute left-1 z-10 mt-6 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          {items &&
            items.map((item, index) => (
              <MenuItem key={index}>
                <a
                  className="block px-4 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 cursor-pointer"
                  value={item}
                  onClick={() => {
                    {
                      if (title === "분류") {
                        if (item === "클래스명") {
                          setClassification({ title: "title" });
                        } else if (item === "닉네임") {
                          setClassification({ title: "username" });
                        }
                      } else if (title === "정렬") {
                        if (item === "최신순") {
                          setSort({ sort: "createtime,desc" });
                        } else if (item === "오래된순") {
                          setSort({ sort: "createtime,asc" });
                        }
                      }
                    }
                  }}
                >
                  {item}
                </a>
              </MenuItem>
            ))}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default ClassListDropdown;
