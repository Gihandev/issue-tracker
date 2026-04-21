// validations for register 

export function validateRegister(form) {
  if (!form.name || !form.email || !form.password) {
    throw new Error("All fields are required");
  }

  if (form.password !== form.confirm) {
    throw new Error("Passwords do not match");
  }

  if (form.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (!/\d/.test(form.password)) {
    throw new Error("Password must include a number");
  }
}



// login validation
export function validateLogin(form) {
  if (!form.email || !form.password) {
    throw new Error("Please fill in all fields");
  }

  // optional: basic email format check
  if (!/\S+@\S+\.\S+/.test(form.email)) {
    throw new Error("Invalid email format");
  }
}