const { buildErrObject } = require("../middleware/utils");
var mongoose = require("mongoose");
// const querystring = require('querystring')
const AWS = require("aws-sdk");
const { resolve } = require("path");
const { rejects } = require("assert");
const ACCESS_KEY ="AKIAVOXE3E6KGIDEVH2F"; //process.env.ACCESS_KEY
const SECRET_KEY ="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";//process.env.SECRET_KEY
const Bucket ="uat-presshope";  //process.env.Bucket
const REGION ="eu-west-2";  //process.env.REGION

var bucket = new AWS.S3({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION,
});




module.exports = {

  /**
   * in case need to get id without requireAuth
   * @param {String} token - binary file with path
  */

  async getUserIdFromToken(token) {
    return new Promise((resolve, reject) => {
      const jwt = require("jsonwebtoken");
      const auth = require("../middleware/auth");
      jwt.verify(auth.decrypt(token), process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(buildErrObject(401, "Unauthorized"));
        }
        resolve(decoded.data);
      });
    });
  },

  /**
   * upload file to server
   * @param {Object} object - binary file with path
  */

  async uploadFile(object) {
    return new Promise((resolve, reject) => {
      var obj = object.file;
      var name = Date.now() + obj.name;
      obj.mv(object.path + "/" + name, function (err) {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve(name);
      });
    });
  },





  //S3 BUCKET


async uploadFiletoAwsS3Bucket(object){
  return new Promise(async (resolve, reject) => {
    var file = object.fileData;
    console.log("OBJ in upload file is here---", file);
    // const [fileNamePrefix, ...fileData] = object.fileData.name.split(".");
    // const fileExt = fileData.pop();
    // const fileName = `${fileNamePrefix}-${Date.now()}.${fileExt}`;
    var filename = Date.now() + file.name;
    const params = {
      Bucket: Bucket,
      Key: object.path + "/" + filename,
      Body: file.data,
      ContentType: file.mimetype,
    };
    
    return bucket.upload(params, function (err, data) {
      if (err) {
        console.log("----err----",err);
        reject(buildErrObject(422, err.message));
      }
      resolve({  media_type: file.mimetype , fileName: filename, data:data.Location});
    });
  });
},


async uploadFiletoAwsS3BucketforAudiowatermark(object){
  return new Promise(async (resolve, reject) => {
    var file = object;
    console.log("OBJ in upload file is here---", file);
    const randomname =   Math.floor(1000000000 + Math.random() * 9000000000)
    // const [fileNamePrefix, ...fileData] = object.fileData.name.split(".");
    // const fileExt = fileData.pop();
    // const fileName = `${fileNamePrefix}-${Date.now()}.${fileExt}`;
    var filename = Date.now() + randomname;
    const params = {
      Bucket: Bucket,
      Key: `public/userImages` + "/" + filename,
      Body: object.fileData,
      ContentType:  "audio/mp3",//file.mimetype ,
    };
    
    return bucket.upload(params, function (err, data) {
      if (err) {
        console.log("----err----",err);
        reject(buildErrObject(422, err.message));
      }
      resolve({fileName: filename, data:data.Location});
    });
  });
},
 async deleteMediaFromS3Bucked(object){
  return new Promise(async (resolve, reject) => {
    return bucket.deleteObject(object, (err, data) => {
      if (err) {
        console.log("----err----",err);
        reject(buildErrObject(422, err.message));
      } else {
       resolve(data);
      }
    });
  })
 },

  /**
   * capitalize first letter of string
   * @param {string} string 
  */

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  /**
   * generate random string
   * @param {string} string 
  */

  async customRandomString(length, chars = 'abcdefghijklmnopqrstuvwxyz@1234567890!') {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },

  /**
   * generate random string
   * @param {string} string 
  */

  automatedString() {
    return Math.random().toString(36).slice(2);
  },

  /**
   * convert a given array of string to mongoose ids
   * @param {Array} array 
  */

  async convertToObjectIds(array) {
    return array.map(item => mongoose.Types.ObjectId(item));
  },

   /**
   * convert title to slug
   * @param {String} title 
  */
  async createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  },

  /**
   * Validate the size
   * @param {File} file 
   * @param {Number} fize size in Byte 
  */
  async validateFileSize(file, size) {
    return new Promise(async (resolve, reject) => {

      try{

        if(file.size > size){
          reject(buildErrObject(422, `File should be less than ${size/1048576} MB`)); // convert byte to MB
        }
        resolve({
          success : true,
        })

      }catch(err){
        reject(buildErrObject(422, err.message));
      }

    })

  },

  /**
  //  * Object to Query string
  //  * @param {Object} obj 
  // */
  // async objectToQueryString(obj) {

  //   let result = querystring.stringify(obj);

  //   return result

  // }

};