import AppRoutes from "./Routes";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Header from "./components/Header";
import Button from "./common/components/Button";

function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Header />
        <Button text="하이" type={"gray-sqr"} />
        <AppRoutes />
      </LocalizationProvider>
    </>
  );
}

export default App;
