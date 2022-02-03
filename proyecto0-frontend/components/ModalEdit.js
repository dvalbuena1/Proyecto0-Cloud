import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Button,
  Grid,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

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
    paddingTop: 24,
  },
  select: {
    width: "100%",
  },
  button: {
    width: "100%",
  },
});

function ModalEdit(props) {
  const classes = useStyles();

  const categories = [
    { value: "Conferencia", label: "Conferencia" },
    { value: "Seminario", label: "Seminario" },
    { value: "Congreso", label: "Congreso" },
    { value: "Curso", label: "Curso" },
  ];
  const startDate = new Date(props.event?.start_date);
  const endDate = new Date(props.event?.end_date);

  const [values, setValues] = useState({
    name: props.event?.name,
    category: props.event?.category,
    place: props.event?.place,
    address: props.event?.address,
    start_date: new Date(props.event?.start_date),
    end_date: new Date(props.event?.end_date),
  });

  useEffect(() => {
    setValues({
      name: props.event?.name,
      category: props.event?.category,
      place: props.event?.place,
      address: props.event?.address,
      start_date: new Date(props.event?.start_date),
      end_date: new Date(props.event?.end_date),
    });
  }, [props.open, props.event]);

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
        const data = {};
        if (values.name !== props.event?.name) data["name"] = values.name;
        if (values.category !== props.event?.category)
          data["category"] = values.category;
        if (values.place !== props.event?.place) data["place"] = values.place;
        if (values.address !== props.event?.address)
          data["address"] = values.address;
        if (values.start_date.getTime() !== startDate.getTime())
          data["start_date"] = moment(values.start_date).format(
            "YYYY-MM-DDTHH:mm:ss[Z]"
          );
        if (values.end_date.getTime() !== endDate.getTime())
          data["end_date"] = moment(values.end_date).format(
            "YYYY-MM-DDTHH:mm:ss[Z]"
          );

        const res = await axios.put(
          `http://localhost:5000/api/events/${props.event?.id}`,
          data
        );
        props.setToast({
          open: true,
          severity: "success",
          message: "Se edito correctamente el evento!",
        });
        props.updateData();
        props.closeModal("edit");
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
    <Modal open={props.open} onClose={() => props.closeModal("edit")}>
      <Box className={classes.modal}>
        <Typography variant="h5">Editar evento</Typography>
        <Grid className={classes.grid} container spacing={2}>
          <Grid item xs={6}>
            <TextField
              name="name"
              variant="standard"
              label="Nombre"
              onChange={handleInputChange}
              value={values.name}
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
              value={values.place}
              required
            ></TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="address"
              variant="standard"
              label="Dirección"
              onChange={handleInputChange}
              value={values.address}
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
                onChange={(newValue) => {
                  setValues({ ...values, end_date: newValue });
                }}
                renderInput={(params) => (
                  <TextField variant="standard" {...params} />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={
                values.name === props.event?.name &&
                values.category === props.event?.category &&
                values.place === props.event?.place &&
                values.address === props.event?.address &&
                values.start_date.getTime() === startDate.getTime() &&
                values.end_date.getTime() === endDate.getTime()
              }
              className={classes.button}
              variant="contained"
              onClick={onSubmit}
            >
              Editar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default ModalEdit;
