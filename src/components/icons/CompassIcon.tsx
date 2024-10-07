import React from 'react';

interface IconProps {
  fill: string;
}

const CompassIcon: React.FC<IconProps> = ({ fill }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.6 14L6.7 9.3L2 7.4V6.46667L14 2L9.53333 14H8.6ZM9.03333 11.5333L11.7333 4.26667L4.46667 6.96667L7.73333 8.26667L9.03333 11.5333Z"
        fill={fill}
      />
    </svg>
  );
};

export default CompassIcon;
