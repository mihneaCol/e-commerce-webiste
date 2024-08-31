import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <AiOutlineLoading3Quarters className="animate-spin text-6xl text-black-600" />
    </div>
  );
};