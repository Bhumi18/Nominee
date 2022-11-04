import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import PageNotFound from "./components/PageNotFound";
import AddNominee from "./pages/AddNominee";
import EditNominee from "./pages/EditNominee";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit-nominee" element={<EditNominee />} />
          <Route path="/add-nominee" element={<AddNominee />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
