const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'h-6 w-6', md: 'h-12 w-12', lg: 'h-20 w-20' };
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-amazon rounded-full animate-spin`} />
      {text && <p className="text-gray-500 dark:text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

export default Loader;
