import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Editorpage from './pages/EditorPage'
import { Toaster } from "react-hot-toast"


function App() {
  return <div className="h-full w-full bg-[#lcle29]">
    <div>
      <Toaster position="top-right"></Toaster>
    </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/editor/:roomId" element={<Editorpage/>}/>
      </Routes>

    </BrowserRouter>
  </div>
}

export default App
