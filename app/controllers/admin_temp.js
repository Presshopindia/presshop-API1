const uuid = require("uuid");
const { matchedData } = require("express-validator");
const utils = require("../middleware/utils");
const db = require("../middleware/admin_db");
const jwt = require("jsonwebtoken");
const { addHours } = require("date-fns");
const auth = require("../middleware/auth");
const emailer = require("../middleware/emailer");
var mongoose = require("mongoose");

const HOURS_TO_BLOCK = 2;
const LOGIN_ATTEMPTS = 5;
const fs = require("fs");
const STORAGE_PATH = process.env.STORAGE_PATH;
const STORAGE_PATH_HTTP = process.env.STORAGE_PATH_HTTP;

// Models

const User = require("../models/user");
const MediaHouse = require("../models/media_houses");
const Hopper = require("../models/hopper");
const Admin = require("../models/admin");
const CMS = require("../models/cms");
const Avatar = require("../models/avatars");
const PriceTipAndFAQ = require("../models/priceTips_and_FAQS");
const Category = require("../models/categories");
const HopperMgmtHistory = require("../models/hopperMgmtHistory");
const mediaHousetaskHistory = require("../models/mediaHousetaskHistory");
const ContnetMgmtHistory = require("../models/contentMgmtHistory");
const PublicationMgmtHistory = require("../models/publicationMgmtHistory");
const Contents = require("../models/contents");
const AdminOfficeDetail = require("../models/adminOfficeDetail");
const PublishedContentSummery = require("../models/publishedContentSummery");

const Content = require("../models/contents");
const BroadCastTask = require("../models/mediaHouseTasks");
const BroadCastHistorySummery = require("../models/broadCastHistorySummery");
const Faq = require("../models/faqs");
const Privacy_policy = require("../models/privacy_policy");
const Legal_terms = require("../models/legal_terms");
const Tutorial_video = require("../models/tutorial_video");
const Docs = require("../models/docs");
const PurchasedContentHistory = require("../models/purchasedContentHistory");
const SourceContentHistory = require("../models/sourceContentHistory");
const Price_tips = require("../models/price_tips");
const Commission_structure = require("../models/commission_structure");
const Selling_price = require("../models/selling_price");
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

