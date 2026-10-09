const express=require('express')
const {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
} =require("../controller/appointmentController.js")
const {
  isAdminAuthenticated,
  isPatientAuthenticated,
} =require ("../middlewares/auth.js");

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

module.exports=router;
