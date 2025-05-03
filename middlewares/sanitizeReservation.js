const { validateTime } = require("../utils/validateTime")

const sanitizeReservation = (req, res, next) => {
  if(!req.body) {
    return res.status(400).json({messaage: "Error: There are no data has been sent to server!"});
  }

  validateTime(req.body.startTime);

  const data = req.body;
  const dateNow = new Date().toISOString();

  data.date = (data.date && String(data.date).trim()) || "";
  data.startTime = (data.startTime && String(data.startTime).trim()) || "";
  data.endTime = (data.endTime && String(data.endTime).trim()) || "";
  data.status = (data.status && String(data.status).trim()) || "pending";

  data.user = data.user || {};

  data.createdAt = data.createdAt && String(data.createdAt).trim() || dateNow;
  data.updatedAt = data.updatedAt && String(data.updatedAt).trim() || dateNow;
  
  next();
}

module.exports = { sanitizeReservation }
