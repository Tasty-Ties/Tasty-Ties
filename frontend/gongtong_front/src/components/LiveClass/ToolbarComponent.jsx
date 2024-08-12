import { useNavigate } from "react-router-dom";
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
      <div>
        <Button onClick={displayMode}>디스플레이</Button>
        <Button onClick={captureOpen}>기념사진</Button>
        <Button onClick={peopleListOpen}>참가자</Button>
        <Button onClick={chatOpen}>대화</Button>

        {isHost ? (
          <Button onClick={exitOpen}>나가기</Button>
        ) : (
          <Menu placement="top">
            <MenuHandler>
              <Button>나가기</Button>
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
