export default function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex justify-center items-center py-8">
      <div
        className={`${sizes[size]} rounded-full border-4 border-gray-200 border-t-primary animate-spin`}
      />
    </div>
  );
}
