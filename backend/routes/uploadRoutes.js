import express from 'express'
import multer from 'multer'
import path from 'path';

const router = express.Router()

//storage configuration
const storage = multer.diskStorage({

  //storage destination
  //set destination path
  destination(req,file,cb){
    //store in uploads folder
    cb(null,'uploads')
  },
  //file name configuration
  //set file names
  //file name will be - xyz-23-02-2022.txt
  fileName(req,file,cb){
    cb(null,`${file.filename}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

//filter function
function checkFileType(file,cb){
  const fileTypes = /jpg|jpeg|png/
  //check if extension matches
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  //check if mimetype matches
  const mimetype = fileTypes.test(file.mimetype)

  //if extension and mimetype matches
  if(extname && mimetype){
    //store the file
    return cb(null, true)

    //if extension and mimetype does not match
  }else{
    cb('Images only')
  }
}

//define instance of multer
//it contains storage configuration and logic to filter files to be stored
const upload = multer({
  //storage configuration
  storage,
  //filter for files to store
  fileFilter: function(req,file,cb){
    //filter function
    checkFileType(file,cb)
  }
})

//define route
router.post('/', upload.single('image'),(req,res) => {
  res.send(`/${req.file.path}`)
})

export default router;
