import { BrowserRouter, Route, Routes } from "react-router-dom"
import Homepage from "./Pages/Homepage"
import { Suspense } from "react"
import Loader from "./Components/Loader"
import CreateAuction from "./Pages/CreateAuction"
import BrowseAuction from "./Pages/BrowseAuction"
import Signup from "./Pages/signup"
import Contact from "./Pages/Contact"


const App = () => {
  return (
    <>
        <BrowserRouter basename="">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Homepage />}/>
              <Route path="/create-auction" element={<CreateAuction/>}/>
              <Route path="/browse-auction" element={<BrowseAuction/>}/>
              <Route path="/sign-up" element={<Signup/>}/>
              <Route path="/contact" element={<Contact/>}/>
            </Routes>
          </Suspense>
        </BrowserRouter>
    </>
  )
}

export default App