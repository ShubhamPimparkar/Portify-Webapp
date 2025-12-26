import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  FolderIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  FolderIcon as FolderIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
} from '@heroicons/react/24/solid';
import NavItem from '../components/NavItem';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar = ({ isOpen, onClose, onLogout }: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const navItems = useMemo(
    () => [
      {
        to: '/dashboard',
        label: 'Dashboard',
        icon: HomeIcon,
        activeIcon: HomeIconSolid,
      },
      {
        to: '/profile',
        label: 'Profile',
        icon: UserIcon,
        activeIcon: UserIconSolid,
      },
      {
        to: '/projects',
        label: 'Projects',
        icon: FolderIcon,
        activeIcon: FolderIconSolid,
      },
      {
        to: '/resume',
        label: 'Resume',
        icon: DocumentTextIcon,
        activeIcon: DocumentTextIconSolid,
      },
      {
        to: '/portfolio/settings',
        label: 'Portfolio Settings',
        icon: Cog6ToothIcon,
        activeIcon: Cog6ToothIconSolid,
      },
      {
        to: '/portfolio/templates',
        label: 'Templates',
        icon: Squares2X2Icon,
        activeIcon: Squares2X2IconSolid,
      },
    ],
    []
  );

  // Close sidebar on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Focus trap and Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const focusableSelectors =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(
      sidebar.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    // Focus first element when opening
    const firstFocusable = focusables[0];
    if (firstFocusable) {
      firstFocusable.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="app-sidebar"
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className="fixed inset-y-0 left-0 z-50 w-[260px] max-w-[85vw] bg-white border-r border-gray-200 shadow-2xl flex flex-col transform transition-transform duration-200 ease-out translate-x-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
              <Squares2X2Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Menu</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus-ring transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              Icon={item.icon}
              ActiveIcon={item.activeIcon}
              onNavigate={onClose}
            />
          ))}
        </nav>

        {/* Footer with Logout */}
        <div className="border-t border-gray-200 px-3 py-3">
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 focus-ring transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
