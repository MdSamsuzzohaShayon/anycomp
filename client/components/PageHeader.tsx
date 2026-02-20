'use client'

import { type FC } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}


// font-family: Red Hat Display;
// font-weight: 700;
// font-style: Bold;
// font-size: 15px;
// leading-trim: NONE;
// line-height: 100%;
// letter-spacing: 0%;


// font-family: Proxima Nova;
// font-weight: 500;
// font-style: Medium;
// font-size: 7px;
// leading-trim: NONE;
// line-height: 100%;
// letter-spacing: 0%;



const PageHeader: FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-4">
      <h1 className="font-[Red_Hat_Display] font-semibold text-4xl leading-none tracking-normal">{title}</h1>
      <p className="font-[Proxima_Nova] font-medium text-sm leading-none tracking-normal text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
};

export default PageHeader;