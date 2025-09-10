import { useState } from 'react'

interface FeedNavigationProps {
  currentView: 'discover' | 'personalized' | 'saved'
  setCurrentView: (view: 'discover' | 'personalized' | 'saved') => void
}

export function FeedNavigation({ currentView, setCurrentView }: FeedNavigationProps) {
  return (
    <div className="feed-nav">
      <div className="feed-nav-container">
        <button 
          className={`feed-nav-tab ${currentView === 'discover' ? 'active' : ''}`}
          onClick={() => setCurrentView('discover')}
        >
          For You
        </button>
        <button 
          className={`feed-nav-tab ${currentView === 'saved' ? 'active' : ''}`}
          onClick={() => setCurrentView('saved')}
        >
          Saved Items
        </button>
      </div>
    </div>
  )
}
