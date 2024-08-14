import { useNavigate } from "react-router-dom";
import {
  CameraAlt,
  People,
  Chat,
  ExitToApp,
  Tv as DisplayIcon,
} from "@mui/icons-material";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

const ToolbarComponent = ({
  isHost,
  setIsForcedExit,
  displayMode,
  captureOpen,
  peopleListOpen,
  chatOpen,
  exitOpen,
}) => {
  const nav = useNavigate();
  console.log(isHost);
  return (
    <>
      <div className="flex justify-center space-x-4 items-start">
        <Button
          onClick={displayMode}
          className="p-0 m-3 mx-3 bg-transparent hover:bg-transparent flex justify-center items-start"
        >
          <DisplayIcon className="text-first-800" />
        </Button>
        <Button
          onClick={captureOpen}
          className="p-0 m-3 mx-3 bg-transparent hover:bg-transparent flex justify-center items-start"
        >
          <CameraAlt className="text-first-800" />
        </Button>
        <Button
          onClick={peopleListOpen}
          className="p-0 m-3 mx-3 bg-transparent hover:bg-transparent flex justify-center items-start"
        >
          <People className="text-first-800" />
        </Button>
        <Button
          onClick={chatOpen}
          className="p-0 m-3 mx-3 bg-transparent hover:bg-transparent flex justify-center items-start"
        >
          <Chat className="text-first-800" />
        </Button>

        {isHost ? (
          <Button
            onClick={exitOpen}
            className="p-0 m-3 mx-3 bg-transparent hover:bg-transparent flex justify-center items-start"
          >
            <ExitToApp className="text-first-800" />
          </Button>
        ) : (
          <Menu placement="top">
            <MenuHandler>
              <Button className="p-0 m-3 mx-3 bg-transparent hover:bg-transparent flex justify-center items-start">
                <ExitToApp className="text-first-800" />
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem
                onClick={() => {
                  nav("/mypage/attend");
                }}
              >
                잠시 나가기
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIsForcedExit(false);
                  exitOpen();
                }}
              >
                클래스 퇴장하기
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </div>
    </>
  );
};

export default ToolbarComponent;
