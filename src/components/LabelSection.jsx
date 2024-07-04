import LabelCard from "./LabelCard";

const LabelSection = ({ handleStartDraw, labelList }) => {
  return (
    <div className="w-1/5 p-5 flex flex-col">
      <button
        className="w-full px-4 py-2 text-white transition duration-500 bg-indigo-500 border border-indigo-500 rounded-md select-none ease hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
        onClick={handleStartDraw}
      >
        폴리곤 생성하기
      </button>
      <div className="flex flex-col mt-2 gap-2">
        {labelList.map((label) => (
          <LabelCard key={label.id} label={label} />
        ))}
      </div>
    </div>
  );
};

export default LabelSection;
