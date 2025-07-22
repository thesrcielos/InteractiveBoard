import { useEffect } from "react"
import { useUser, setToken } from "../services/userUtils";
import { loginWithGoogle} from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () =>{
    const {checkAuth } = useUser();
    const navigate = useNavigate();
    useEffect( () => {
        const authenticate = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            
            if (code) {
              console.log(code)
              const data = await loginWithGoogle(code); // Asegúrate de que el token se guarde antes de continuar
              const token =  data.token;
              setToken(token);
              if (checkAuth()) {
                navigate("/home");
              }
            }
          };
      
          authenticate();
    },[])
    return (
        <h1>
            Login... Please Wait...
        </h1>
    )
}

export default GoogleCallback;