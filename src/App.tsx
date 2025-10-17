import { Home } from './pages/Home'
import './App.css'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Nutri App</h1>
      </header>
      <main>
        <Home />
      </main>
      <Footer />
    </div>
  )
}

export default App