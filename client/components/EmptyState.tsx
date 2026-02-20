'use client'

import { User } from "lucide-react";
import { type FC } from "react";

const EmptyState: FC = () => {
  return (
    <div className="py-16 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
        <User size={48} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No specialists found</h3>
      <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
    </div>
  );
};

export default EmptyState;