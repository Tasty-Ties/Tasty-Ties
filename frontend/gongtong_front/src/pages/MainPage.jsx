import { useState } from "react";
import Alert from "../common/components/Alert";

const MainPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div>Helloworld</div>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Dialog
      </button>
      <Alert open={open} setOpen={setOpen} />
    </>
  );
};

export default MainPage;
