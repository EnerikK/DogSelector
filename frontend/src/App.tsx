import { BrowserRouter, Routes, Route } from "react-router-dom";
import DogsPage from "./pages/DogsPage"
import ContactPage from "./pages/ContactPage"
import Navbar from "./components/Navbar";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/dogSelector" element={<DogsPage />} />
        <Route path="/contact" element= {<ContactPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;