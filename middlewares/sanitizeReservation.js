
const sanitizeReservation = (req, res, next) => {
  const data = req.body;
  const dateNow = new Date().toISOString();

  if(!data) {
    return res.status(400).json({success: false, messaage: "Error: There are no data has been sent to server!"});
  }

  if(!data.user){
    return res.status(400).json({success: false, messaage: "Error: Failed to send the user data to the server"});
  }

  if(!data.startTime || !data.endTime){
    return res.status(400).json({success: false, messaage: "Error: Incomplete time data"});
  }

  data.date = (data.date && String(data.date).trim()) || "";
  data.startTime = (String(data.startTime).trim()) || "";
  data.endTime = (String(data.endTime).trim()) || "";
  data.status = (data.status && String(data.status).trim()) || "pending";

  data.createdAt = data.createdAt && String(data.createdAt).trim() || dateNow;
  data.updatedAt = data.updatedAt && String(data.updatedAt).trim() || dateNow;
  
  next();
}

module.exports = { sanitizeReservation }
