import React from "react";
import { Button, Grid, Stack } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";

const AppointmentButtons = ({ appointments, canceledAppointments, downloadPDF, downloadExcel }) => (
  <Grid container justifyContent="flex-end" style={{ marginBottom: 20, marginTop: 20 }}>
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
      {/* Booked Appointments */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<PictureAsPdfIcon />}
        onClick={() => downloadPDF(appointments, "booked")}
      >
        Booked PDF
      </Button>

      <Button
        variant="contained"
        color="primary"
        startIcon={<TableViewIcon />}
        onClick={() => downloadExcel(appointments, "booked")}
      >
        Booked Excel
      </Button>

      {/* Canceled Appointments */}
      {canceledAppointments.length > 0 && (
        <>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => downloadPDF(canceledAppointments, "canceled")}
          >
            Canceled PDF
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<TableViewIcon />}
            onClick={() => downloadExcel(canceledAppointments, "canceled")}
          >
            Canceled Excel
          </Button>
        </>
      )}
    </Stack>
  </Grid>
);

export default AppointmentButtons;
