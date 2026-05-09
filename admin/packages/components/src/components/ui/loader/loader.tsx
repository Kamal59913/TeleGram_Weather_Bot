import SquareLoader from "react-spinners/SquareLoader";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black bg-opacity-50 z-[100000]">
      <SquareLoader color="#3F87D9" />
    </div>
  );
};

export default Loader;