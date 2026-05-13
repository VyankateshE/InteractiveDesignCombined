const express = require('express');
const router = express.Router();
//const { getUsers,createUsers,userDetail,deleteUser,updateUser } = require ("../controllers/users.js")
const locationControllerC = require("../../controllers/v1/locationController.js")
const locationController = new locationControllerC();

router.get('/', locationController.listlocation);
router.post('/uploadHtml', locationController.uploadHTML);
router.post('/uploadHTML5', locationController.uploadHTML5);
router.post('/uploadHtmlSinglePage', locationController.uploadHtmlSinglePage);
router.post('/uploadNoramlPdf', locationController.uploadNoramlPdf);


// router.post('/uploadHTMLWithElementSize', locationController.uploadHTMLWithElementSize);


module.exports = router;