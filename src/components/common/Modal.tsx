import React from "react";

const Modal = ({
  open,
  title,
  message,
  onClose,
  isError = false,
}: {
  open: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;
  isError?: boolean;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-[90vw]">
        <h3 className={`text-lg font-bold mb-2 ${isError ? "text-red-600" : "text-blue-600"}`}>
          {title || (isError ? "Error" : "Transaction")}
        </h3>
        <div className="mb-4">{message}</div>
        {onClose && (
          <button
            className={`px-4 py-2 rounded ${isError ? "bg-red-500" : "bg-blue-500"} text-white`}
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
