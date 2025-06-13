const HeroBanner = ({ Icon, contentText }) => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gray-700/5 border border-black/5 text-gray-900 text-sm mb-6">
        {Icon && <Icon className="w-4 h-4 text-gray-800" />}
        {contentText}
      </div>
    </div>
  );
};

export default HeroBanner;
