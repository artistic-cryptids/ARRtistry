import React from 'react';

export const FlexSeparator: React.FC<{className?: string}> = ({ className, children }) => {
  const flexClasses = 'd-flex flex-row align-items-center justify-content-between';
  return <div className={className ? `${flexClasses} ${className}` : flexClasses}>
    {children}
  </div>;
};
