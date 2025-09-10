import { useAuth } from '../contexts/AuthContext'
import { UserMenu } from './UserMenu'
import { ThemeToggle } from './ThemeToggle'

interface AppHeaderProps {
  getPageTitle: () => string
  onSignInClick: () => void
  onViewSavedItems: () => void
}

export function AppHeader({ getPageTitle, onSignInClick, onViewSavedItems }: AppHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-center">
      <div className="flex justify-between items-center w-full max-w-4xl">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Techsplore</h1>
          <p className="text-gray-600 dark:text-gray-400">{getPageTitle()}</p>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          {user ? <UserMenu onViewSavedItems={onViewSavedItems} /> : (
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={onSignInClick}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
