import { registerApi,loginApi} from "../api/auth";
import { validateRegister , validateLogin } from "../validations/authValidation";

// Service function to handle user registration
export async function registerUser(form) {
  // run validation first
  validateRegister(form);

  // API call
  const response = await registerApi({
    name: form.name,
    email: form.email,
    password: form.password,
  });

  return response.data; // { user, token }
}


// Service function to handle user login
export async function loginUser(form) {
  validateLogin(form);

  const response = await loginApi({
    email: form.email,
    password: form.password,
  });

  return response.data;
}