import "./App.css"
import "./index.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'
import HeroSection from './components/HeroSection'
import ArticleSection from './components/ArticleSection'
import Footer from './components/Footer'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'
import BackToTopButton from './components/BackToTopButton'

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
          <Route path="/article/:id" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <BackToTopButton />
      </div>
    </Router>
  )
}

export default App
