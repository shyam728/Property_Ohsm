var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
AWS.config.update({
  region: process.env.Region,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});




// Create a DynamoDB Document Client
const dynamoDB = new AWS.DynamoDB.DocumentClient();



// Define your DynamoDB table name
const tableName = 'property';



// Function to get all properties
router.get('/getproperty' , async (req, res) => {
    try {
      const params = {
        TableName: tableName,
      };
  
      const result = await dynamoDB.scan(params).promise();
      res.status(200).json(result.Items);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  

  
  router.post('/createproperty', async (req, res) => {
    try {
      const { RbrandName, nOP, propertyType, propertyName, phoneNo, emailId, address, state, city, pinCode, imageUrl } = req.body;
      console.log(req.body)
      const id = uuidv4(); // Use UUID for a unique identifier
  
      const params = {
        TableName: tableName,
        Item: {
           
           id,
          RbrandName, 
          nOP,
          propertyType,
          propertyName,
          phoneNo,
          emailId,
          address,
          state,
          city,
          pinCode,
          imageUrl, // Add the image URL to the DynamoDB item
        },
      };
  
      await dynamoDB.put(params).promise();
      res.status(201).json({  message: 'New Property added successfully', id });
    } catch (error) {
      res.status(500).send(error);
    }
  });


  // Function to get a single property
  router.get('/getproperty/:PropertyId', async (req, res) => {
    try {
      const params = {
        TableName: tableName,
        Key: { PropertyId: req.params.PropertyId },
      };
  
      const result = await dynamoDB.get(params).promise();
  
      if (result.Item) {
        res.status(200).json(result.Item);
      } else {
        res.status(404).json({ message: 'Property not found' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
   );

 // Function to update a property
router.put('/updateproperty/:PropertyId', async (req, res) => {
    try {
      const {
        RbrandName,
        nOP,
        propertyType,
        propertyName,
        phoneNo,
        emailId,
        address,
        state,
        city,
        pinCode,
        imageUrl,
      } = req.body;
  
      // Check if any of the required fields are missing
      if (!RbrandName || !nOP || !propertyType || !propertyName || !phoneNo || !emailId || !address || !state || !city || !pinCode || !imageUrl) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const params = {
        TableName: tableName,
        Key: { PropertyId: req.params.PropertyId },
        UpdateExpression: 'SET RbrandName = :RbrandName, nOP = :nOP, propertyType = :propertyType, propertyName = :propertyName, phoneNo = :phoneNo, emailId = :emailId, address = :address, state = :state, city = :city, pinCode = :pinCode, imageUrl = :imageUrl',
        ExpressionAttributeValues: {
          ':RbrandName': RbrandName,
          ':nOP': nOP,
          ':propertyType': propertyType,
          ':propertyName': propertyName,
          ':phoneNo': phoneNo,
          ':emailId': emailId,
          ':address': address,
          ':state': state,
          ':city': city,
          ':pinCode': pinCode,
          ':imageUrl': imageUrl,
        },
        ReturnValues: 'ALL_NEW',
      };
  
      const result = await dynamoDB.update(params).promise();
  
      res.status(200).json({ message: 'Property updated successfully', property: result.Attributes });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  


// Function to delete a property
router.delete('/deleteproperty/:PropertyId', async (req, res) => {
    try {
      const params = {
        TableName: tableName,
        Key: { PropertyId: req.params.PropertyId },
      };
  
      const result = await dynamoDB.delete(params).promise();
  
      if (result) {
        res.json({ message: 'Property deleted successfully' });
      } else {
        res.status(404).json({ message: 'Property not found' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

);




module.exports = router