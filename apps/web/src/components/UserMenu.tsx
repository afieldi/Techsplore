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
    <div className="relative">
      <button 
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-button-secondary-bg text-primary hover:bg-button-secondary-hover transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.name || user.email}
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-10">
          <button className="block w-full text-left px-4 py-2 text-primary hover:bg-dropdown-item-hover">
            My Profile
          </button>
          <button 
            className="block w-full text-left px-4 py-2 text-primary hover:bg-dropdown-item-hover"
            onClick={() => {
              onViewSavedItems()
              setIsOpen(false)
            }}
          >
            Saved Items
          </button>
          <button 
            className="block w-full text-left px-4 py-2 text-error hover:bg-red-100 dark:hover:bg-red-800"
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
