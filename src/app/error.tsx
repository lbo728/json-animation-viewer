"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-900">
      <h1 className="text-3xl font-bold text-white mb-4">An Error Occurred</h1>
      <p className="text-gray-300 mb-6 text-center max-w-md">
        We apologize, but an error occurred while loading the animation. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
