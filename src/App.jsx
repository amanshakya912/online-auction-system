import { BrowserRouter, Route, Routes } from "react-router-dom"
import Homepage from "./Pages/Homepage"
import { Suspense } from "react"
import Loader from "./Components/Loader"
import CreateAuction from "./Pages/CreateAuction"

const App = () => {
  return (
    <>
        <BrowserRouter basename="">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Homepage />}/>
              <Route path="/create-auction" element={<CreateAuction/>}/>
            </Routes>
          </Suspense>
        </BrowserRouter>
    </>
  )
}

export default App