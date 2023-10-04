const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const Image = require('../../models/Image');
const Property = require('../../models/Property');
const checkPropertyImageExists = require('../../middleware/checkPropertyImageExists');
const checkProperty = require('../../middleware/checkProperty');


const destinationDirectory = 'public/images/uploads/';

const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, destinationDirectory);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

const upload = multer({ storage });

// POST create a new image for a property -----------------------------  OLD CODE
// router.post('/', async (req, res) => {
//   const { propertyID, imageURL } = req.body;
//   try {
//     const image = new Image({ propertyID, imageURL });
//     const newImage = await image.save();
//     res.status(201).json(newImage);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
// ---------------------------------------------------------------- Old Code
// function logRequest(req, res, next) {
//   console.log("/////////////////////////////////////////////////////");
//   console.log("/////////////////////////////////////////////////////");
//   console.log("/////////////////////////////////////////////////////");
//   console.log("Request Object:", req);
//   console.log("/////////////////////////////////////////////////////");
//   console.log("/////////////////////////////////////////////////////");
//   console.log("/////////////////////////////////////////////////////");
//   next(); // Call the next middleware in the chain
// }

// POST create a new image for a property
router.post('/', checkPropertyImageExists, async (req, res) => {
  console.log(req);
  console.log(req.body);
  const { originalname, buffer } = req.file;
  const { propertyID } = req.body;
  const fileName = uuidv4() + '-' + originalname.toLowerCase().split(' ').join('-');
  try {
    fs.writeFileSync( destinationDirectory + fileName, buffer);
      const imageName = fileName;

      const image = new Image({ propertyID, imageName });
      const newImage = await image.save();
      res.status(201).json(newImage);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// GET all images -----------------------------  OLD CODE
router.get('/all', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ---------------------------------------------------------------- Old Code

// GET an image againt ?propertyID=propertyID or ?imageName=imageName or ?id=id query paramenters
router.get('/', async (req, res) => {
    const { propertyID, imageName, id } = req.query;

    try {
      if ((propertyID==undefined) && (imageName==undefined)  && (id==undefined)) {
        return res.status(400).json({ message: 'Must sepcify the propertyID or imageName or id' });
      }
        
      const query = {};

      if (propertyID) {
        query.propertyID = propertyID;
      }
      if (imageName) {
        query.imageName = imageName;
      }
      if (id) {
        query._id = id;
      }

      const image = await Image.findOne(query);
      
      if (!image) {
          return res.status(404).json({ message: 'Image not found' });
      }

      const imageFileName =  image.imageName;
      const imagePath = path.join(__dirname, '..', '..', 'public', 'images', 'uploads', imageFileName);
      console.log(imagePath);

      if (fs.existsSync(imagePath)) {
          
        const imageStream = fs.createReadStream(imagePath);
        const base64Image = imageStream.toString('base64')
        const fileExtension = imageFileName.split('.').pop();

        res.status(200).json({
          _id: image._id,
          propertyID: image.propertyID,
          type: fileExtension,
          image: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
        });
        } else {
          res.status(404).json({ message: 'Image not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});


// PUT update an image by ID --------------------------------  OLD CODE
// router.put('/:id', getImage, async (req, res) => {
//   try {
//     const updatedImage = await res.image.set(req.body);
//     await updatedImage.save();
//     res.json(updatedImage);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
//--------------------------------------------------------------   OLD CODE

//Update Image 
router.put('/',     upload.single('image'), async (req, res) => {
  const { propertyID, id } = req.query;

  try {
    const imageFileName = req.file.filename;
    const imageFileNamePath = path.join(__dirname, '..', '..', 'public', 'images', 'uploads', imageFileName);
    if (propertyID==undefined && (id==undefined)) {
   
      if (fs.existsSync(imageFileName)) {
          fs.unlinkSync(imageFileName);
      }
      return res.status(400).json({ message: 'Must sepcify the valid propertyID or id' });
    }
    const existingProperty = await Property.findOne({ _id: propertyID });
    console.log(existingProperty);
    if (!existingProperty) {
      if (fs.existsSync(imageFileName)) {
        fs.unlinkSync(imageFileName);
    }
      return res.status(400).json({ message: 'Property does not exist' });
    }

  } catch (error) {
      console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }

    try {       
        const query = {};
        if (propertyID) {
          query.propertyID = propertyID;
        }
        if (id) {
          query._id = id;
        }
        const newImageName = req.file.filename;
      // Find the existing image by ID
      const existingImage = await Image.findOne(query);

      if (!existingImage) {
          return res.status(404).json({ message: 'Image not found' });
      }

      // Delete the old image file from the file system
      const oldImageFileName = existingImage.imageName;
      const oldImagePath = path.join(__dirname, '..', '..', 'public', 'images', 'uploads', oldImageFileName);

      if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
      }

      // Update the image details in the database
      existingImage.propertyID = propertyID;
      existingImage.imageName = newImageName;
      const updatedImage = await existingImage.save();

      res.status(200).json(updatedImage);
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
  }
});

// DELETE an image againt ?propertyID=propertyID or ?id=id query paramenters
router.delete('/', async (req, res) => {
  const { propertyID, id } = req.query;
  try {
    if ((propertyID==undefined) && (id==undefined)) {
      return res.status(400).json({ message: 'Must sepcify the propertyID or id' });
    }

    const query = {};
    if (propertyID) {
      query.propertyID = propertyID;
    }
    if (id) {
      query._id = id;
    }
        
    // Find image by property ID
    const image = await Image.findOne(query);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete image from storage
    const imageFileName = image.imageName;
    const imagePath = path.join(__dirname, '..', '..', 'public', 'images', 'uploads', imageFileName);

    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }

    // Delete image from database
    await image.deleteOne({ _id: image._id });

    res.status(200).json({ message: 'Image deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
