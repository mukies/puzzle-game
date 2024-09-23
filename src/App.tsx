import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { RouteProtection } from "./routeProtection/RouteProtection";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";

function App() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar username={user} />}
      <div
        className={` ${
          user ? "min-h-[calc(100vh-80px)]" : "min-h-screen"
        }  flex justify-center items-center bg-purple-900 p-4 sm:p-0`}
      >
        <Routes>
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RouteProtection />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
