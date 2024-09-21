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
    <>
      {user && <Navbar username={user} />}
      <div className=" min-h-[calc(100vh-80px)] flex justify-center items-center bg-purple-900">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/signup" element={<Register />} />
          <Route element={<RouteProtection />}>
            <Route path="/puzzle" element={<Home />} />
          </Route>
          <Route path="*" element={<Auth />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
