
import { Route, Routes } from "react-router-dom"
import Lobby from "./pages/Lobby"
import Calling from "./pages/Calling"


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/:id" element={<Calling />} />
    </Routes>
  )
}
export default App