'use client'

import { Home } from "lucide-react";
import Link from "next/link";
import { type FC } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="flex items-center gap-1 pt-4 sm:pt-5 pb-1 overflow-x-auto whitespace-nowrap">
      <Home size={13} className="flex-shrink-0" />
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <span className="text-[12px] mx-2">/</span>
          {item.href ? (
            <Link
              href={item.href}
              className="text-[12px] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[12px] font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;