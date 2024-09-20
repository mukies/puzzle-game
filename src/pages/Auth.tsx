import { useEffect } from "react";
import { Login } from "../components/Login";
import { useNavigate } from "react-router-dom";
// import { Register } from "../components/Register";

function Auth() {
  const navigate = useNavigate();
  useEffect(() => {
    const isLogin = sessionStorage.getItem("user");
    if (isLogin) {
      navigate("/puzzle");
    }
  }, []);
  return (
    <div>
      {/* <Register /> */}
      <Login />
    </div>
  );
}

export default Auth;
