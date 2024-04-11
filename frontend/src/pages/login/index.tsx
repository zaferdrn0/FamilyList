import { useAuth } from "@/context/AuthContext";
import { Button, Grid, TextField } from "@mui/material";
import { FormEvent, useState } from "react";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Prevent the default form submit action
    try {
      await login(username, password);
      // Handle successful login, e.g., redirecting the user or displaying a success message
    } catch (error) {
      // Optionally handle login failure, e.g., displaying an error message
      console.error("Login failed:", error);
    }
  };

  return (
    <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
      {/* Wrapping the inputs and button in a form */}
      <form onSubmit={handleLogin}>
        <Grid item>
          <TextField
            type="text"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth // Makes the TextField take the full width of its parent
          />
        </Grid>
        <Grid item>
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth // Makes the TextField take the full width of its parent
          />
        </Grid>
        <Grid item>
          {/* The type="submit" makes this button submit the form */}
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </Grid>
      </form>
    </Grid>
  );
};

export default Login;