/********************
 * Public functions *
 ********************/

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateCMSForHopper = async (req, res) => {
  try {
    let updatedCMS;
    const data = req.body;
    const findCMS = await db.getItemCustom(
      { type: data.type, role: data.role },
      CMS
    );
    if (findCMS) {
      updatedCMS = await db.updateItem(findCMS._id, CMS, data);
    } else {
      updatedCMS = await db.createItem(data, CMS);
    }
    res.status(200).json({
      data: updatedCMS,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getCMS = async (req, res) => {
  try {
    const data = req.params;
    const findCMS = await db.getItemCustom(
      { type: data.type, role: data.role },
      CMS
    );

    res.status(200).json({
      data: findCMS,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

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
    const data = { ...req.params, ...req.query };

    const response = await db.getItems(
      Avatar,
      {deletedAt:false},
      { _id: -1 },
      data.limit,
      data.offset
    );
    res.status(200).json({
      base_url: `${STORAGE_PATH_HTTP}/avatarImages`,
      response: response,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getHopperList = async (req, res) => {
  try {
    const data = req.query;

    const response = await db.getHopperList(Hopper, data);

    res.status(200).json({
      code: 200,
      response: response,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getHopperById = async (req, res) => {
  try {
    const data = req.params;

    const hopperDetail = await db.getHopperById(Hopper, data);

    res.status(200).json({
      code: 200,
      hopperDetail: hopperDetail,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.addAvatar = async (req, res) => {
  try {
    const reqData = req.body;
    if (req.files && Array.isArray(req.files.avatars)) {
      for await (const data of req.files.avatars) {
        reqData.avatar = await utils.uploadFile({
          fileData: data,
          path: `${STORAGE_PATH}/avatarImages`,
        });

        await db.createItem(reqData, Avatar);
      }
    } else if (req.files && !Array.isArray(req.files.avatars)) {
      reqData.avatar = await utils.uploadFile({
        fileData: req.files.avatars,
        path: `${STORAGE_PATH}/avatarImages`,
      });

      await db.createItem(reqData, Avatar);
    } else {
      throw utils.buildErrObject(422, "Please send atleast one image");
    }
    res.status(200).json({
      code: 200,
      uploaded: true,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.deleteAvatar = async (req, res) => {
  try {
    // const data = req.body;
    // const ifAvatarIsAlreadyUsed = await db.getItemCustom(
    //   { avatar_id: data.avatar_id },
    //   Hopper
    // );
    // console.log("ifAvatarIsAlreadyUsed==>", ifAvatarIsAlreadyUsed);
    // if (ifAvatarIsAlreadyUsed)
    //   throw utils.buildErrObject(422, "This Avatar is taken by some users");
    // const deleteAvatar = await db.deleteItem(data.avatar_id, Avatar)


    var data = req.body;
    console.log("==================>", data);
    const respon = await db.deleteAvtarbyAdmin(
      Avatar,
      data
    );


    res.status(200).json({
      code: 200,
      deleted: respon,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editHopper = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updateHopperObj = {
      latestAdminUpdated: new Date(),
      category: data.category,
      status: data.status,
      isTempBlocked: data.isTempBlocked,
      isPermanentBlocked: data.isPermanentBlocked,
      latestAdminRemark: data.latestAdminRemark,
      mode: data.mode,
      user_id: req.user._id
    };
    if (data.hasOwnProperty("checkAndApprove")) {
      updateHopperObj.checkAndApprove = data.checkAndApprove;
    }

    const createAdminHistory = {
      admin_id: req.user._id,
      hopper_id: data.hopper_id,
      role: req.user.role,
      status: data.status,
      mode: data.mode,
      remarks: data.latestAdminRemark,
      action: data.isTempBlocked
        ? "isTempBlocked"
        : data.isPermanentBlocked
          ? "isPermanentBlocked"
          : "nothing",
    };

    const [editHopper, history] = await Promise.all([
      db.updateItem(data.hopper_id, Hopper, updateHopperObj),
      db.createItem(createAdminHistory, HopperMgmtHistory),
    ]);

    res.status(200).json({
      code: 200,
      data: editHopper,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editContent = async (req, res) => {
  try {
    const data = req.body;
    console.log("---------------DATA------------",data);
    const locale = req.getLocale();
    const updateContentObj = {
      heading: data.heading,
      secondLevelCheck: data.secondLevelCheck,
      call_time_date: data.call_time_date,
      description: data.description,
      mode: data.mode,
      status: data.status,
      remarks: data.remarks,
      user_id: req.user._id,
      firstLevelCheck: data.firstLevelCheck
    };

    console.log("--------------------updateContentObj-----------",updateContentObj);
    if (data.hasOwnProperty("checkAndApprove")) {
      updateContentObj.checkAndApprove = data.checkAndApprove;
    }
    // if(data.firstLevelCheck){
    //   updateContentObj.firstLevelCheck = data.firstLevelCheck.map((check)=>check);
    // }

    const createAdminHistory = {
      admin_id: req.user._id,
      content_id: data.content_id,
      // hopper_id: data.hopper_id,
      role: req.user.role,
      status: data.status,
      mode: data.mode,
      remarks: data.latestAdminRemark,
      action: data.isTempBlocked
        ? "isTempBlocked"
        : data.isPermanentBlocked
          ? "isPermanentBlocked"
          : "nothing",
    };
    const [editContent, history] = await Promise.all([
      db.updateItem(data.content_id, Content, updateContentObj),
      db.createItem(createAdminHistory, ContnetMgmtHistory),
    ]);

    res.status(200).json({
      code: 200,
      data: editContent,
    });
  } catch (error) {
    console.log('error----------->', error);
    utils.handleError(res, error);
  }
};

exports.editPublication = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updatePublicationObj = {
      latestAdminUpdated: new Date(),
      category: data.category,
      status: data.status,
      isTempBlocked: data.isTempBlocked,
      isPermanentBlocked: data.isPermanentBlocked,
      remarks: data.latestAdminRemark,
      mode: data.mode,
      action: data.action,
      user_id: req.user._id
    };
    if (data.hasOwnProperty("checkAndApprove")) {
      updatePublicationObj.checkAndApprove = data.checkAndApprove;
    }


    const createAdminHistory = {
      admin_id: req.user._id,
      publication_id: data.publication_id,
      role: req.user.role,
      status: data.status,
      mode: data.mode,
      remarks: data.latestAdminRemark,
      action: data.isTempBlocked
        ? "isTempBlocked"
        : data.isPermanentBlocked
          ? "isPermanentBlocked"
          : "nothing",
    };
    const [editPublication, history] = await Promise.all([
      db.updateItem(data.publication_id, MediaHouse, updatePublicationObj),
      db.createItem(createAdminHistory, PublicationMgmtHistory),
    ]);

    res.status(200).json({
      code: 200,
      data: editPublication,
    });
  } catch (error) {
    console.log('error----------->', error);
    utils.handleError(res, error);
  }
};

exports.addCategory = async (req, res) => {
  try {
    const data = req.body;
    const ifCategoryExists = await db.getItemCustom(
      {
        name: data.name.toLowerCase(),
        type: data.type,
      },
      Category
    );

    if (ifCategoryExists) {
      throw utils.buildErrObject(422, "This Category is Already Added");
    }
    const addCategory = await db.createItem(data, Category);

    res.status(200).json({
      code: 200,
      category: addCategory,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getCategory = async (req, res) => {
  try {
    const data = { ...req.params, ...req.query };
    const condition = {
      type: data.type,
    };
    const CATEGORIES = await db.getItems(Category, condition);

    res.status(200).json({
      code: 200,
      categories: CATEGORIES,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const data = req.params;

    const category = await db.getItem(data.category_id, Category);

    res.status(200).json({
      code: 200,
      category: category,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.addPriceTipAndFAQs = async (req, res) => {
  try {
    const data = req.body;

    const addPriceTipAndFAQs = await db.createItem(data, PriceTipAndFAQ);

    res.status(200).json({
      code: 200,
      priceTipAndFaq: addPriceTipAndFAQs,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getHopperMgmtHistory = async (req, res) => {
  try {
    const data = req.params;

    const { totalCount, hopperHistory } = await db.getHopperMgmtHistory(
      HopperMgmtHistory,
      data
    );

    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      hopperHistory: hopperHistory,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getContentMgmtHistory = async (req, res) => {
  try {
    const data = req.params;

    const { totalCount, contnetMgmtHistory } = await db.getContentMgmtHistory(
      ContnetMgmtHistory,
      data
    );

    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      contnetMgmtHistory: contnetMgmtHistory,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getContentList = async (req, res) => {
  try {
    // ["pro", "amateur"]
    const data = req.query;

    const { contentList, totalCount } = await db.getContentList(Content, data);

    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      contentList: contentList,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getPublicationList = async (req, res) => {
  try {
    // ["pro", "amateur"]
    const data = req.query;

    const { publicationList, totalCount } = await db.getPublicationList(MediaHouse, data);

    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      data: publicationList,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getPublicationMgmtHistory = async (req, res) => {
  try {
    const data = req.params;

    const { totalCount, publicationHistory } = await db.getPublicationMgmtHistory(
      PublicationMgmtHistory,
      data
    );

    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      publicationHistory,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.editProfile = async (req, res) => {
  try {
    const data = req.body;
    data.admin_id = req.user._id;

    if (req.files && req.files.profile_image) {
      data.profile_image = await utils.uploadFile({
        fileData: req.files.profile_image,
        path: `${STORAGE_PATH}/adminImages`,
      });
    }
    const editedProfile = await db.updateItem(data.admin_id, Admin, data);

    res.status(200).json({
      code: 200,
      editedProfile: editedProfile,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const data = req.body;
    data.admin_id = req.user._id;
    console.log("id==>", data.admin_id);

    const profileData = await db.getItem(data.admin_id, Admin);

    res.status(200).json({
      code: 200,
      profileData: profileData,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const locale = req.getLocale();

    const data = req.body;

    data.role = "subAdmin";

    data.creator_id = req.user._id;

    const doesAdminEmailExists = await emailer.emailAdminExists(data.email);

    if (!doesAdminEmailExists) {
      if (req.files && req.files.profile_image) {
        data.profile_image = await utils.uploadFile({
          fileData: req.files.profile_image,
          path: `${STORAGE_PATH}/adminImages`,
        });
      }
      if (data.bank_details) {
        data.bank_details = JSON.parse(data.bank_details)
      }
      if (data.subadmin_rights) {
        data.subadmin_rights = JSON.parse(data.subadmin_rights)
      }
      if (data.employee_address) {
        data.employee_address = JSON.parse(data.employee_address)
      }
      const employeeAdded = await db.createItem(data, Admin);

      const emailObj = {
        to: employeeAdded.email,
        subject: "Credentials for Presshop admin Plateform",
        name: employeeAdded.name,
        email: employeeAdded.email,
        password: data.password,
      };

      await emailer.sendSubAdminCredentials(locale, emailObj);

      res.status(200).json({
        code: 200,
        employeeAdded: employeeAdded,
      });
    }
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};



exports.editEmployee = async (req, res) => {
  try {
    const data = req.body;

    const editedCategory = await db.updateItem(
      data.employee_id,
      Admin,
      data
    );

    res.status(200).json({
      code: 200,
      editedCategory: editedCategory,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};









exports.getEmployees = async (req, res) => {
  try {
    const locale = req.getLocale();

    const data = { ...req.params, ...req.query };

    const { emplyeeList, totalCount } = await db.getEmployees(Admin, data);

    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      emplyeeList: emplyeeList,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const data = req.params;
    const [
      categoryUsedInFAQAndPriceTips,
      categoryUsedInContent,
      categoryUsedAsDesignationInAdmin,
      categoryUsedAsDepartmentInAdmin,
    ] = await Promise.all([
      db.getItemCustom({ category_id: data.category_id }, PriceTipAndFAQ),
      db.getItemCustom({ category_id: data.category_id }, Content),
      db.getItemCustom({ designation_id: data.category_id }, Admin),
      db.getItemCustom({ department_id: data.category_id }, Admin),
    ]);
    if (
      categoryUsedInFAQAndPriceTips ||
      categoryUsedInContent ||
      categoryUsedAsDesignationInAdmin ||
      categoryUsedAsDepartmentInAdmin
    )
      throw utils.buildErrObject(422, "This Avatar is taken by some users");
    const deleteCategory = await db.deleteItem(data.category_id, Category);

    res.status(200).json({
      code: 200,
      deleted: true,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editCategory = async (req, res) => {
  try {
    const data = req.body;

    const editedCategory = await db.updateItem(
      data.category_id,
      Category,
      data
    );

    res.status(200).json({
      code: 200,
      editedCategory: editedCategory,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getBroadCastTasks = async (req, res) => {
  try {
    const data = req.query;
    const { contentList, totalCount } = await db.getTaskList(BroadCastTask, data);

    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      contentList: contentList,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.editBroadCast = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updateBroadCastObj = {
      latestAdminUpdated: new Date(),
      category: data.category,
      status: data.status,
      isTempBlocked: data.isTempBlocked,
      isPermanentBlocked: data.isPermanentBlocked,
      remarks: data.latestAdminRemark,
      mode: data.mode,
      user_id: req.user._id
    };
    if (data.hasOwnProperty("checkAndApprove")) {
      updateBroadCastObj.checkAndApprove = data.checkAndApprove;
    }

    const createAdminHistory = {
      // mediaHouse_id:data.mediaHouse_id,
      admin_id: req.user._id,
      broadCast_id: data.broadCast_id,
      role: req.user.role,
      status: data.status,
      mode: data.mode,
      remarks: data.latestAdminRemark,
      action: data.isTempBlocked
        ? "isTempBlocked"
        : data.isPermanentBlocked
          ? "isPermanentBlocked"
          : "nothing",
    };

    const [editBroadCast, history] = await Promise.all([
      db.updateItem(data.broadCast_id, BroadCastTask, updateBroadCastObj),
      db.createItem(createAdminHistory, BroadCastHistorySummery),
    ]);

    res.status(200).json({
      code: 200,
      data: editBroadCast,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editPublishedContent = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updatePublishedContentObj = {
      latestAdminUpdated: new Date(),
      isTempBlocked: data.isTempBlocked,
      isPermanentBlocked: data.isPermanentBlocked,
      remarks: data.latestAdminRemark,
      mode: data.mode,
      admin_id: req.user._id,
      heading: data.heading
    };
    if (data.hasOwnProperty("checkAndApprove")) {
      updateBroadCastObj.checkAndApprove = data.checkAndApprove;
    }

    const createAdminHistory = {
      admin_id: req.user._id,
      content_id: data.content_id,
      role: req.user.role,
      mode: data.mode,
      remarks: data.latestAdminRemark,
      action: data.isTempBlocked
        ? "isTempBlocked"
        : data.isPermanentBlocked
          ? "isPermanentBlocked"
          : "nothing",
    };

    const [editPublishedContent, history] = await Promise.all([
      db.updateItem(data.content_id, Content, updatePublishedContentObj),
      db.createItem(createAdminHistory, PublishedContentSummery),
    ]);

    res.status(200).json({
      code: 200,
      data: editPublishedContent,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getPublishedContentSummery = async (req, res) => {
  try {
    const data = req.params.content_id;

    const publishedContentSummery = await PublishedContentSummery.find({
      content_id: data
    }).populate('content_id admin_id');

    res.status(200).json({
      code: 200,
      publishedContentSummery,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getBroadCastHistory = async (req, res) => {
  try {
    const data = req.params;

    const { totalCount, broadCastList } = await db.getBroadCastHistory(
      BroadCastHistorySummery,
      data
    );

    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      broadCastList,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.purchasedPublication = async (req, res) => {
  try {
    const data = req.query;
    let paidPublication;
    if (data.id) {
      paidPublication = await Contents.findOne({ paid_status: "paid" }).populate('category_id tag_ids purchased_publication');

    } else {
      // paidPublication = await Contents.find({ paid_status: "paid" }).populate('category_id tag_ids purchased_publication')
      paidPublication = await db.purchasedContent(MediaHouse, data);
    }

    res.status(200).json({
      code: 200,
      paidPublication: paidPublication.purchasedPublication
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.hopperPublishedContent = async (req, res) => {
  try {
    const data = req.query;
    const { hopperPublishedContent, totalCount } = await db.hopperPublishedContent(User, data);

    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      hopperPublishedContent: hopperPublishedContent,
    });

  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.createOfficeDetails = async (req, res) => {
  try {
    const data = req.body;
    if (data.address) {
      data.address = JSON.parse(data.address);
    }
    const details = await db.createItem(data, AdminOfficeDetail);

    res.status(200).json({
      code: 200,
      details: details
    });

  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getOfficeDetails = async (req, res) => {
  try {
    const data = req.query;
    let details
    if (data.id) {
      details = await AdminOfficeDetail.findOne({ _id: data.id });
    } else {
      details = await AdminOfficeDetail.find();
    }

    res.status(200).json({
      code: 200,
      office_details: details
    });

  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.genralMgmt = async (req, res) => {
  try {
    const data = req.body;
    let details
    if (data.faq) {
      data.faqs = data.faqs.map((faq) => faq);
      details = await db.createItem(data, Faq);
    }
    if (data.policies) {
      details = await db.createItem(data, Privacy_policy);
    }
    if (data.legal_tc) {
      details = await db.createItem(data, Legal_terms);
    }
    if (data.doc) {
      details = await db.createItem(data, Docs);
    }
    if (data.comm) {
      details = await db.createItem(data, Commission_structure);
    }
    if (data.selling) {
      details = await db.createItem(data, Selling_price);
    }
    if (data.price_tips) {
      details = await db.createItem(data, Price_tips);
    }


    res.status(200).json({
      code: 200,
      genralMgmt: details
    });

  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getGenralMgmt = async (req, res) => {
  try {
    const data = req.query;
    let status
    if (data.faq == 'faq') {
      status = await Faq.findOne({ _id: mongoose.Types.ObjectId("644f5aad4d00543ca112a0a0") })
    }
    else if (data.privacy_policy == 'privacy_policy') {
      status = await Privacy_policy.findOne({ _id: mongoose.Types.ObjectId("6451fdba1cf5bd37568f92d7") })

    }
    else if (data.legal == 'legal') {
      status = await Legal_terms.findOne({ _id: mongoose.Types.ObjectId("6451fe39826b6b396ab2f5fb") })
    }
    else if (data.videos == 'videos') {
      status = await Tutorial_video.find({for:"marketplace"});
    }
    else if (data.doc == 'doc') {
      status = await Docs.findOne({ _id: mongoose.Types.ObjectId("645630f8404bd54c0bc53f64") });
    }

    res.status(200).json({
      code: 200,
      status
    });

  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getGenralMgmtApp = async (req, res) => {
  try {
    const data = req.query;
    let status
   
    if (data.type == 'privacy_policy') {
      status = await Privacy_policy.findOne({ _id: mongoose.Types.ObjectId("6458c3c7318b303d9b4755b3") })
    }
    else if (data.type == 'faq') {
      status = await Faq.find({ for:"app" });
    }
    else if (data.type == 'legal') {
      status = await Legal_terms.findOne({ _id: mongoose.Types.ObjectId("6458c35c5d09013b05b94e37") })
    }
    else if (data.type == 'commision') {
      status = await Commission_structure.findOne({ _id: mongoose.Types.ObjectId("6458c5d249bfb13f71e1b4a6") })
    }
    else if (data.type == 'selling_price') {
      status = await Selling_price.findOne({ _id: mongoose.Types.ObjectId("6458c5dc49bfb13f71e1b4a9") })
    }
    else if (data.type == 'videos') {
      status = await Tutorial_video.find({for:"app"});
    }
    else if (data.type == 'doc') {
      status = await Docs.findOne({ _id: mongoose.Types.ObjectId("6458c2c7b1574939748f24bd") });
    }
    else if (data.type == 'price_tips') {
      status = await Price_tips.findOne({ _id: mongoose.Types.ObjectId("6458c5e949bfb13f71e1b4ac") });
    }

    res.status(200).json({
      code: 200,
      status
    });

  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.updateGenralMgmtApp = async (req, res) => {
  try {
    const data = req.body;
    let status
    if (data.type == 'privacy_policy') {
      status = db.updateItem('6458c3c7318b303d9b4755b3', Privacy_policy, data);
      status = 'UPDATED';
    }
    else if (data.type == 'legal') {
      status = db.updateItem('6458c35c5d09013b05b94e37', Legal_terms, data);
      status = 'UPDATED';
    }
    else if (data.type == 'commission') {
      status = db.updateItem('6458c5d249bfb13f71e1b4a6', Commission_structure, data);
      status = 'UPDATED';
    }
    else if (data.type == 'selling_price') {
      status = db.updateItem('6458c5dc49bfb13f71e1b4a9', Selling_price, data);
      status = 'UPDATED';
    }
    else if (data.type == 'videos') {
      status = await db.createItem(data, Tutorial_video);
    }
    else if (data.type == 'doc') {
      const response = db.updateItem('6458c2c7b1574939748f24bd', Docs, data);
      status = response.nModified == 1 ? 'updated' : 'not_updated'
    }
    else if (data.type == 'price_tips') {
      const response = db.updateItem('6458c5e949bfb13f71e1b4ac', Price_tips, data);
      status = response.nModified == 1 ? 'updated' : 'not_updated'
    }

    res.status(200).json({
      code: 200,
      status
    });

  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.updateGenralMgmt = async (req, res) => {
  try {
    const data = req.body;
    let status
    if (data.type == 'faq') {
      response = await db.updateItem(data.id, Faq, data);
      status = response
    }
    else if (data.type == 'privacy_policy') {
      status = db.updateItem('6451fdba1cf5bd37568f92d7', Privacy_policy, data);
      status = 'UPDATED';
    }
    else if (data.type == 'legal') {
      status = db.updateItem('6451fe39826b6b396ab2f5fb', Legal_terms, data);
      status = 'UPDATED';
    }
    else if (data.type == 'videos') {
      status = await db.createItem(data, Tutorial_video);
    }
    else if (data.type == 'doc') {
      const response = db.updateItem('645630f8404bd54c0bc53f64', Docs, data);
      status = response.nModified == 1 ? 'updated' : 'not_updated'
    }

    res.status(200).json({
      code: 200,
      status
    });

  } catch (error) {
    utils.handleError(res, error);
  }
};


exports.uploadMultipleProjectImgs = async (req, res) => {
  try {
    let multipleImgs = [];
    let singleImg = [];
    const path = req.body.path;
    if (req.files && Array.isArray(req.files.images)) {
      for await (const imgData of req.files.images) {
        const data = await db.uploadFile({
          file: imgData,
          path: `${STORAGE_PATH}/${path}`,
        });
        multipleImgs.push(`https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${data}`);
      }
    } else if (req.files && !Array.isArray(req.files.images)) {
      var data = await db.uploadFile({
        file: req.files.images,
        path: `${STORAGE_PATH}/${path}`,
      });
      singleImg.push(`https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${data}`);
    }
    res.status(200).json({
      code: 200,
      imgs: req.files && Array.isArray(req.files.images) ? multipleImgs : singleImg
    })
  } catch (error) {
    utils.handleError(res, error);
  }
}

exports.purchasedContentSummery = async (req, res) => {
  try {
    const data = req.query;
    const purchasedContentSummery = await db.purchasedContentSummery(User, data)
    res.status(200).json({
      code: 200,
      purchasedContentSummery
    });
  } catch (error) {
    utils.handleError(res, error);
  }
}

exports.editpurchasedContentSummery = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updatePurchasedContentSummeryObj = {
      purchased_content_employee_id: req.user._id
    };

    const createAdminHistory = {
      admin_id: req.user._id,
      mode: data.mode,
      remarks: data.latestAdminRemark,
      latestAdminUpdated: new Date(),
      content_id: data.content_id,
      purchased_content_qty: data.purchased_content_qty,
      purchased_content_value: data.purchased_content_value,
      total_payment_recieved: data.total_payment_recieved
    };

    const [updatePurchasedContent,history] = await Promise.all([
      db.updateItem(data.content_id, Content, updatePurchasedContentSummeryObj),
      db.createItem(createAdminHistory, PurchasedContentHistory),
    ]);

    res.status(200).json({
      code: 200,
      data: history,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.purchasedContentHistory = async (req, res) => {
  try {
    res.status(200).json({
      code: 200,
      purchasedContentHistory: await PurchasedContentHistory.find().sort({createdAt:-1}).populate('admin_id content_id')
    });
  } catch (error) {
    utils.handleError(res, error);
  }
}

exports.sourcedContentSummery = async (req, res) => {
  try {
    const data = req.query;
    const sourcedContentSummery = await db.sourcedContentSummery(User, data)
    res.status(200).json({
      code: 200,
      sourcedContentSummery
    });
  } catch (error) {
    utils.handleError(res, error);
  }
}

exports.sourcedContentRemarksMode = async (req, res) => {
  try {
    const data = req.body;
    data.admin_id = req.user._id
    await db.updateItem(data.media_house_id, MediaHouse, {source_content_employee:data.admin_id});
    res.status(200).json({
      code: 200,
      sourcedContentSummeryCreated: await db.createItem(data, SourceContentHistory)
    });
  } catch (error) {
    utils.handleError(res, error);
  }
}

exports.sourcedContentHistory = async (req, res) => {
  try {
    res.status(200).json({
      code: 200,
      sourcedContentHistory: await SourceContentHistory.find().populate('media_house_id admin_id').sort({createdAt:-1})
    });
  } catch (error) {
    utils.handleError(res, error);
  }
}

exports.createFaq = async (req, res) => {
  try {
    const data = req.body;

    const faq = await db.createItem(data, Faq);

    res.status(200).json({
      code: 200,
      created: faq,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getFaq = async (req, res) => {
  try {
    const data = req.query;
    let faq
    if(data.faq_id){
      faq = await db.getItem(data.faq_id, Faq);
    }else{
      faq = await db.getItems(Faq, {for:data.for});
    }

    res.status(200).json({
      code: 200,
      faq,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const data = req.body;
    res.status(200).json({
      code: 200,
      status: await db.deleteItem(data.id, Faq)
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.deleteTutorials = async (req, res) => {
  try {
    res.status(200).json({
      code: 200,
      status: await db.deleteItem(req.body.id, Tutorial_video)
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};



exports.getMediaHouse = async (req, res) => {
  try {

    
           
    const getmediaHouse = await BroadCastTask.find({})
    .populate("mediahouse_id")
    .populate("category_id")
    .populate("admin_id");
    // const Employee = await Admin.find({})






    res.status(200).json({
      code: 200,
      status: getmediaHouse,
 
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};


exports.createMediaHouseHistory = async (req, res) => {
  try {
         
    const data = req.body

    const obj = {
      admin_id :req.user.id,
      latestAdminUpdated: new Date(),
      mediahouse_id:data.mediahouse_id,
      remarks:data.remarks,
      role:data.role,
      mode:data.mode
    }
    const updatePublicationObj = {
      latestAdminUpdated: new Date(),
      admin_id: req.user._id
    };
    
    

    const getmediaHouse = await mediaHousetaskHistory.create(obj)
    const update =   db.updateItem(data.mediahouse_id, mediaHousetaskHistory, updatePublicationObj)
    res.status(200).json({
      code: 200,
      response: getmediaHouse,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};





exports.getHopperDetails = async (req, res) => {
  try {
       
           
    const getmediaHouse = await mediaHousetaskHistory.findById(req.body.id).populate("admin_id").populate("mediahouse_id")






    res.status(200).json({
      code: 200,
      status: getmediaHouse,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};





exports.editMediaHouseTask = async (req, res) => {
  try {
    const data = req.body;

    const editedCategory = await db.updateItem(
      data.media_house_task_id,
      BroadCastTask,
      data
    );

    res.status(200).json({
      code: 200,
      response: editedCategory,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};



