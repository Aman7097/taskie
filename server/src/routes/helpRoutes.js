const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const apiDocument = {
    title: "Task Manager API Documentation",
    version: "1.0.0",
  };

  res.json(apiDocument);
});

module.exports = router;
