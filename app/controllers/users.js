const uuid = require("uuid");
const { matchedData } = require("express-validator");
const utils = require("../middleware/utils");
const db = require("../middleware/db");
const emailer = require("../middleware/emailer");
const STORAGE_PATH = process.env.STORAGE_PATH;
const STORAGE_PATH_HTTP = process.env.STORAGE_PATH_HTTP;
const jwt = require("jsonwebtoken");
const { addHours } = require("date-fns");
const auth = require("../middleware/auth");
const fs = require("fs");

//Models

const User = require("../models/user");
const Hopper = require("../models/hopper");

const CMS = require("../models/cms");
const Avatar = require("../models/avatars");
const PriceTipAndFAQ = require("../models/priceTips_and_FAQS");
const Category = require("../models/categories");
const Tag = require("../models/tags");
const Privacy_policy = require("../models/privacy_policy");
const Terms_and_condition = require("../models/legal_terms");
const trendingSearch = require("../models/trending_search");

/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */

async function uploadImage(object) {
  return new Promise((resolve, reject) => {
    var obj = object.image_data;
    var name = Date.now() + obj.name;
    obj.mv(object.path + "/" + name, function (err) {
      if (err) {
        //console.log(err);
        reject(utils.buildErrObject(422, err.message));
      }
      resolve(name);
    });
  });
}

exports.checkIfUserNameExist = async (req, res) => {
  try {
    const data = req.params;
    const respon = await db.getItemCustom({ user_name: data.username }, Hopper);
    res.status(200).json({
      code: 200,
      userNameExist: respon ? true : false,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.checkIfEmailExist = async (req, res) => {
  try {
    const data = req.params;
    const respon = await db.getItemCustom({ email: data.email }, User);
    res.status(200).json({
      code: 200,
      emailExist: respon ? true : false,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.checkIfPhoneExist = async (req, res) => {
  try {
    const data = req.params;
    const respon = await db.getItemCustom({ phone: data.phone }, User);
    res.status(200).json({
      code: 200,
      phoneExist: respon ? true : false,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};
exports.getAvatars = async (req, res) => {
  try {
    const data = req.params;

    const response = await db.getItems(Avatar, { deletedAt: false });
    res.status(200).json({
      base_url: `https://uat-presshope.s3.eu-west-2.amazonaws.com/public/avatarImages`,
      response: response,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getCMSByType = async (req, res) => {
  try {
    const data = req.params;
    const findCMS = await db.getItemCustom({ type: data.type }, CMS);

    res.status(200).json({
      code: 200,
      data: findCMS,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getCMSForHopper = async (req, res) => {
  try {
    const [privacyPolicy, termAndCond] = await Promise.all([
      db.getItemCustom({ _id: '6458c3c7318b303d9b4755b3' }, Privacy_policy),
      db.getItemCustom({ _id: '6458c35c5d09013b05b94e37' }, Terms_and_condition),
      // db.getItemCustom({ type: "copyright_license", role: "Hopper" }, CMS),
    ]);

    res.status(200).json({
      code: 200,
      data: {
        termAndCond: termAndCond,
        privacyPolicy: privacyPolicy,
        // copyrightLicense: copyrightLicense,
      },
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getPriceTipAndFAQs = async (req, res) => {
  try {
    const data = {
      ...req.params,
      ...req.query,
    };
    data.user_id = req.user._id;
    const condition = {
      type: data.type,
      role: data.role,
    };
    if (data.category_id) {
      condition.category = data.category;
    }
    if (data.search) {
      const regex = { $regex: data.search, $options: "i" };
      condition.$or = [{ question: regex }, { answer: regex }];
    }
    const priceTipAndFAQs = await db.getPriceTipAndFAQs(
      PriceTipAndFAQ,
      condition
    );

    res.status(200).json({
      code: 200,
      priceTipAndFAQs: priceTipAndFAQs,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getCategory = async (req, res) => {
  try {
    const categories = await db.getItems(Category, { type: "content" })//{ $not: /^content*/ } });
    res.status(200).json({
      code: 200,
      categories: categories,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getTags = async (req, res) => {
  try {
    let data = req.query;
    data.mediahouse_id = req.user._id


    const condition = {};

    if (data.tagName) {
      condition.name = { $regex: data.tagName, $options: "i" };
    }

    let tags;
    if (data.type == "hopper") {
      tags = await db.getItems(Tag, condition);
    }
    if (data.type == "mediahouse") {

      tags = await db.getItems(Tag, condition);
      addTag = await db.createItem(data, trendingSearch);
    }

    res.status(200).json({
      code: 200,
      tags: tags,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.addTag = async (req, res) => {
  try {
    const data = req.body;
    let addTag;
    const ifTagExists = await db.getItemCustom(
      {
        name: data.name.toLowerCase(),
      },
      Tag
    );
    if (!ifTagExists) {
      addTag = await db.createItem(data, Tag);
    }
    res.status(200).json({
      code: 200,
      tag: ifTagExists ? ifTagExists : addTag,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;
    const USER = await User.findById(data.user_id).select("password");
    const isPasswordMatch = await auth.checkPassword(data.old_password, USER);
    if (!isPasswordMatch) {
      throw utils.buildErrObject(422, "Old Password is Incorrect");
    }
    USER.password = data.new_password;
    USER.save();
    res.status(200).json({
      code: 200,
      passwordChanged: true,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};


exports.trendingTag = async (req, res) => {

  try {

    // const getTags = await trendingSearch.find()

    const trendingTag = await trendingSearch.aggregate([

      {
        $group: {
          _id: "$tag_id",
          count: { $sum: 1 },

        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagName"
        }
      },
      {
        $unwind: "$tagName"
      },
      {
        $project: {
          _id: 0,
          count: 0,
          "tagName._id": 0,
          "tagName.createdAt": 0,
          "tagName.updatedAt": 0,
        }
      }
    ])

    // const tagNames = trendingTag.map((item) => item.tagName.name);

    res.status(200).json({
      code: 200,
      data: trendingTag
    });
  } catch (error) {
    utils.handleError(res, error);
  }
}