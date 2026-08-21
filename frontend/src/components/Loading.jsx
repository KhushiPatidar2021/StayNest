import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-700">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="font-medium text-sm text-gray-600">{message}</p>
      </div>
    );
  }

  return (
    <div className="py-12 flex flex-col items-center justify-center text-gray-600">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Loading;
