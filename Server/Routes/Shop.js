const express = require("express");
const router = express.Router();

const {
  getItems,
  createItem,
  modifyItem,
} = require("../Controllers/ItemsController");

const { VerifyAdmin } = require("../Utilities/Authenticator");

// Show articles in the shop
router.get("/", getItems);

// Create a new article
router.post("/", createItem);

// Modify an article
router.patch("/", modifyItem);

module.exports = router;
