import {
  Button,
  Grid,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";

const useStyles = makeStyles({
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "white",
    boxShadow:
      "rgb(0 0 0 / 20%) 0px 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px;",
    padding: 32,
  },
  grid: {
    paddingTop: 10,
  },
  select: {
    width: "100%",
  },
  button: {
    width: "100%",
  },
});

function ModalNew(props) {
  const classes = useStyles();
  const categories = [
    { value: "Conferencia", label: "Conferencia" },
    { value: "Seminario", label: "Seminario" },
    { value: "Congreso", label: "Congreso" },
    { value: "Curso", label: "Curso" },
  ];

  const [values, setValues] = useState({
    name: "",
    category: "",
    place: "",
    address: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    setValues({
      name: "",
      category: "",
      place: "",
      address: "",
      start_date: "",
      end_date: "",
    });
  }, [props.open]);

  const handleInputChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeSelect = (e) =>
    setValues({ ...values, category: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      values.name &&
      values.category &&
      values.place &&
      values.address &&
      values.start_date &&
      values.end_date
    ) {
      try {
        let data = values;

        const user = JSON.parse(localStorage.getItem("user"));
        data = {
          ...data,
          start_date: moment(data.start_date).format("YYYY-MM-DDTHH:mm:ss[Z]"),
          end_date: moment(data.end_date).format("YYYY-MM-DDTHH:mm:ss[Z]"),
          user: user.id,
        };

        const res = await axios.post("http://172.24.41.210/api/events", data);
        props.setToast({
          open: true,
          severity: "success",
          message: "Se creo correctamente el nuevo evento!",
        });
        props.updateData();
        props.closeModal("new");
      } catch (e) {
        console.log(e);
        props.setToast({
          open: true,
          severity: "error",
          message: "Se produjo un error, intente nuevamente",
        });
      }
    }
  };
  return (
    <Modal open={props.open} onClose={() => props.closeModal("new")}>
      <Box className={classes.modal}>
        <Typography variant="h5">Crear nuevo evento</Typography>
        <Grid className={classes.grid} container spacing={2}>
          <Grid item xs={6}>
            <TextField
              name="name"
              variant="standard"
              label="Nombre"
              onChange={handleInputChange}
              required
            ></TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              className={classes.select}
              select
              value={values.category}
              variant="standard"
              label="Categoría"
              onChange={handleChangeSelect}
              defaultValue=""
              required
            >
              {categories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="place"
              variant="standard"
              label="Lugar"
              onChange={handleInputChange}
              required
            ></TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="address"
              variant="standard"
              label="Dirección"
              onChange={handleInputChange}
              required
            ></TextField>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha Inicio"
                value={values.start_date}
                onChange={(newValue) =>
                  setValues({ ...values, start_date: newValue })
                }
                renderInput={(params) => (
                  <TextField variant="standard" {...params} />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha Fin"
                value={values.end_date}
                onChange={(newValue) =>
                  setValues({ ...values, end_date: newValue })
                }
                renderInput={(params) => (
                  <TextField variant="standard" {...params} />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={
                !values.name ||
                !values.category ||
                !values.place ||
                !values.address ||
                !values.start_date ||
                !values.end_date
              }
              className={classes.button}
              variant="contained"
              onClick={onSubmit}
            >
              Crear
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default ModalNew;
