import { Dialog } from "@headlessui/react";

const Alert = ({ open, setOpen, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="max-w-xl relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="bg-white mt-4 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-left sm:mt-0 sm:ml-4">
                  <hr className="mt-2" />
                  <div className="mt-4 mx-3">
                    <p className="text-lg text-gray-500">
                      정말 예약을 취소하시겠습니까?
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onConfirm}
              >
                확인
              </button>
              <button
                type="button"
                className="mr-3 inline-flex rounded-md border border-transparent shadow-sm px-3 py-1 bg-second-400 text-base font-medium text-white hover:bg-second-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-second-600 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setOpen(false)}
              >
                취소
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default Alert;
