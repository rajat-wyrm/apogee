import React from "react";

const Card = ({ children, className = "", padding = true, hover = false }) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-2xl shadow-lg
        border border-gray-200 dark:border-gray-700
        ${padding ? "p-6" : ""}
        ${hover ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export default Card;
