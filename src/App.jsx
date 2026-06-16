import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Suspense, lazy } from "react"
import Loader from "./Components/Loader"
import ProtectedRoute from "./Components/ProtectedRoute"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import toastConfig from './config/toastConfig.jsx'
import { AnimationProvider } from './contexts/AnimationContext'

// Code splitting - lazy load route components
const Homepage = lazy(() => import("./Pages/Homepage"))
const CreateAuction = lazy(() => import("./Pages/CreateAuction"))
const BrowseAuction = lazy(() => import("./Pages/BrowseAuction"))
const ProductDetails = lazy(() => import("./Pages/ProductDetails"))
const Signup = lazy(() => import("./Pages/Signup"))
const Contact = lazy(() => import("./Pages/Contact"))
const Cart = lazy(() => import("./Pages/Cart"))
const UserProfile = lazy(() => import("./Pages/UserProfile"))
const Checkout = lazy(() => import("./Pages/Checkout"))
const VerifyEmail = lazy(() => import("./Pages/VerifyEmail"))
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard"))
const AdminUsers = lazy(() => import("./Pages/AdminUsers"))
const AdminAuctions = lazy(() => import("./Pages/AdminAuctions"))


const App = () => {
  return (
    <AnimationProvider>
      <BrowserRouter basename="">
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />}/>
            <Route path="/browse-auction/:slug" element={<BrowseAuction/>}/>
            <Route path="/sign-up" element={<Signup/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/verify-email" element={<VerifyEmail/>}/>
            <Route path="/:slug" element={<ProductDetails/>}/>
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/create-auction" element={<CreateAuction/>}/>
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/checkout" element={<Checkout/>}/>
              <Route path="/user/:username" element={<UserProfile/>}/>
              <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
              <Route path="/admin/users" element={<AdminUsers/>}/>
              <Route path="/admin/auctions" element={<AdminAuctions/>}/>
            </Route>
            <Route path="*" element={
              <div className="bg-black min-h-screen flex items-center justify-center">
                <div className="text-center text-white font-lora px-6">
                  <h1 className="text-6xl font-bold mb-4">404</h1>
                  <p className="text-lg text-text-secondary mb-8">Page not found</p>
                  <a href="/" className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-150">Go Home</a>
                </div>
              </div>
            }/>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer {...toastConfig} />
    </AnimationProvider>
  )
}

export default App