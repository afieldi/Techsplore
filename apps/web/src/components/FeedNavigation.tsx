import { useState } from 'react'

interface FeedNavigationProps {
  currentView: 'discover' | 'personalized' | 'saved'
  setCurrentView: (view: 'discover' | 'personalized' | 'saved') => void
}

export function FeedNavigation({ currentView, setCurrentView }: FeedNavigationProps) {
  return (
    <div className="bg-card shadow-sm py-3 px-4 mb-8">
      <div className="flex justify-center space-x-4 max-w-4xl mx-auto">
        <button 
          className={`px-6 py-2 rounded-full text-lg font-medium transition-colors ${currentView === 'discover' ? 'bg-primary text-primary' : 'text-primary hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          onClick={() => setCurrentView('discover')}
        >
          For You
        </button>
        <button 
          className={`px-6 py-2 rounded-full text-lg font-medium transition-colors ${currentView === 'saved' ? 'bg-primary text-primary' : 'text-primary hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          onClick={() => setCurrentView('saved')}
        >
          Saved Items
        </button>
      </div>
    </div>
  )
}
