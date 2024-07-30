import React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const ClassDate = ({
  cookingClassStartTime,
  handleDateChange,
  cookingClassEndTime,
  setCookingClassEndTime,
}) => {
  return (
    <div>
      <DateTimePicker
        label="수업 시작 시간"
        value={dayjs(cookingClassStartTime)}
        onChange={(newValue) =>
          handleDateChange(newValue, "cookingClassStartTime")
        }
        minDate={new Date()}
      />
    </div>
  );
};
export default ClassDate;
