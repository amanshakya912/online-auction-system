import { BrowserRouter, Route, Routes } from "react-router-dom"
import Homepage from "./Pages/Homepage"
import { Suspense } from "react"
import Loader from "./Components/Loader"

const App = () => {
  return (
    <>
      <div className="container mx-auto relative">
        <BrowserRouter basename="">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Homepage />}/>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App