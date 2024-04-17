const express = require("express");
const router = express.Router();
const { getContacts, getContactById, createContact, updateContactById, deleteContactById } = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getContacts).post(createContact);


router.route("/:id").get(getContactById).put(updateContactById).delete(deleteContactById);


module.exports = router