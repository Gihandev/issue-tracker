import api from "./axios";


//Register a new user
//param {{ name: string, email: string, password: string }} data

export const registerApi = (data) => api.post("/auth/register", data);


 //Login an existing user
 //param {{ email: string, password: string }} data
 
export const loginApi = (data) => api.post("/auth/login", data);


 //Update current user's profile (name, email)
 //param {{ name?: string, email?: string }} data

export const updateProfileApi = (data) => api.put("/auth/me", data);