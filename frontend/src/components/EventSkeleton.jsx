export default function EventSkeleton() {
  return (
    <div className="border p-4 rounded-xl animate-pulse bg-white">
      {/* Shimmering Image */}
      <div className="w-full h-40 bg-gray-200 rounded"></div>

      {/* Shimmering Title */}
      <div className="mt-4 h-6 bg-gray-300 rounded w-3/4"></div>

      {/* Shimmering City */}
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>

      {/* Shimmering Button */}
      <div className="mt-4 h-10 bg-blue-200 rounded w-24"></div>
    </div>
  );
}