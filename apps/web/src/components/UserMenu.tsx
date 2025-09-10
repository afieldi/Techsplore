import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

interface UserMenuProps {
  onViewSavedItems: () => void
}

export function UserMenu({ onViewSavedItems }: UserMenuProps) {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  return (
    <div className="user-menu">
      <button 
        className="user-menu-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.name || user.email}
      </button>
      
      {isOpen && (
        <div className="user-menu-dropdown">
          <button className="user-menu-item">
            My Profile
          </button>
          <button 
            className="user-menu-item"
            onClick={() => {
              onViewSavedItems()
              setIsOpen(false)
            }}
          >
            Saved Items
          </button>
          <button 
            className="user-menu-item danger"
            onClick={() => {
              logout()
              setIsOpen(false)
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
