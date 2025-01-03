const express = require("express")
const multer  = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const router = express.Router();

// Cloudinary
cloudinary.config({ 
    cloud_name: 'dxiwgrvsp', 
    api_key: '849867888486153', 
    api_secret: "a0r9QqH-CanbHiopzZznNIyNd-U",
});

// End Cloundinary

const upload = multer();

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);
router.post(
    "/create",
    upload.single("thumbnail"),
    function (req, res, next) {
        if(req.file){
            let streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                      (error, result) => {
                        if (result) {
                          resolve(result);
                        } else {
                          reject(error);
                        }
                      }
                    );
        
                  streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };
        
            async function upload(req) {
                let result = await streamUpload(req);
                req.body[req.file.fieldname] = result.secure_url;
                next();
            }
            
            upload(req);
        } else {
            next();
        }
    },
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id",
    validate.createPost,
    controller.editPatch);

router.get("/detail/:id", controller.detail);
module.exports = router;

