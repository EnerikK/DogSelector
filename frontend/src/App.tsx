import { BrowserRouter, Routes, Route } from "react-router-dom";
import DogsPage from "./pages/DogsPage"
import ContactPage from "./pages/ContactPage"
import Navbar from "./components/Navbar";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/dogSelector" element={<DogsPage />} />
          <Route path="/contact" element= {<ContactPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;