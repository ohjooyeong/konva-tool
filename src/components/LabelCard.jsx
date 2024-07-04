const LabelCard = ({ label }) => {
  return (
    <div className="flex items-center justify-center h-8 bg-red-300 rounded-md">
      {label.id.slice(0, 5)}
    </div>
  );
};

export default LabelCard;
