import { Loader2 } from "lucide-react";

// Loading Overlay Component
function Loader({ message }: { message?: string }) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-600">{message || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  export default Loader;