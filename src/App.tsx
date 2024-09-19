import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { RouteProtection } from "./routeProtection/RouteProtection";

function App() {
  return (
    <div className=" min-h-screen flex justify-center items-center bg-purple-900">
      <Routes>
        <Route path="/" element={<Auth />} />
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
