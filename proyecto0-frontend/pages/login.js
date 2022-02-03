import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Snackbar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  "full-height": {
    height: "100%",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  "form-items": {
    width: "100%",
  },
  form: {
    borderRadius: "20px",
    backgroundColor: "rgba(0,84,131,0.04)",
    width: 360,
  },
  container: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  "toggle-align": {
    width: "100%",
  },
  "center-text": {
    textAlign: "center",
  },
});

function Login() {
  const classes = useStyles();
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [page, setPage] = useState("login");
  const [toast, setToast] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const { open, message, severity } = toast;
  const handleInputChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const handleClose = () => {
    setToast({ ...toast, open: false });
  };
  const handleChange = (e, newPage) => {
    setPage(newPage);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (values.email && values.password) {
      if (page === "login") {
        try {
          const res = await axios.post("http://localhost:5000/api/login", {
            email: values.email,
            password: values.password,
          });
          setToast({
            open: true,
            severity: "success",
            message: "Has iniciado sesión correctamente!",
          });
          localStorage.setItem("user", JSON.stringify(res.data));
          router.replace("/");
        } catch (e) {
          setToast({
            open: true,
            severity: "error",
            message: "Correo o contraseña incorrecta",
          });
        }
      } else {
        try {
          const res = await axios.post("http://localhost:5000/api/user", {
            email: values.email,
            password: values.password,
          });
          setToast({
            open: true,
            severity: "success",
            message: "Te has registrado correctamente!",
          });
          setPage("login");
        } catch (e) {
          setToast({
            open: true,
            severity: "error",
            message: "Correo ya esta registrado",
          });
        }
      }
    }
  };
  return (
    <>
      <Container className={classes["full-height"]}>
        <div className={classes.center}>
          <Box className={classes.form}>
            <Container className={classes.container}>
              <Grid container direction={"column"} spacing={2}>
                <Grid item>
                  <Typography className={classes["center-text"]} variant="h4">
                    {page === "login" ? "Iniciar Sesión" : "Registrarme"}
                  </Typography>
                </Grid>
                <Grid item>
                  <ToggleButtonGroup
                    className={classes["toggle-align"]}
                    color="primary"
                    value={page}
                    exclusive
                    onChange={handleChange}
                  >
                    <ToggleButton
                      className={classes["toggle-align"]}
                      value="login"
                    >
                      Iniciar Sesión
                    </ToggleButton>
                    <ToggleButton
                      className={classes["toggle-align"]}
                      value="signup"
                    >
                      Registrarse
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item>
                  <TextField
                    className={classes["form-items"]}
                    name="email"
                    variant="outlined"
                    label="Correo"
                    type={"email"}
                    onChange={handleInputChange}
                    required
                  ></TextField>
                </Grid>
                <Grid item>
                  <TextField
                    className={classes["form-items"]}
                    name="password"
                    variant="outlined"
                    label="Contraseña"
                    type={"password"}
                    onChange={handleInputChange}
                    required
                  ></TextField>
                </Grid>
                <Grid item>
                  <Button
                    disabled={!values.email || !values.password}
                    className={classes["form-items"]}
                    variant="contained"
                    onClick={onSubmit}
                  >
                    {page === "login" ? "Ingresar" : "Registrarse"}
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </div>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleClose}
        open={open}
        autoHideDuration={6000}
      >
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
    </>
  );
}

export default Login;
