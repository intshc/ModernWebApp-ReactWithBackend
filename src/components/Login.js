import React, {useState} from "react";
import {SERVER_URL} from "../constants";
import {Button, Stack, TextField} from "@mui/material";
import Carlist from "./Carlist";

function Login() {

  const [user, setUser] = useState({
    username: '',
    password: ''
  })

  const [isAuthenticated, setAuth] = useState(false);

  const handleChange = (event) => {
    setUser({...user, [event.target.name]: event.target.value});
  }

  const login = () => {
    fetch(SERVER_URL + 'login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    })
            .then(res => {
              const jwtToken = res.headers.get('Authorization');
              if (jwtToken !== null) {
                sessionStorage.setItem("jwt", jwtToken);
                setAuth(true);
              }
            })
            .catch(err => console.error(err))
  }

  if (isAuthenticated) {
    return <Carlist/>
  } else {
    return (
            <div>
              <Stack spacing={2} alignItems='center' mt={2}>
                <TextField
                        name={"username"}
                        label={"Username"}
                        onChange={handleChange}/>
                <TextField
                        type={"password"}
                        name={"password"}
                        label={"password"}
                        onChange={handleChange}/>
                <Button
                        variant={"outlined"}
                        label={"primary"}
                        onClick={login}>
                  Login
                </Button>
              </Stack>
            </div>
    );
  }
}

export default Login;