import './App.css'
import { trpc } from './lib/trpc'

function App() {
  const { data } = trpc.feed.useQuery({ limit: 5 })

  return (
    <>
      <h1>Techsplore</h1>
      <ul>
        {data?.items?.map((item) => (
          <li key={item.id}>
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
