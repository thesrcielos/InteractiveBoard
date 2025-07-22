import axios from "axios";
import Cookies from 'js-cookie';

const url = import.meta.env.VITE_BACKEND_URL;


export const loginWithGoogle = async (code) => {
  try {
    const response = await axios.post(`${url}/api/auth/token`, {
      code: code
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(`${url}/api/auth/login`, {
      email: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const signup = async ({ name, email, password }) => {
  try {
    const response = await axios.post(`${url}/api/auth/register`, {
      name: name,
      email: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getWSToken = async (id) => {
  const token = Cookies.get("token");
  try{
    const response = await axios.post(`${url}/ws-auth/token?id=${id}`,{},{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    } );
    return response.data;
  }catch (error) {
    console.error('Error:', error);
    throw error;
  }
}