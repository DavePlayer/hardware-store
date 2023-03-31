import { Routes, Route } from "react-router-dom"
import Aside from "./components/Aside"

function App() {
  return (
  <>
    <Aside />
    <Routes>
      <Route path="/" element={<h1>/</h1>}></Route>
    </Routes>
  </>
  )
}

export default App
