import { useEffect } from "react";

interface ToastProps {
  title: string;
  message?: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function ToastNew({ title, message, type,onClose }:ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); 
    }, 2000);

    return () => clearTimeout(timer); 
  }, [onClose]);
  return (
    <div
      className={`fixed top-4 right-4 w-80 px-4 py-3 text-white rounded-md shadow-md bg-[#2B264E] ${
        type === 'success'
          ? 'bg-gradient-to-r from-[#1C4656] to-[#0BE276]'
          : 'bg-gradient-to-r from-[#542752] to-[#FB0450]'
      }`}
    >
      <div className="flex items-center">
        <div className="mr-3">
          {type === 'success' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#0BE276]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#FB0450]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className={`font-bold ${type === 'error' ? 'text-[#FB0450]' : 'text-[#0BE276]'}`}>{title}</p>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

