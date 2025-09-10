import { useAuth } from '../contexts/AuthContext'
import { UserMenu } from './UserMenu'

interface AppHeaderProps {
  getPageTitle: () => string
  onSignInClick: () => void
  onViewSavedItems: () => void
}

export function AppHeader({ getPageTitle, onSignInClick, onViewSavedItems }: AppHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="app-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h1>Techsplore</h1>
          <p className="app-tagline">{getPageTitle()}</p>
        </div>
        <div style={{ position: 'absolute', right: '2rem', top: '2rem' }}>
          {user ? <UserMenu onViewSavedItems={onViewSavedItems} /> : (
            <button className="auth-button" onClick={onSignInClick}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
