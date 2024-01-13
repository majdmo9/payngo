import React from "react";

const Badge = ({ count }: { count: number }) => {
  if (!count) {
    return <></>;
  }
  return (
    <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
      {count}
    </div>
  );
};

export default Badge;
