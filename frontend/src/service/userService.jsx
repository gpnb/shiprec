import axios from "axios";
import { jwtDecode } from "jwt-decode";
const SERVER_URL =  "https://localhost:8080"

class UserService {
    decodeToken(token) {
        const decoded = jwtDecode(token);
        console.log(decoded);
        return decoded;

    }
}

export default new UserService();