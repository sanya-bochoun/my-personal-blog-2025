import "./App.css"
import "./index.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ArticleSection from './components/ArticleSection'
import Footer from './components/Footer'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import RegistrationSuccess from './pages/RegistrationSuccess'
import Profile from './pages/Profile'
import ResetPassword from './pages/ResetPassword'
import ResetPasswordByToken from './pages/ResetPasswordByToken'
import ForgotPassword from './pages/ForgotPassword'
import BackToTopButton from './components/BackToTopButton'
import { Toaster } from 'sonner'
import { useAuth } from './context/AuthContext'

// สร้าง Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPasswordByToken />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/reset-password" element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          } />
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
