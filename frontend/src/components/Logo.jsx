export const Logo = ({ width = 40, height = 40 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    width={width}
    height={height}
    className="cursor-pointer"
  >
    {/* Center pad - larger and more prominent */}
    <ellipse cx="100" cy="140" rx="35" ry="45" fill="#10b981" />
    
    {/* Top left pad */}
    <ellipse cx="55" cy="50" rx="22" ry="35" fill="#10b981" transform="rotate(-25 55 50)" />
    
    {/* Top right pad */}
    <ellipse cx="145" cy="50" rx="22" ry="35" fill="#10b981" transform="rotate(25 145 50)" />
    
    {/* Bottom left pad */}
    <ellipse cx="30" cy="95" rx="20" ry="32" fill="#10b981" transform="rotate(-40 30 95)" />
    
    {/* Bottom right pad */}
    <ellipse cx="170" cy="95" rx="20" ry="32" fill="#10b981" transform="rotate(40 170 95)" />
    
    {/* Shine/highlight on center pad */}
    <ellipse cx="100" cy="120" rx="12" ry="18" fill="white" opacity="0.25" />
    
    {/* Shine on top left */}
    <ellipse cx="55" cy="35" rx="8" ry="12" fill="white" opacity="0.25" />
    
    {/* Shine on top right */}
    <ellipse cx="145" cy="35" rx="8" ry="12" fill="white" opacity="0.25" />
  </svg>
);



