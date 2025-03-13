export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-900">
      <div className="animate-pulse">
        <div className="h-16 w-64 bg-gray-700 rounded-lg mb-4"></div>
        <div className="h-4 w-48 bg-gray-700 rounded-lg mb-2"></div>
        <div className="h-3 w-32 bg-gray-700 rounded-lg mb-8"></div>

        <div className="h-96 w-full max-w-md bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>

        <div className="h-4 w-40 bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
}
