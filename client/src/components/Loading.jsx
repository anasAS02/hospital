
const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-60 backdrop-blur-md z-50">
      <div className="flex flex-col items-center text-white text-2xl font-semibold">
        <div className="flex gap-2">
          <div className="dot-animation bg-gradient-to-r from-blue-500 to-green-500 rounded-full w-4 h-4"></div>
          <div className="dot-animation bg-gradient-to-r from-blue-500 to-green-500 rounded-full w-4 h-4 animation-delay-200"></div>
          <div className="dot-animation bg-gradient-to-r from-blue-500 to-green-500 rounded-full w-4 h-4 animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
