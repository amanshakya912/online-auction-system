import { BrowserRouter, Route, Routes } from "react-router-dom"
import Homepage from "./Pages/Homepage"
import { Suspense } from "react"
import Loader from "./Components/Loader"
import CreateAuction from "./Pages/CreateAuction"
import BrowseAuction from "./Pages/BrowseAuction"
import ProductDetails from "./Pages/ProductDetails"
import Signup from "./Pages/Signup"
import Contact from "./Pages/Contact"
import Cart from "./Pages/Cart"
import UserProfile from "./Pages/UserProfile"
import Checkout from "./Pages/Checkout"


const App = () => {
  return (
    <>
        <BrowserRouter basename="">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Homepage />}/>
              <Route path="/create-auction" element={<CreateAuction/>}/>
              <Route path="/browse-auction/:slug" element={<BrowseAuction/>}/>
              <Route path="/sign-up" element={<Signup/>}/>
              <Route path="/contact" element={<Contact/>}/>
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/checkout" element={<Checkout/>}/>
              <Route path="/user/:username" element={<UserProfile/>}/>
              <Route path="/:slug" element={<ProductDetails/>}/>
            </Routes>
          </Suspense>
        </BrowserRouter>
    </>
  )
}

export default App