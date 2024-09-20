import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { RouteProtection } from "./routeProtection/RouteProtection";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { Register } from "./components/Register";

function App() {
  const { user } = useAuth();
  return (
    <div className=" min-h-screen flex justify-center items-center bg-purple-900">
      {user && (
        <div className=" fixed top-0">
          {" "}
          <Navbar username={user} />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/signup" element={<Register />} />
        <Route element={<RouteProtection />}>
          <Route path="/puzzle" element={<Home />} />
        </Route>
        <Route path="*" element={<Auth />} />
      </Routes>
      {/* <Home /> */}
      {/* <Auth />/ */}
    </div>
  );
}

export default App;
