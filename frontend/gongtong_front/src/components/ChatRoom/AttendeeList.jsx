import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const AttendeeList = ({ setOpen, users, nickname }) => {
  const defaultImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF1IwK6-SxM83UpFVY6WtUZxXx-phss_gAUfdKbkTfau6VWVkt";
  console.log(users);
  console.log(nickname);
  return (
    // <Dialog open={open} onClose={setOpen} className="relative z-10">
    //   <DialogBackdrop
    //     transition
    //     className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
    //   />

    //   <div className="fixed inset-0">
    //     <div className="absolute inset-0">
    //       <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
    //         <DialogPanel
    //           transition
    //           className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
    //         >
    //           <TransitionChild>
    //             <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
    //               <button
    //                 type="button"
    //                 onClick={() => setOpen(false)}
    //                 className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
    //               >
    //                 <span className="absolute -inset-2.5" />
    //                 <span className="sr-only">Close panel</span>
    //                 <XMarkIcon aria-hidden="true" className="h-6 w-6" />
    //               </button>
    //             </div>
    //           </TransitionChild>
    //           <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
    //             <div className="px-4 sm:px-6">
    //               <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
    //                 Panel title
    //               </DialogTitle>
    //             </div>
    //             <div className="relative mt-6 flex-1 px-4 sm:px-6">
    //               {/* Your content */}
    //             </div>
    //           </div>
    //         </DialogPanel>
    //       </div>
    //     </div>
    //   </div>
    // </Dialog>
    <>
      <div className="absolute w-full h-full flex flex-row">
        <div
          className="w-2/3 h-full bg-gray-500 bg-opacity-75"
          onClick={() => setOpen(false)}
        ></div>
        <div className="w-1/3 h-full bg-white">
          <div className="bg-yellow-200 text-xl pl-5 py-2 flex flex-row justify-between">
            <p>참가자 ({users?.length})</p>
            <button className="px-2" onClick={() => setOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="self-stretch bg-white py-3 flex flex-col">
            {users.map((user, i) => (
              <div key={i} className="flex flex-row space-y-2 py-1 px-2">
                <img
                  alt=""
                  src={
                    user.profileImageUrl ? user.profileImageUrl : defaultImage
                  }
                  className="h-12 w-12 flex-none rounded-full self-center"
                />
                <div className="px-2 text-lg">
                  {user.nickname} {user.type === "HOST" ? "(호스트)" : ""}{" "}
                  {nickname === user.nickname ? "(나)" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendeeList;
