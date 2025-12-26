import { NavLink } from 'react-router-dom';
import { ComponentType } from 'react';

interface NavItemProps {
  to: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  ActiveIcon: ComponentType<{ className?: string }>;
  onNavigate?: () => void;
}

const NavItem = ({ to, label, Icon, ActiveIcon, onNavigate }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus-ring ${
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Left border indicator for active state */}
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-full transition-all ${
              isActive ? 'bg-blue-600' : 'opacity-0'
            }`}
            aria-hidden="true"
          />
          {isActive ? (
            <ActiveIcon className="w-5 h-5 text-blue-600" />
          ) : (
            <Icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          )}
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default NavItem;
