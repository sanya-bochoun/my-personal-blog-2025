import "./App.css"
import "./index.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'
import HeroSection from './components/HeroSection'
import ArticleSection from './components/ArticleSection'
import Footer from './components/Footer'
import ArticlePage from './pages/ArticlePage'

function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <ArticleSection />
            </>
          } />
          <Route path="/article/:id" element={<ArticlePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
