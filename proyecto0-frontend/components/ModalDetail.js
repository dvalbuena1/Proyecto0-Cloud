import { Grid, Modal, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";

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
  bold: {
    fontWeight: "bold",
  },
});

function ModalDetail(props) {
  const classes = useStyles();
  return props.event ? (
    <Modal open={props.open} onClose={() => props.closeModal("detail")}>
      <Box className={classes.modal}>
        <Typography variant="h4">{props.event.name}</Typography>
        <Grid className={classes.grid} container spacing={2}>
          <Grid item xs={6}>
            <Typography className={classes.bold} variant="h6">
              Categoría
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{props.event.category}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.bold} variant="h6">
              Lugar
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{props.event.place}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.bold} variant="h6">
              Dirección
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{props.event.address}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.bold} variant="h6">
              Fecha Inicio
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{props.event.start_date}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.bold} variant="h6">
              Fecha Fin
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{props.event.end_date}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  ) : (
    <></>
  );
}

export default ModalDetail;
