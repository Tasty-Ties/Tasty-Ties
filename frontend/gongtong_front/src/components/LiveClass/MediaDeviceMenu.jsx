import { MenuItem, MenuItems } from "@headlessui/react";

const MediaDeviceMenu = ({ items, setting }) => {
  return (
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
                onClick={setting}
              >
                {item}
              </a>
            </MenuItem>
          ))}
      </div>
    </MenuItems>
  );
};

export default MediaDeviceMenu;
