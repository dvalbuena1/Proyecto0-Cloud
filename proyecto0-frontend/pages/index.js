import {
  Alert,
  AppBar,
  Container,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import ModalNew from "../components/ModalNew";
import ModalDetail from "../components/ModalDetail";
import ModalEdit from "../components/ModalEdit";

const useStyles = makeStyles({
  height: {
    height: "100%",
  },
  textNavbar: {
    flexGrow: 1,
  },
  row: {
    cursor: "pointer",
  },
  add: {
    display: "flex",
    justifyContent: "end",
    marginTop: 8,
  },
  cell: {
    backgroundColor: "rgba(0,84,131,0.04)",
    fontWeight: "bold",
  },
});

export default function Home() {
  const classes = useStyles();
  const [events, setEvents] = useState([]);
  const router = useRouter();

  const [toast, setToast] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const { open, message, severity } = toast;

  const [modal, setModal] = useState({
    new: false,
    edit: false,
    detail: false,
  });
  const openModal = (modalP) => {
    const data = { ...modal };
    data[modalP] = true;
    setModal(data);
  };
  const closeModal = (modalP) => {
    const data = { ...modal };
    data[modalP] = false;
    setModal(data);
  };

  const [selected, setSelected] = useState();

  const updateData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      axios
        .get("http://localhost:5000/api/events", {
          params: { id_user: user.id },
        })
        .then((res) => setEvents(res.data));
    }
  };

  useEffect(() => {
    updateData();
  }, []);

  const handleClose = () => {
    setToast({ ...toast, open: false });
  };

  const logOut = (e) => {
    localStorage.removeItem("user");
    router.replace("/login");
  };
  const deleteEvent = async (event) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/events/${event.id}`
      );
      setToast({
        open: true,
        severity: "success",
        message: "Se elimino correctamente",
      });
      updateData();
    } catch (e) {
      setToast({
        open: true,
        severity: "error",
        message: "Se produjo un error, intente nuevamente",
      });
    }
  };
  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            className={classes.textNavbar}
          >
            Eventos
          </Typography>
          <IconButton
            onClick={logOut}
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container className={classes.height}>
        <div className={classes.add}>
          <IconButton onClick={() => openModal("new")} size="large">
            <AddCircleIcon />
          </IconButton>
        </div>
        <TableContainer sx={{ mt: 1 }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  className={classes.cell}
                  padding="checkbox"
                ></TableCell>
                <TableCell
                  className={classes.cell}
                  padding="checkbox"
                ></TableCell>
                <TableCell className={classes.cell}>Nombre</TableCell>
                <TableCell className={classes.cell}>Categoría</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((val, i) => (
                <TableRow key={i} hover>
                  <TableCell>
                    <IconButton onClick={() => deleteEvent(val)} size="large">
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelected(val);
                        openModal("edit");
                      }}
                      size="large"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell
                    className={classes.row}
                    onClick={() => {
                      setSelected(val);
                      openModal("detail");
                    }}
                    component="th"
                    scope="row"
                  >
                    {val.name}
                  </TableCell>
                  <TableCell
                    className={classes.row}
                    onClick={() => {
                      setSelected(val);
                      openModal("detail");
                    }}
                  >
                    {val.category}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleClose}
        open={open}
        autoHideDuration={6000}
      >
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
      <ModalNew
        open={modal.new}
        closeModal={closeModal}
        setToast={setToast}
        updateData={updateData}
      ></ModalNew>
      <ModalDetail
        open={modal.detail}
        closeModal={closeModal}
        event={selected}
      ></ModalDetail>
      <ModalEdit
        open={modal.edit}
        closeModal={closeModal}
        setToast={setToast}
        updateData={updateData}
        event={selected}
      ></ModalEdit>
    </>
  );
}
