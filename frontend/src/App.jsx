import "./App.css"
import "./index.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ArticleSection from './components/ArticleSection'
import Footer from './components/Footer'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import RegistrationSuccess from './pages/RegistrationSuccess'
import BackToTopButton from './components/BackToTopButton'
import { Toaster } from 'sonner'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <ArticleSection />
            </>
          } />
          <Route path="/article/:id" element={<BlogPost />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <BackToTopButton />
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App
