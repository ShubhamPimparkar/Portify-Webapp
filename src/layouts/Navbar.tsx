import { useState, useEffect, useRef } from 'react';
import {
  Bars3Icon,
  LinkIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getDashboardOverview } from '../api/dashboard.api';
import { HealthCheck } from '../types/dashboard.types';
import logo from '../assets/logo.png';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ onToggleSidebar, isSidebarOpen }: NavbarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Fetch health checks for action suggestions
  useEffect(() => {
    const fetchHealthChecks = async () => {
      try {
        const data = await getDashboardOverview();
        setHealthChecks(data.portfolioHealth.checks);
      } catch (error) {
        console.error('Failed to fetch health checks:', error);
      }
    };
    fetchHealthChecks();
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  const incompleteChecks = healthChecks.filter((check) => !check.done);

  const getActionRoute = (label: string): string | null => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('profile')) return '/profile';
    if (lowerLabel.includes('education')) return '/profile';
    if (lowerLabel.includes('project')) return '/projects/new';
    if (lowerLabel.includes('achievement')) return '/profile';
    return null;
  };

  const getActionText = (label: string): string => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('profile')) return 'Complete Profile';
    if (lowerLabel.includes('education')) return 'Add Education';
    if (lowerLabel.includes('project')) return 'Add Project';
    if (lowerLabel.includes('achievement')) return 'Add Achievement';
    return 'Take Action';
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Toggle navigation menu"
              aria-expanded={isSidebarOpen}
              aria-controls="app-sidebar"
              className="p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus-ring transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <Link to="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
              <img
                src={logo}
                alt="Portify logo"
                className="h-16 w-auto object-contain"
              />
              <span className="text-2xl font-extrabold text-blue-700 tracking-tight -ml-5">Portify</span>
            </Link>
          </div>

          {/* Right: Notifications + Live Portfolio + User */}
          <div className="flex items-center gap-3">
            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus-ring transition-colors"
                aria-label="Notifications"
                aria-expanded={isNotificationOpen}
              >
                <BellIcon className="h-6 w-6" />
                {incompleteChecks.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-yellow-50">
                    <div className="flex items-start gap-3">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">Action Suggestions</h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Complete these items to improve your portfolio
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Suggestions List */}
                  <div className="overflow-y-auto max-h-[400px]">
                    {incompleteChecks.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        <p>All actions completed! Great job! 🎉</p>
                      </div>
                    ) : (
                      <div className="p-3 space-y-2">
                        {incompleteChecks.slice(0, 5).map((check, index) => {
                          const route = getActionRoute(check.label);
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors"
                            >
                              <span className="text-sm text-gray-700 flex-1 pr-2">
                                {check.label}
                              </span>
                              {route && (
                                <button
                                  onClick={() => {
                                    navigate(route);
                                    setIsNotificationOpen(false);
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors whitespace-nowrap"
                                >
                                  {getActionText(check.label)}
                                  <ArrowRightIcon className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {user?.username && (
              <Link
                to={`/u/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors focus-ring"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Live Portfolio</span>
              </Link>
            )}
            <Link to="/profile" className="flex items-center hover:opacity-80 transition-opacity rounded-lg focus-ring">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {(user?.username || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-800">
                {user?.username || user?.email || 'User'}
              </span>
            </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
