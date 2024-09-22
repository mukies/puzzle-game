import { hashPassword } from "../helper/hashPassword";

class AuthService {
  register(username: string, password: string) {
    const isExist = localStorage.getItem(username);
    if (isExist) {
      return false;
    }
    const payload = {
      username,
      password: hashPassword(password),
    };
    localStorage.setItem(username, JSON.stringify(payload));
    return true;
  }
  login = (username: string, password: string) => {
    const isRegistered = localStorage.getItem(username);
    if (!isRegistered) return false;

    try {
      const userData = JSON.parse(isRegistered);
      if (userData.password !== hashPassword(password)) return false;

      const payload = {
        username,
        password: hashPassword(password),
      };
      sessionStorage.setItem("user", JSON.stringify(payload));
      return true;
    } catch (error) {
      console.error("Error parsing user data during login:", error);
      return false;
    }
  };
}

export const authSvc = new AuthService();
