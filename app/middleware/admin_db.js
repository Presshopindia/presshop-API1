var bcrypt = require("bcrypt");

const {
  buildSuccObject,
  buildErrObject,
  itemNotFound,
  handleError,
} = require("../middleware/utils");
const mongoose = require("mongoose");
const { lookup } = require("dns");
const { resolve } = require("path");
const { fileURLToPath } = require("url");
const { Console } = require("console");

/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort = (sort, order) => {
  const sortBy = {};
  sortBy[sort] = order;
  return sortBy;
};

/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 */

module.exports = {
  /**
   * Gets items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getItems(model, query, data, sort = { _id: -1 }, limit, offset) {
    return new Promise((resolve, reject) => {
      model
        .find(query, (err, items) => {
          if (err) {
            reject(buildErrObject(422, err.message));
          }
          resolve(items);
        }).populate(data)
        .sort(sort)
        .skip(Number(offset))
        .limit(Number(limit));
    });
  },


  async getItemsforAvatar(model, query, data, sort = { _id: -1 }, limit, offset) {
    return new Promise((resolve, reject) => {
      model
        .find(query, (err, items) => {
          if (err) {
            reject(buildErrObject(422, err.message));
          }
          resolve(items);
        })//.populate(data)
        .sort(sort)
        .skip(Number(offset))
        .limit(Number(limit));
    });
  },

  async getAllItems(model, query) {
    return new Promise((resolve, reject) => {
      model.find(query, (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve(items);
      });
    });
  },
  /**
   * Gets item from database by id
   * @param {string} id - item id
   */
  async getItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findById(id, (err, item) => {
        itemNotFound(err, item, reject, "NOT_FOUND");
        resolve(item);
      });
    });
  },

  /**
   * Gets item from database by id
   * @param {string} id - item id
   */
  async getItemCustom(condition, model) {
    return new Promise((resolve, reject) => {
      model.findOne(condition, (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve(item);
      });
    });
  },

  /**
   * Creates a new item in database
   * @param {Object} req - request object
   */
  async createItem(req, model) {
    return new Promise((resolve, reject) => {
      model.create(req, (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve(item);
      });
    });
  },

  /**
   * Updates an item in database by id
   * @param {string} id - item id
   * @param {Object} req - request object
   */
  async updateItem(id, model, req) {
    return new Promise((resolve, reject) => {
      model.findByIdAndUpdate(
        id,
        req,
        {
          new: true,
          runValidators: true,
        },
        (err, item) => {
          itemNotFound(err, item, reject, "NOT_FOUND");
          resolve(item);
        }
      );
    });
  },

  /**
   * Deletes an item from database by id
   * @param {string} id - id of item
   */
  async deleteItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findByIdAndRemove(id, (err, item) => {
        itemNotFound(err, item, reject, "NOT_FOUND");
        resolve(buildSuccObject("DELETED"));
      });
    });
  },

  async getHopperList(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          role: "Hopper",
          isPermanentBlocked: false,
        };
        if (data.status) {

          condition.status = data.status;
        }
        let filters = {}
        // if (data.Hoppers) {
        //   filters = {
        //     user_name: {
        //       $regex: new RegExp("^" + data.Hoppers + "$", "i")
        //     }
        //   }
        // }
        if (data.Hoppers) {
          const searchRegex = new RegExp(data.Hoppers, 'i') //{ $regex: datas.search, $options: 'i' };
          condition.$or = [
            {
              $or: [
                { user_name: searchRegex },
              ]
            }, {
              $expr: {
                $regexMatch: {
                  input: { $concat: ["$first_name", " ", "$last_name"] },
                  regex: searchRegex
                }
              }
            }
          ];
        }
        // if (data.class) {

        //   condition.category = data.class.toLowerCase();
        // }


        if (data.type) {
          data.type = data.type.split(",")
          condition.type = { $in: data.type }
        }


        if (data.category) {
          data.category = data.category.split(",")
          data.category = data.category.map((x) => mongoose.Types.ObjectId(x))
          condition.category = { $in: data.category }
        }
        if (data.startdate && data.endDate) {
          condition.createdAt = {
            $gte: new Date(data.startdate),
            $lte: new Date(data.endDate)
          }

        }
        if (data.location_search) {
          const searchRegex = new RegExp(data.location_search, 'i') //{ $regex: datas.search, $options: 'i' };
          condition.$or = [
            {
              $or: [
                { address: searchRegex },
              ]
            },
            // {
            //   $expr: {
            //     $regexMatch: {
            //       input: { $concat: ["$first_name", " ", "$last_name"] },
            //       regex: searchRegex
            //     }
            //   }
            // }

          ];

        }

        if (data.pendingDoc) {

          condition.doc_to_become_pro = { $exists: false }
        }

        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "avatars",
              localField: "avatar_id",
              foreignField: "_id",
              as: "avatarData",
            },
          },
          {
            $unwind: {
              path: "$avatarData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "user_id",
              foreignField: "_id",
              as: "adminData",
            },
          },
          {
            $lookup: {
              from: "ratings",
              let: { task_id: "$_id" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$from", "$$task_id"] }],
                    },
                  },
                },



                {
                  $addFields: {
                    value: "$rating"


                  },
                },
              ],
              as: "rating_byhopper",
            },
          },
          {
            $addFields: {
              ratingsforMediahouse: {
                $avg: "$rating_byhopper.rating",
              },
              latestrating: { $arrayElemAt: ["$rating_byhopper", -1] },
            },
          },
          {
            $match: filters
          },
          {
            $unwind: {
              path: "$adminData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              fullNameTest: {
                $concat: [{ $toLower: "$first_name" }, " ", { $toLower: "$last_name" }]
              }
            }
          },
          // {
          //   $sort: { fullName: 1 }
          // },

          // {
          //   $sort: { first_name: 1 },
          // },
        ];
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it


        if (data.hasOwnProperty("OldtoNew")) {
          facet.$facet.data.push(
            {
              $sort: { createdAt: 1 },
            },
          );
        }
        else if (data.hasOwnProperty("NewtoOld")) {
          facet.$facet.data.push(
            {
              $sort: { createdAt: -1 },
            },
          );
        } if (data.is_rated == "-1") {
          facet.$facet.data.push({
            $sort: { "latestrating.createdAt": -1 },
          });
        } else if (data.is_rated == "1") {
          facet.$facet.data.push({
            $sort: { "latestrating.createdAt": 1 },
          });
        } else {
          facet.$facet.data.push(
            {
              $sort: { fullNameTest: 1 },
            },
          );
        }
        // else {
        //   facet.$facet.data.push(
        //     {
        //       $sort: { first_name: 1 },
        //     },
        //   );
        // }

        if (data.hasOwnProperty("HighestRated")) {
          facet.$facet.data.push({
            $sort: { ratingsforMediahouse: -1 },
          })
        }

        if (data.hasOwnProperty("LowestRated")) {
          facet.$facet.data.push({
            $sort: { ratingsforMediahouse: 1 },
          })
        }
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }
        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);

        resolve({
          hopperList: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (error) {
        reject(buildErrObject(422, error));
      }
    });
  },

  async getHopperMgmtHistory(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          hopper_id: mongoose.Types.ObjectId(data.hopper_id),
        };
        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "users",
              let: { hopper_id: "$hopper_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$_id", "$$hopper_id"] }],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_details",
                  },
                },
                {
                  $unwind: {
                    path: "$avatar_details",
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
              as: "hopperData",
            },
          },
          {
            $unwind: {
              path: "$hopperData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "admin_id",
              foreignField: "_id",
              as: "adminData",
            },
          },
          {
            $unwind: {
              path: "$adminData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "categoriesData",
            },
          },
          {
            $unwind: {
              path: "$categoriesData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              "hopperData.bank_detail": 0,
              "hopperData.password": 0,
              "adminData.password": 0,
            },
          },
          {
            $sort: { _id: -1 },
          },
        ];
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }

        if (data.hasOwnProperty("OldtoNew")) {
          facet.$facet.data.push(
            {
              $sort: { createdAt: 1 },
            },
          );
        }

        if (data.hasOwnProperty("NewtoOld")) {
          facet.$facet.data.push(
            {
              $sort: { createdAt: -1 },
            },
          );
        }

        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);

        resolve({
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
          hopperHistory: result[0].data,
        });
      } catch (error) {
        reject(buildErrObject(422, error));
      }
    });
  },

  async getContentMgmtHistory(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          "content_id._id": mongoose.Types.ObjectId(data.content_id),
        };




        const params = [
          {
            $match: condition,
          },

          {
            $lookup: {
              from: "categories",
              localField: "content_id.category_id",
              foreignField: "_id",
              as: "category_id",
            },
          },
          {
            $unwind: {
              path: "$category_id",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "content_id.hopper_id",
              foreignField: "_id",
              as: "userData",
            },
          },
          {
            $unwind: {
              path: "$userData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "avatars",
              localField: "userData.avatar_id",
              foreignField: "_id",
              as: "avatar_details",
            },
          },
          {
            $unwind: {
              path: "$avatar_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          // {
          //   $lookup: {
          //     from: "admins",
          //     localField: "admin_id",
          //     foreignField: "_id",
          //     as: "adminData",
          //   },
          // },
          {
            $lookup: {
              from: "admins",
              let: {
                user_id: "$admin_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$user_id"] },
                  },
                },
              ],
              as: "adminData",
            },
          },
          {
            $unwind: {
              path: "$adminData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              // "hopperData.bank_detail": 0,
              // "hopperData.password": 0,
              "adminData.password": 0,
            },
          },
          {
            $sort: { _id: -1 },
          },
        ];
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }

        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);

        resolve({
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
          contnetMgmtHistory: result[0].data,
        });
      } catch (error) {
        reject(buildErrObject(422, error));
      }
    });
  },

  async getPublicationMgmtHistory(model, data, data2) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          publication_id: mongoose.Types.ObjectId(data.publication_id),
        };

        // sorting

        let sorting = { createdAt: -1 }

        if (data2.hasOwnProperty("NewtoOld")) {
          sorting = { createdAt: -1 }
        }

        if (data2.hasOwnProperty("OldtoNew")) {
          sorting = { createdAt: 1 }
        }

        // filters

        let filters = {}

        if (data2.Employee_search) {
          filters.Employee_name = { $regex: new RegExp("^" + data2.Employee_search + "$", "i") }
        }

        if (data2.startdate && data2.endDate) {
          filters = {
            $expr: {
              $and: [
                { $gte: ["$createdAt", new Date(data2.startdate)] },
                { $lte: ["$createdAt", new Date(data2.endDate)] }
              ]
            }
          }
        }

        if (data2.hasOwnProperty("Publishedcontent")) {
          filters = { status: "published" }
        }




        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "users",
              localField: "publication_id",
              foreignField: "_id",
              as: "publicationData",
            },
          },
          {
            $unwind: {
              path: "$publicationData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "admin_id",
              foreignField: "_id",
              as: "adminData",
            },
          },
          {
            $unwind: {
              path: "$adminData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "categoriesData",
            },
          },
          {
            $unwind: {
              path: "$categoriesData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              "publicationData.password": 0,
              "adminData.password": 0,
            },
          },
          {
            $addFields: {
              Employee_name: "$adminData.name"
            }
          },
          {
            $match: filters,
          },
          {
            $sort: sorting,
          },
        ];
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it
        if (data2.hasOwnProperty("limit") && data2.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data2.offset),
            },
            {
              $limit: Number(data2.limit),
            }
          );
        }

        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);

        resolve({
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
          publicationHistory: result[0].data,
        });
      } catch (error) {
        reject(buildErrObject(422, error));
      }
    });
  },

  async getContentList(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          is_draft: false,
          is_deleted: false
        };
        const condition1 = {
          // is_draft: false,
        };


        if (data.status) {
          if (data.status == "rejected") {
            condition.is_deleted = true
          } else {
            condition.status = data.status;
          }
        }

        if (data.sale_status == "sold") {
          // condition.is_deleted = true
          condition.sale_status = "sold";
        }


        if (data.type) {
          // condition.is_deleted = true
          condition.type = data.type;
        }
        if (data.is_deleted == "true") {
          // condition.is_deleted = true
          delete condition.is_deleted
          condition.is_deleted = true
        }

        if (data.sale_status == "unsold") {
          condition.sale_status = "unsold";
        }
        if (data.category) {
          condition.category_id = mongoose.Types.ObjectId(data.category);
        }

        if (data.startPrice && data.endPrice) {
          condition.ask_price = {
            $gte: data.startPrice,
            $lte: data.endPrice,

          }
        }
        if (data.status == "published" && data.startdate && data.endDate) {
          condition.published_time_date = {
            $gte: new Date(data.startdate),
            $lte: new Date(data.endDate)
          }
        }
        else if (data.startdate && data.endDate) {
          condition.createdAt = {
            $gte: new Date(data.startdate),
            $lte: new Date(data.endDate)
          }
        }
        if (data.search) {
          const like = { $regex: data.search, $options: "i" };
          condition.location = like;
          // condition.description = like
        }

        if (data.Hoppers) {
          const searchRegex = new RegExp(data.Hoppers, 'i')
          // condition1.hopper_name = searchRegex 
          condition1.$or = [
            {
              $or: [
                { "hopper_id.user_name": searchRegex },
                { hopper_name: searchRegex },
              ]
            },
          ];
          //{ $regex: data.Hoppers, $options: "i" }
        }

        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "users",
              let: { hopper_id: "$hopper_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$_id", "$$hopper_id"] }],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_detail",
                  },
                },
                {
                  $unwind: {
                    path: "$avatar_detail",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: 1,
                    address: 1,
                    avatar_detail: 1,
                    user_name: 1,
                    first_name: 1,
                    last_name: 1
                  }
                }
              ],
              as: "hopper_id",
            },
          },

          {
            $unwind: {
              path: "$hopper_id",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $addFields: {
              hopper_name: {
                $concat: ["$hopper_id.first_name", " ", "$hopper_id.last_name"]
              },
              content_length: {
                
                $size: { $ifNull: ["$content", []] }
              
            },
            }
          },
          {
            $match: condition1,
          },
          {
            $lookup: {
              from: "admins",
              localField: "user_id",
              foreignField: "_id",
              as: "admin_details",
            },
          },
          {
            $unwind: {
              path: "$admin_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tagData",
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "categoryData",
            },
          },
          {
            $unwind: {
              path: "$categoryData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields:{
              category_name:"$categoryData.name"
            }
          },
          {
            $lookup: {
              from: "hopperpayments",
              localField: "_id",
              foreignField: "content_id",
              as: "purchasedContent",
              pipeline: [
                {
                  $lookup: {
                    from: "users",
                    localField: "media_house_id",
                    foreignField: "_id",
                    as: "purchased_mediahouses"
                  }
                },
                {
                  $project: {
                    _id: 1,
                    "purchased_mediahouses.docs": 1,
                    "purchased_mediahouses.profile_image": 1,
                    "purchased_mediahouses.company_name": 1,
                    "purchased_mediahouses.full_name": 1,
                    "purchased_mediahouses.company_bank_details": 1,

                  }
                }
              ]
            },
          },

          {
            $lookup: {
              from: "users",
              localField: "purchased_publication",
              foreignField: "_id",
              as: "purchased_publication",
            },
          },

          {
            $unwind: {
              path: "$purchased_publication",
              preserveNullAndEmptyArrays: true,
            },
          },

          // getContentList
          // {
          //   $sort: { published_time_date: -1 },
          // },
        ];

        if (data.status == "published") {
          params.push(
            {
              $sort: { published_time_date: -1 },
            },
          );
        }
        if (data.status == "pending") {
          params.push(
            {
              $sort: { createdAt: -1 },
            },
          );
        }
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        // if(data.status == "published") {
        //   facet.$facet.data.push(
        //     {
        //       $sort: { published_time_date: -1 },
        //     },
        //   );
        // } 
        // if (data.status == "pending") {
        //   facet.$facet.data.push(
        //     {
        //       $sort: { createdAt: -1 },
        //     },
        //   );
        // }

        //check if limit or offset in data object then fetch data accordint to it

        if (data.hasOwnProperty("OldtoNew")) {
          facet.$facet.data.push(
            {
              $sort: { createdAt: 1 },
            },
          );
        }
        if (data.hasOwnProperty("NewtoOld")) {
          facet.$facet.data.push(
            {
              $sort: { createdAt: -1 },
            },
          );
        }
        if (data.hasOwnProperty("highpaymentrecived")) {
          facet.$facet.data.push(
            {
              $sort: { amount_paid: -1 },
            },
          );
        }
        if (data.hasOwnProperty("lowpaymentrecived")) {
          facet.$facet.data.push(
            {
              $sort: { amount_paid: 1 },
            },
          );
        }
        if (data.hasOwnProperty("Highestpricedcontent")) {
          facet.$facet.data.push(
            {
              $sort: { amount_payable_to_hopper: -1 },
            },
          );
        }
        if (data.hasOwnProperty("Lowestpricedcontent")) {
          facet.$facet.data.push(
            {
              $sort: { amount_payable_to_hopper: 1 },
            },
          );
        }
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            // {
            //   $sort: { updatedAt: -1 },
            // },
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            },
          );
        }

        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          contentList: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async getContenthistoryList(model, data, data2) {
    return new Promise(async (resolve, reject) => {
      try {
        // const condition = {
        //   is_draft: false,
        // };

        // if (data.status) {
        //   condition.status = data.status;
        // }
        const dataLimit = data2.limit ? Number(data2.limit) : Number.MAX_SAFE_INTEGER;
        const dataOffset = data2.offset ? Number(data2.offset) : 0;

        // sorting
        const condition = { createdAt: -1 }
        if (data2.hasOwnProperty("NewtoOld")) {
          condition.createdAt = -1
        }

        if (data2.hasOwnProperty("OldtoNew")) {
          condition.createdAt = 1
        }

        if (data2.hasOwnProperty("Highestpricedcontent")) {
          condition.ask_price = -1
        }

        if (data2.hasOwnProperty("Lowestpricedcontent")) {
          condition.ask_price = 1
        }

        // Filters

        let filters = {}

        if (data2.startdate && data2.endDate) {
          filters = {
            $expr: {
              $and: [
                { $gte: ["$createdAt", new Date(data2.startdate)] },
                { $lte: ["$createdAt", new Date(data2.endDate)] }
              ]
            }
          }
        }

        if (data2.startPrice && data2.endPrice) {
          filters = {
            askPrice: {
              $gte: parseInt(data2.startPrice),
              $lte: parseInt(data2.endPrice)
            }
          }
        }

        if (data2.hasOwnProperty("Publishedcontent")) {
          filters = { content_status: "published" }
        }

        if (data2.category_search) {
          filters = { Category_name: new RegExp("^" + data2.category_search + "$", "i") }
        }

        if (data2.Licence_search) {
          filters = { Licence: new RegExp("^" + data2.Licence_search + "$", "i") }
        }


        const params = [
          //  {
          //    $match: {
          //      $expr: {
          //        $and: [{ $eq: ["content_id", mongoose.Types.ObjectId(data.content_id)] }],
          //      },
          //    },
          //  },
          {
            $match: { content_id: mongoose.Types.ObjectId(data.content_id) },
          },
          {
            $lookup: {
              from: "contents",
              localField: "content_id",
              foreignField: "_id",
              as: "content_id",
            },
          },

          { $unwind: "$content_id" },

          // {
          //   $match: { content_id: mongoose.Types.ObjectId(data.content_id) },
          // },
          {
            $lookup: {
              from: "categories",
              let: { task_id: "$content_id" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$_id", "$$task_id.category_id"] }],
                    },
                  },
                },
              ],
              as: "category_details",
            },
          },
          { $unwind: "$category_details" },

          {
            $lookup: {
              from: "admins",
              localField: "admin_id",
              foreignField: "_id",
              as: "admin_id",
            },
          },
          {
            $lookup: {
              from: "users",
              let: { task_id: "$content_id" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$_id", "$$task_id.hopper_id"] }],
                    },
                  },
                },
              ],
              as: "hopper_details",
            },
          },
          { $unwind: "$hopper_details" },

          {
            $lookup: {
              from: "avatars",
              let: { hopper_id: "$hopper_details" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$_id", "$$hopper_id.avatar_id"] }],
                    },
                  },
                },
                // {
                //   $addFields:{
                //     console:"$$task_id"
                //   }
                // }
              ],
              as: "avatar_detals",
            },
          },
          {
            $addFields: {
              content_status: "$content_id.status"
            }
          },
          {
            $addFields: {
              askPrice: "$content_id.ask_price"
            }
          },
          {
            $addFields: {
              Category_name: "$category_details.name"
            }
          },
          {
            $addFields: {
              Licence: "$content_id.type"
            }
          },
          {
            $match: filters
          },
          {
            $sort: condition
          },
          {
            $skip: dataOffset,
          },
          {
            $limit: dataLimit,
          },

          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "content_id.purchased_publication",
          //     foreignField: "_id",
          //     as: "purchased_publication_details",
          //   },
          // },

          // { $unwind: "$purchased_publication_details" },
        ];
        // const facet = {
        //   //use facet to get total count and data according to limit offset
        //   $facet: {
        //     data: [
        //       {
        //         $match: { ...condition },
        //       },
        //     ],
        //     totalCount: [
        //       {
        //         $count: "count",
        //       },
        //     ],
        //   },
        // };
        //check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data2.offset),
            },
            {
              $limit: Number(data2.limit),
            }
          );
        }

        // params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          contentList: result,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async getPublicationList(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          role: "MediaHouse",
          isPermanentBlocked: false
        };

        if (data.status) {
          condition.status = data.status;
        }

        // sorting

        let sorting = { createdAt: -1 }

        if (data.hasOwnProperty("NewtoOld")) {
          sorting = { createdAt: -1 }
        }

        if (data.hasOwnProperty("OldtoNew")) {
          sorting = { createdAt: 1 }
        }

        if (data.hasOwnProperty("HighestRated")) {
          sorting = { ratingsforMediahouse: -1 }
        }

        if (data.hasOwnProperty("LowestRated")) {
          sorting = { ratingsforMediahouse: 1 }
        }
        if (data.is_rated == "-1") {
          sorting = { "latestrating.createdAt": -1 }
        } else if (data.is_rated == "1") {
          sorting = { "latestrating.createdAt": 1 }
        } 

        // filters
        let filters = {}

        if (data.Publication_search) {
          const searchRegex = new RegExp(data.Publication_search, 'i')
          condition.$or = [
            {
              $or: [
                { company_name: searchRegex },
              ]
            },
          ];
        }

        if (data.startdate && data.endDate) {
          condition.createdAt = { $lte: new Date(data.endDate), $gte: new Date(data.startdate) }
          // filters = {
          //   $expr: {
          //     $and: [
          //       { $gte: ["$createdAt", new Date(data.startdate)] },
          //       { $lte: ["$createdAt", new Date(data.endDate)] }
          //     ]
          //   }
          // }
        }


        if (data.PedingDocuments) {
          condition.upload_docs = { $exists: true }
        }

        if (data.search) {
          const searchRegex = new RegExp(data.search, 'i')
          condition["office_details.address.complete_address"] = searchRegex
        }

        if (data.hasOwnProperty("PendingPublications")) {
          filters = { status: "pending" }
        }

        if (data.Action === "Temporaryblocked") {
          filters = { action: "isTempBlocked" }
        }

        if (data.Action === "Permanentblocked") {
          filters = { action: "isPermanentBlocked" }
        }

        // if(data.Location_search){
        //   filters = {complete_address: new RegExp(data.Location_search , 'i')}
        // }


        const params = [
          {
            $match: condition,
          },

          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "media_house_id",
              as: "mediahouseusers",
            },
          },
          {
            $addFields: {
              mediaHouse_user: {
                $size: "$mediahouseusers",
              },
            }
          },

          {
            $project: {
              mediahouseusers:0
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "user_type_id",
              foreignField: "_id",
              as: "user_type_detail",
            },
          },
          {
            $unwind: { path: "$user_type_detail", preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: "avatars",
              localField: "avatar_id",
              foreignField: "_id",
              as: "avatarData",
            },
          },
          {
            $unwind: {
              path: "$avatarData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "user_id",
              foreignField: "_id",
              as: "adminData",
            },
          },
          {
            $unwind: {
              path: "$adminData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "ratings",
              let: { task_id: "$_id" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$from", "$$task_id"] }],
                    },
                  },
                },



                {
                  $addFields: {
                    value: "$rating"


                  },
                },
              ],
              as: "rating_byhopper",
            },
          },
          // {
          //   $unwind: {
          //     path: "$rating_byhopper",
          //     preserveNullAndEmptyArrays: true,
          //   },
          // },
          {
            $addFields: {
              console: "$_id",
              latestrating: { $arrayElemAt: ["$rating_byhopper", -1] },
            },
          },
          //   { $group: {
          //     _id: "$_id", // Field for grouping, replace with your own field
          //     // averageValue: { $avg: "$rating_byhopper.rating" } // Field to average within each group, replace with your own field
          //   }
          // },

          {
            $addFields: {
              ratingsforMediahouse: {
                $avg: "$rating_byhopper.rating",
              },
            },
          },

          // {
          //   $addFields: {
          //     // uploadedcontent: "$task_id",
          //     // acceptedby: "$acepted_task_id",
          //     rating: { $avg: "$rating_byhopper.rating" },

          //   },
          // },

          {
            $match: filters
          },

          {
            $sort: sorting
          },
        ];
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }

        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          publicationList: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async getEmployees(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          role: "subAdmin",
        };

        let sortBy = { createdAt: -1 }

        if (data.hasOwnProperty("NewtoOld")) {
          sortBy = {
            createdAt: -1
          }
        }

        if (data.hasOwnProperty("OldtoNew")) {
          sortBy = {
            createdAt: 1
          }
        }

        let filters = {}

        if (data.Employee_search) {
          filters = {
            name: {
              $regex: data.Employee_search, $options: "i"
            }
          }
        }


        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "admins",
              localField: "creator_id",
              foreignField: "_id",
              as: "creatorAdminData",
            },
          },

          {
            $unwind: {
              path: "$creatorAdminData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "designation_id",
              foreignField: "_id",
              as: "designationData",
            },
          },
          {
            $unwind: {
              path: "$designationData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "department_id",
              foreignField: "_id",
              as: "departmentData",
            },
          },
          {
            $unwind: {
              path: "$departmentData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "adminofficedetails",
              localField: "office_id",
              foreignField: "_id",
              as: "officeDetails",
            },
          },
          {
            $unwind: {
              path: "$officeDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "admin_id",
              foreignField: "_id",
              as: "admin_details",
            },
          },
          {
            $unwind: {
              path: "$admin_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: filters
          },

          {
            $sort: sortBy,
          },
        ];
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }

        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          emplyeeList: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async getTaskList(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          // is_draft: false,
        };

        if (data.status) {
          condition.status = data.status;
        }


        if (data.search) {
          const like = { $regex: data.search, $options: "i" };
          condition.heading = like;
          condition.description = like
        }

        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "uploadcontents",
              let: { task_id: "$_id" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$task_id", "$$task_id"] }],
                    },
                  },
                },
                {
                  $addFields: {
                    imagecount: {
                      $cond: {
                        if: { $eq: ["$type", "image"] },
                        then: 1,
                        else: 0,
                      },
                    },

                    videocount: {
                      $cond: {
                        if: { $eq: ["$type", "video"] },
                        then: 1,
                        else: 0,
                      },
                    },
                    interviewcount: {
                      $cond: {
                        if: { $eq: ["$type", "interview"] },
                        then: 1,
                        else: 0,
                      },
                    },

                    // totalDislikes: { $sum: "$dislikes" }
                  },
                },
              ],
              as: "uploaded_content",
            },
          },

          {
            $addFields: {
              // uploadedcontent: "$task_id",
              // acceptedby: "$acepted_task_id",
              image_count: { $sum: "$uploaded_content.imagecount" },
              video_count: { $sum: "$uploaded_content.videocount" },
              interview_count: { $sum: "$uploaded_content.interviewcount" },

              // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "mediahouse_id",
              foreignField: "_id",
              as: "mediahouse_id",
            },
          },
          {
            $unwind: {
              path: "$mediahouse_id",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user_id",
            },
          },
          {
            $unwind: {
              path: "$user_id",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "admin_id",
              foreignField: "_id",
              as: "admin_id",
            },
          },
          {
            $unwind: {
              path: "$admin_id",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id",
            },
          },
          {
            $unwind: {
              path: "$category_id",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: { _id: -1 },
          },
        ];
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }

        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          contentList: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async getBroadCastHistory(model, data, data2) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          broadCast_id: mongoose.Types.ObjectId(data.broadcast_id),
        };

        if (data.status) {
          condition.status = data.status;
        }
        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "tasks",
              // localField: "broadCast_id",
              // foreignField: "_id",
              let: {
                broadCast_id: "$broadCast_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$broadCast_id"] },
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "mediahouse_id",
                    foreignField: "_id",
                    as: "media_house_detail",
                  },
                },
                {
                  $unwind: {
                    path: "$media_house_detail",
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
              as: "broadCastData",
            },
          },
          {
            $unwind: {
              path: "$broadCastData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "admin_id",
              foreignField: "_id",
              as: "adminData",
            },
          },
          {
            $unwind: {
              path: "$adminData",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $sort: { _id: -1 },
          },
        ];
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it
        if (data2.hasOwnProperty("limit") && data2.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data2.offset),
            },
            {
              $limit: Number(data2.limit),
            }
          );
        }
        console.log("data------", data2.offset);
        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          broadCastList: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async getPublishedContentSummery(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          content_id: mongoose.Types.ObjectId(data.content_id),
        };

        if (data.status) {
          condition.status = data.status;
        }
        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "contents",
              let: {
                content_id: "$content_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$content_id"] },
                  },
                },
                {
                  $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "categoryDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$categoryDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "hopper_id",
                    foreignField: "_id",
                    as: "hopperDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$hopperDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
              as: "publishedContentSummery",
            },
          },
          {
            $unwind: {
              path: "$publishedContentSummery",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "admin_id",
              foreignField: "_id",
              as: "adminData",
            },
          },
          {
            $unwind: {
              path: "$adminData",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $sort: { _id: -1 },
          },
        ];
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }

        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          publishedContentSummery: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async hopperPublishedContent(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          role: "Hopper",
        };

        if (data.status) {
          condition.status = data.status;
        }
        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "contents",
              localField: "_id",
              foreignField: "hopper_id",
              as: "content_details",
            },
          },
          {
            $addFields: {
              published_content: {
                $size: "$content_details",
              },
            },
          },
          {
            $addFields: {
              published_content_value: {
                $sum: "$content_details.ask_price",
              },
            },
          },
          {
            $addFields: {
              total_payment_earned: {
                $sum: "$content_details.amount_paid",
              },
            },
          },
          // {
          //   $addFields: {
          //     pending_payment: 0
          //   }
          // },
          // {
          //   $addFields: {
          //     hopper_commision: 20
          //   }
          // },
          // {
          //   $unwind: {
          //     path: "$content_details",
          //     preserveNullAndEmptyArrays: true,
          //   }
          // },
          // {
          //   $group: {
          //     _id: "$_id",
          //     // published_content: { $sum: "$content_details.hopper_id" }
          //   }
          // },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "user_id",
          //     foreignField: "_id",
          //     as: "user_id",
          //   },
          // },
          // {
          //   $unwind: {
          //     path: "$user_id",
          //     preserveNullAndEmptyArrays: true,
          //   }
          // },
          // {
          //   $lookup: {
          //     from: "categories",
          //     localField: "category_id",
          //     foreignField: "_id",
          //     as: "category_id",
          //   },
          // },
          // {
          //   $unwind: {
          //     path: "$category_id",
          //     preserveNullAndEmptyArrays: true,
          //   },
          // },

          {
            $sort: { _id: -1 },
          },
        ];
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }

        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          hopperPublishedContent: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },
  async updateFaqs(model, body) {
    return new Promise((resolve, reject) => {
      const update = model.update(
        {
          _id: mongoose.Types.ObjectId(body.id),
          faqs: {
            $elemMatch: { _id: mongoose.Types.ObjectId(body.faq_id) },
          },
        },
        {
          $set: {
            "faqs.$.Question": body.question,
            "faqs.$.Answer": body.answer,
          },
        }
      );
      resolve(update);
    });
  },
  async updatePrivacyPlocies(model, body) {
    return new Promise((resolve, reject) => {
      const update = model.update(
        {
          _id: mongoose.Types.ObjectId(body.id),
          policies: {
            $elemMatch: { _id: mongoose.Types.ObjectId(body.policy_id) },
          },
        },
        {
          $set: {
            "policies.$.Question": body.question,
            "policies.$.Answer": body.answer,
          },
        }
      );
      resolve(update);
    });
  },
  async uploadFile(object) {
    return new Promise((resolve, reject) => {
      var obj = object.file;
      console.log("obj", obj);
      var name = Date.now() + obj.name;
      obj.mv(object.path + "/" + name, function (err) {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve(name);
      });
    });
  },
  async updateLegalTerms(model, body) {
    return new Promise((resolve, reject) => {
      const update = model.update(
        {
          _id: mongoose.Types.ObjectId(body.id),
          terms: {
            $elemMatch: { _id: mongoose.Types.ObjectId(body.term_id) },
          },
        },
        {
          $set: {
            "terms.$.Question": body.question,
            "terms.$.Answer": body.answer,
          },
        }
      );
      resolve(update);
    });
  },

  async updateDocs(model, body) {
    return new Promise((resolve, reject) => {
      const update = model.update(
        {
          _id: mongoose.Types.ObjectId(body.id),
          docs: {
            $elemMatch: { _id: mongoose.Types.ObjectId(body.doc_id) },
          },
        },
        {
          $set: {
            "docs.$.doc_name": body.doc_name,
          },
        }
      );
      resolve(update);
    });
  },

  async purchasedContentSummery(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          // "payments.paid_status": "paid",
          // role:"MediaHouse"
        };
        const params = [
          // {
          //   $lookup: {
          //     from: "hopperPayment",
          //     let: {
          //       media_house_id: "$media_house_id",
          //     },
          //     pipeline: [
          //       {
          //         $match: {
          //           $expr: { $eq: ["$_id", "$$media_house_id"] },
          //         },
          //       },
          //       // {
          //       //   $lookup: {
          //       //     from: "users",
          //       //     localField: "hopper_id",
          //       //     foreignField: "_id",
          //       //     as: "hopper_details",
          //       //   },
          //       // },
          //       // {
          //       //   $unwind: {
          //       //     path: "$hopper_details",
          //       //     preserveNullAndEmptyArrays: true,
          //       //   },
          //       // },
          //     ],
          //     as: "payments",
          //   },
          // },

          {
            $lookup: {
              from: "hopperpayments",
              localField: "media_house_id",
              foreignField: "_id",
              as: "payments",
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "purchased_content_employee_id",
              foreignField: "_id",
              as: "employee_details",
            },
          },
          {
            $unwind: {
              path: "$employee_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: condition,
          },
          {
            $addFields: {
              purchased_qty: {
                $size: "$payments",
              },
            },
          },
          {
            $addFields: {
              purchased_content: {
                $sum: "$payments.amount",
              },
            },
          },
          {
            $addFields: {
              total_payment_recevied: {
                $sum: "$payments.amount",
              },
            },
          },
          // {
          //   $project: {
          //     "payments": 0,
          //   },
          // },
          {
            $sort: { _id: -1 },
          },
        ];
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }

        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          purchasedContentSummery: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  // async purchasedContentSummery(model, data) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const condition = {
  //         // "payments.paid_status": "paid",
  //       };
  //       const params = [
  //         {
  //           $lookup: {
  //             from: "users",
  //             localField: "hopper_id",
  //             foreignField: "_id",
  //             as: "hopper_details",
  //           },
  //         },
  //         {
  //           $unwind: {
  //             path: "$hopper_details",
  //             preserveNullAndEmptyArrays: true,
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "users",
  //             localField: "media_house_id",
  //             foreignField: "_id",
  //             as: "media_house_details",
  //           },
  //         },
  //         {
  //           $unwind: {
  //             path: "$media_house_details",
  //             preserveNullAndEmptyArrays: true,
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "admins",
  //             localField: "admin_id",
  //             foreignField: "_id",
  //             as: "admin_details",
  //           },
  //         },
  //         {
  //           $unwind: {
  //             path: "$admin_details",
  //             preserveNullAndEmptyArrays: true,
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "contents",
  //             localField: "content_id",
  //             foreignField: "_id",
  //             as: "content_details",
  //           },
  //         },
  //         {
  //           $unwind: {
  //             path: "$content_details",
  //             preserveNullAndEmptyArrays: true,
  //           },
  //         },
  //         // {
  //         //   $match: condition,
  //         // },
  //         // {
  //         //   $addFields: {
  //         //     purchased_qty: {
  //         //       $size: "$payments",
  //         //     },
  //         //   },
  //         // },
  //         // {
  //         //   $addFields: {
  //         //     purchased_content: {
  //         //       $sum: "$payments.amount",
  //         //     },
  //         //   },
  //         // },
  //         // {
  //         //   $addFields: {
  //         //     total_payment_recevied: {
  //         //       $sum: "$payments.amount",
  //         //     },
  //         //   },
  //         // },
  //         // {
  //         //   $project: {
  //         //     "payments": 0,
  //         //   },
  //         // },
  //         {
  //           $sort: { _id: -1 },
  //         },
  //       ];
  //       const facet = {
  //         //use facet to get total count and data according to limit offset
  //         $facet: {
  //           data: [
  //             {
  //               $match: { ...condition },
  //             },
  //           ],
  //           totalCount: [
  //             {
  //               $count: "count",
  //             },
  //           ],
  //         },
  //       };
  //       //check if limit or offset in data object then fetch data accordint to it
  //       if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
  //         facet.$facet.data.push(
  //           {
  //             $skip: Number(data.offset),
  //           },
  //           {
  //             $limit: Number(data.limit),
  //           }
  //         );
  //       }

  //       params.push(facet); //finally push facet in params
  //       const result = await model.aggregate(params);
  //       resolve({
  //         purchasedContentSummery: result[0].data,
  //         totalCount: result[0].totalCount[0]
  //           ? result[0].totalCount[0].count
  //           : 0,
  //       });
  //     } catch (err) {
  //       reject(buildErrObject(422, err.message));
  //     }
  //   });
  // },

  async sourcedContentSummery(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(data);

        const condition = {
          // _id: mongoose.Types.ObjectId(data),
          // role: "MediaHouse",
        };
        let condition2 = { createdAt: -1 }

        if (data.hasOwnProperty("NewtoOld")) {
          condition2 = { createdAt: -1 }
        }

        if (data.hasOwnProperty("OldtoNew")) {
          condition2 = { createdAt: 1 }
        }

        if (data.hasOwnProperty("Highestpaymentreceived")) {
          condition2 = { total_payment_received: -1 }
        }

        if (data.hasOwnProperty("Lowestpaymentreceived")) {
          condition2 = { total_payment_received: 1 }
        }

        if (data.hasOwnProperty("Highestpricedtask")) {
          condition2 = { purchased_content_value: -1 }
        }

        if (data.hasOwnProperty("Lowestpricedtask")) {
          condition2 = { purchased_content_value: 1 }
        }

        // adding filter

        const condition3 = {}



        if (data.media_house_id) {
          condition3.mediaHhouse_id = mongoose.Types.ObjectId(
            data.media_house_id
          )
        }


        if (data.sale_status == true || data.sale_status == "sold") {
          condition.purchased_qty = { $gt: 0 }
          // condition3 = {
          //   $expr: {
          //     $eq: ["$sourcedContentSummary.paid_status", "paid"],
          //   },
          // }
        }


        if (data.sale_status == "unsold" || data.sale_status == false) {
          condition.purchased_qty = { $eq: 0 }
          // condition3 = {
          //   $expr: {
          //     $eq: ["$sourcedContentSummary.paid_status", "unpaid"],
          //   },
          // };
        }


        if (data.startPrice && data.endPrice) {
          condition3.ask_price = {
            $lte: data.endPrice,
            $gte: data.startPrice,
          }
        }


        if (data.startdate && data.enddate) {
          condition3.created_at = {
            $lte: data.endDate,
            $gte: data.startdate,
          }
        }
        if (data.search) {
          const like = { $regex: data.search, $options: "i" };
          condition3.heading = like;
          condition3.description = like
        }

        // if (data.Publication_search) {
        //   condition3.company_name = { $regex: new RegExp("^" + data.Publication_search + "$", "i") }
        // }
        if (data.Publication_search) {
          const searchRegex = new RegExp(data.Publication_search, 'i')
          condition3.$or = [
            {
              $or: [
                { company_name: searchRegex },
              ]
            },
          ];
        }

        if (data.hasOwnProperty("Paymentreveived")) {
          condition3.total_payment_received = { $gt: 0 }
        }

        if (data.hasOwnProperty("Paymentreveivable")) {
          condition3.total_payment_receivable = { $gt: 0 }
        }

        if (data.hasOwnProperty("Paymentpaid")) {
          condition3.total_amount_paid = { $gt: 0 }
        }

        if (data.hasOwnProperty("Paymentpayable")) {
          condition3.total_amount_payable = { $gt: 0 }
        }
        const params = [
          {
            $lookup: {
              from: "users",
              localField: "mediahouse_id",
              foreignField: "_id",
              as: "media_house_details",
            },
          },
          {
            $unwind: {
              path: "$media_house_details",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: "$mediahouse_id",
              company_name: { $first: "$media_house_details.company_name" },
              profile_image: { $first: "$media_house_details.profile_image" },
              admin: { $first: "$media_house_details.source_content_employee" },
              mode: { $first: "$media_house_details.mode" },
              remarks: { $first: "$media_house_details.remarks" },
              createdAt: { $first: "$media_house_details.createdAt" },
              updatedAt: { $first: "$media_house_details.updatedAt" },
              sourcedContentSummary: { $push: "$$ROOT" },
            },
          },
          {
            $addFields: {
              mediaHhouse_id: "$_id"
              // "$sourcedContentSummary.media_house_details._id",
            }
          },
          // {
          //   $unwind: {
          //     path: "$mediaHhouse_id",
          //     preserveNullAndEmptyArrays: true,
          //   },
          // },
          {
            $lookup: {
              from: "admins",
              let: {
                admin_id: "$admin",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$admin_id"],
                    },
                  },
                },
              ],
              as: "admin_data",
            },
          },
          {
            $unwind: {
              path: "$admin_data",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: "hopperpayments",
              let: { contentIds: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$media_house_id", "$$contentIds"] },
                        { $eq: ["$paid_status_for_hopper", true] },
                        // { $eq: ["$content_id", "$$id"] },
                        { $eq: ["$type", "task_content"] },
                      ],
                    },
                  },
                },
              ],
              as: "transictions_true",
            },
          },


          {
            $lookup: {
              from: "hopperpayments",
              let: { contentIds: "$_id", },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$media_house_id", "$$contentIds"] },
                        // { $eq: ["$paid_status_for_hopper", false] },
                        // { $eq: ["$content_id", "$$id"] },
                        { $eq: ["$type", "task_content"] },
                      ],
                    },
                  },
                },
              ],
              as: "transictions_false",
            },
          },


          {
            $addFields: {
              sourcedContentSumSize: {
                $size: "$sourcedContentSummary",
              },
              // purchased_qty: {
              //   $size: {
              //     $filter: {
              //       input: "$sourcedContentSummary",
              //       as: "currdata",
              //       cond: { $eq: ["$$currdata.paid_status", "paid"] },
              //     },
              //   },
              // },
              // sale_status: "$sourcedContentSummary.paid_status",         

              total_stripe_fee: {
                $sum: "$transictions_false.stripe_fee",
              },

              total_presshop_commission: {
                $sum: "$transictions_false.presshop_commission",
              },
              total_amount_payable: {
                $sum: "$transictions_false.payable_to_hopper",
              },
              total_amount_paid: {
                $sum: "$transictions_true.amount_paid_to_hopper",
              },
              total_amount_recieved: {
                $sum: "$transictions_false.amount",
              },
              purchased_qty: {
                $size: "$transictions_false",
              },
              // total_payment_receivable:{
              //   $sum: "$transictions_false.amount",
              // }
            },
          },
          {
            $addFields: {
              task_id: "$sourcedContentSummary._id"
            }
          },

          {
            $addFields: {
              purchased_content_value: {
                $reduce: {
                  input: "$sourcedContentSummary",
                  initialValue: 0,
                  in: {
                    $sum: [
                      "$$value",
                      "$$this.photo_price",
                      "$$this.videos_price",
                      "$$this.interview_price",
                    ],
                  },
                },
              },
              total_payment_receivable: {
                $reduce: {
                  input: "$sourcedContentSummary",
                  initialValue: 0,
                  in: {
                    $sum: [
                      "$$value",
                      "$$this.photo_price",
                      "$$this.videos_price",
                      "$$this.interview_price",
                    ],
                  },
                },
              },
              total_payment_received: {
                $reduce: {
                  input: "$sourcedContentSummary",
                  initialValue: 0,
                  in: {
                    $sum: ["$$value", "$$this.received_amount"],
                  },
                },
              },
            },
          },

          // {
          //   $unwind: {
          //     path: "$sale_status",              
          //     preserveNullAndEmptyArrays: true,
          //   },
          // },

          {
            $match: condition3
          },

          // {
          //   $project: {
          //     _id: 0,
          //     sourcedContentSummary: 1,
          //     // tasks_broadcasted: "$sourcedContentSumSize",
          //     // purchased_qty: 1,
          //     // purchased_content_value: 1,
          //     // total_payment_receivable: 1,
          //   },
          // },
          {
            $sort: condition2
          },

        ];

        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        // check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }

        params.push(facet); //finally push facet in params

        // const c ={ $cursor: { allowDiskUse: true } }

        // params.push(c)
        const result = await model.aggregate(params);
        resolve({
          sourcedContentSummery: result[0].data,
          totalCount://result[0].totalCount
            result[0].totalCount[0]
              ? result[0].totalCount[0].count
              : 0
        });
      } catch (err) {
        console.log(err);
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async sourcedContentHistory(model, data, data2) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(data);

        const condition = {
          media_house_id: mongoose.Types.ObjectId(data.media_house_id),
        };

        console.log(condition);

        // filters

        let filters = {}

        if (data2.startdate && data2.endDate) {
          filters = {
            $expr: {
              $and: [
                { $gte: ["$createdAt", data2.startdate] },
                { $lte: ["$createdAt", new Date(data2.endDate)] }
              ]
            }
          }
        }

        if (data2.hasOwnProperty("Paymentreceived")) {
          filters = { total_payment_received: { $gt: 0 } }
        }

        if (data2.hasOwnProperty("Paymentreceivable")) {
          filters = { total_payment_receivable: { $gt: 0 } }
        }

        // if (data2.hasOwnProperty("Paymentpaid")) {
        //   filters = { total_amount_paid: { $gt: "0" } }
        // }

        if (data2.Emplyee_search) {
          filters = { employeeName: { $regex: new RegExp("^" + data2.Emplyee_search + "$", "i") } }
        }

        // Sorting

        let sorting = { _id: -1 }
        if (data2.hasOwnProperty("NewtoOld")) {
          sorting = { createdAt: -1 }
        }

        if (data2.hasOwnProperty("OldtoNew")) {
          sorting = { createdAt: 1 }
        }

        if (data2.hasOwnProperty("Highestpricedcontent")) {
          sorting = { purchased_content_value: -1 }
        }

        if (data2.hasOwnProperty("Lowestpricedcontent")) {
          sorting = { purchased_content_value: 1 }
        }


        const params = [
          {
            $lookup: {
              from: "users",
              localField: "media_house_id",
              foreignField: "_id",
              as: "media_house_details",
            },
          },
          {
            $unwind: {
              path: "$media_house_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "admin_id",
              foreignField: "_id",
              as: "admin_details",
            },
          },
          {
            $unwind: {
              path: "$admin_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "tasks",
              localField: "media_house_id",
              foreignField: "mediahouse_id",
              as: "media_house_tasks",
            },
          },
          {
            $addFields: {
              sourcedContentSumSize: {
                $size: "$media_house_tasks",
              },
              purchased_qty: {
                $size: {
                  $filter: {
                    input: "$media_house_tasks",
                    as: "currdata",
                    cond: { $eq: ["$$currdata.paid_status", "paid"] },
                  },
                },
              },
            },
          },
          {
            $addFields: {
              purchased_content_value: {
                $reduce: {
                  input: "$media_house_tasks",
                  initialValue: 0,
                  in: {
                    $sum: [
                      "$$value",
                      "$$this.photo_price",
                      "$$this.videos_price",
                      "$$this.interview_price",
                    ],
                  },
                },
              },
              total_payment_receivable: {
                $reduce: {
                  input: "$media_house_tasks",
                  initialValue: 0,
                  in: {
                    $sum: [
                      "$$value",
                      "$$this.photo_price",
                      "$$this.videos_price",
                      "$$this.interview_price",
                    ],
                  },
                },
              },
              total_payment_received: {
                $reduce: {
                  input: "$media_house_tasks",
                  initialValue: 0,
                  in: {
                    $sum: ["$$value", "$$this.received_amount"],
                  },
                },
              },
            },
          },
          {
            $addFields: {
              employeeName: "$admin_details.name"
            }
          },
          {
            $match: filters
          },
          {
            $sort: sorting,
          },
        ];

        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            // totalCount: [
            //   {
            //     $count: "count",
            //   },
            // ],
            data: [
              {
                $match: { ...condition },
              },
            ],

            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };

        // const facet = {
        //   //use facet to get total count and data according to limit offset
        //   $facet: {
        //     data: [
        //       {
        //         $match: { ...condition },
        //       },
        //     ],
        //     totalCount: [
        //       {
        //         $count: "count",
        //       },
        //     ],
        //   },
        // };
        if (data2.hasOwnProperty("limit") && data2.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data2.offset),
            },
            {
              $limit: Number(data2.limit),
            },
          );
        }

        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          sourcedContentHistory: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
        console.log(err);
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async deleteAvtarbyAdmin(model, body) {
    return new Promise((resolve, reject) => {
      var condition = {
        _id: { $in: body.avtar_id },
        // user_id: body.user_id
      };

      model
        .updateMany(condition, {
          $set: {
            deletedAt: true,
          },
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          console.log(err);
          reject(buildErrObject(422, err.message));
        });
    });
  },
  async purchasedContent(model, data, arr) {
    return new Promise(async (resolve, reject) => {
      try {
        // const condition = { paid_status: "paid" }
        const condition = {}
        let condition3 = { purchased_qty: { $gt: 0 } };

        // if (data.Publication_search) {
        //   condition3 = { company_name: { $regex: new RegExp("^" + data.Publication_search + "$", "i") } }
        // }


        if (data.Publication_search) {
          const searchRegex = new RegExp(data.Publication_search, 'i')
          condition3.$or = [
            {
              $or: [
                { company_name: searchRegex },
              ]
            },
          ];
        }
        // if (data.hasOwnProperty("Paymentreceived")) {
        //   // condition3 = {
        //   //   $expr: {
        //   //     $and: {
        //   //       $eq: ["$paid_status", "Unpaid"]
        //   //     }
        //   //   }
        //   // }

        //   { sale_status: "unsold" }
        // }


        if (data.hasOwnProperty("Paymentreceivable")) {
          condition3 = {
            total_amount_payable: { $gt: 0 }
          }
        }

        if (data.hasOwnProperty("Paymentpaid")) {
          condition3 = {
            total_amount_paid: { $gt: 0 }
          }
        }

        // if (data.startPrice && data.endPrice) {
        //   condition.ask_price = {
        //     $gte: parseInt(data.startPrice),
        //     $lte: parseInt(data.endPrice),

        //   }
        // }

        // if (data.startdate && data.endDate) {
        //   condition.createdAt = {
        //     $gte: data.startdate,
        //     $lte: data.endDate         
        //   }
        // }


        let conditoin2 = { createdAt: -1 }

        if (data.hasOwnProperty("NewtoOld")) {
          conditoin2 = { createdAt: -1 }
        }

        if (data.hasOwnProperty("OldtoNew")) {
          conditoin2 = { createdAt: 1 }
        }

        if (data.hasOwnProperty("Highestpricedcontent")) {
          conditoin2 = { purchased_content_value: -1 }
        }

        if (data.hasOwnProperty("Lowestpricedcontent")) {
          conditoin2 = { purchased_content_value: 1 }
        }

        if (data.hasOwnProperty("Highestpaymentreceived")) {
          conditoin2 = { total_payment_received: -1 }
        }

        if (data.hasOwnProperty("Lowestpaymentreceived")) {
          conditoin2 = { total_payment_received: 1 }
        }


        let array = arr
        let typearray = ["shared", "exclusive"]
        if (data.type) {
          typearray = data.type
          condition3.type = {
            $ne: []
          }
        }
        if (data.category) {
          array = data.category.map((x) => mongoose.Types.ObjectId(x))
          condition3.category = {
            $ne: []
          }
        }

        const params = [
          {
            $lookup: {
              from: "contents",
              foreignField: "purchased_publication",
              localField: "_id",
              as: "purchased_publication",
            },
          },
          {
            $lookup: {
              from: "hopperpayments",
              localField: "_id",
              foreignField: "media_house_id",
              as: "payments",
            },
          },



          {
            $lookup: {
              from: "hopperpayments",
              let: { contentIds: "$hopper_id", list: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$media_house_id", "$$list"] },
                        { $eq: ["$paid_status_for_hopper", false] },
                        // { $eq: ["$content_id", "$$id"] },
                        { $eq: ["$type", "content"] },
                      ],
                    },
                  },
                },
              ],
              as: "transictions",
            },
          },

          {
            $lookup: {
              from: "hopperpayments",
              let: { contentIds: "$hopper_id", list: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$media_house_id", "$$list"] },
                        { $eq: ["$paid_status_for_hopper", true] },
                        // { $eq: ["$content_id", "$$id"] },
                        { $eq: ["$type", "content"] },
                      ],
                    },
                  },
                },
              ],
              as: "transictions_true",
            },
          },
          {
            $lookup: {
              from: "purchasedcontenthistories",
              let: {
                media_house_id: "$_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$media_house_id", "$$media_house_id"] },
                  },
                },
                {
                  $sort: {
                    createdAt: -1,
                  },
                },
                {
                  $limit: 1,
                },
                {
                  $lookup: {
                    from: "admins",
                    localField: "admin_id",
                    foreignField: "_id",
                    as: "admin_detail",
                  },
                },
                {
                  $unwind: {
                    path: "$admin_detail",
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
              as: "history_detail",
            },
          },
          // {
          //   $unwind: {
          //     path: "$history_detail",
          //     preserveNullAndEmptyArrays: true,
          //   },
          // },

          // {
          //   $lookup: {
          //     from: "contents",
          //     foreignField: "Vat.purchased_mediahouse_id",
          //     localField: "_id",
          //     as: "purchased_publicationTest",
          //   },
          // },

          // {
          //   $addFields: {
          //     info: {
          //       $filter: {
          //         input: "$payments",
          //         as: "item",
          //         cond: { $eq: ["$$item.type", "content"] }
          //       }
          //     }
          //   }
          // },
          {
            $addFields: {
              total_payment_received: {
                $size: "$purchased_publication.amount_paid",
              },
            },
          },
          {
            $addFields: {
              purchased_qty: {
                $size: {
                  $filter: {
                    input: "$payments",
                    as: "item",
                    cond: { $eq: ["$$item.type", "content"] }
                  }
                }  //"$purchased_publication",
              },
            },
          },
          // {
          //   $addFields: {
          //     purchased_content_value: {
          //       $sum: "$purchased_publication.amount_paid",
          //     },
          //   },
          // },
          {
            $addFields: {
              purchased_content_value: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$payments",
                        as: "item",
                        cond: { $eq: ["$$item.type", "content"] }
                      }
                    },
                    as: "filteredItem",
                    in: "$$filteredItem.amount"
                  }
                }
              }
            }
          },
          {
            $addFields: {
              paid_statusfor_hoper: "$purchased_publication.paid_status"

            },
          },
          {
            $addFields: {
              category: {
                $filter: {
                  input: "$payments",
                  as: "item",
                  cond: { $in: ["$$item.category_id", array] }
                }
              }
            },
          },


          {
            $addFields: {
              type: {
                $filter: {
                  input: "$payments",
                  as: "item",
                  cond: { $in: ["$$item.payment_content_type", typearray] }
                }
              }
            },
          },
          // {
          //   $unwind: {
          //     path: "$paid_statusfor_hoper",
          //     preserveNullAndEmptyArrays: true,
          //   }
          // },

          // {
          //   $addFields: {
          //     sale_status: {
          //       $cond: {
          //         if: { $eq: ["$purchased_publication.paid_status", "$paid_statusfor_hoper"] },
          //         then: "sold",
          //         else: "Unsold"
          //       }
          //     }
          //   }
          // },
          {
            $addFields: {
              // total_presshop_commission: {
              //   $sum: "$transictions_true.presshop_commission",
              // },
              total_stripe_fee: {
                $sum: "$transictions.stripe_fee",
              },

              total_presshop_commission: {
                $sum: "$transictions.presshop_commission",
              },

              total_amount_payable: {
                $sum: "$transictions.payable_to_hopper",
              },
              total_amount_paid: {
                $sum: "$transictions_true.payable_to_hopper",
              },
              // total_amount_paid: "$purchased_publication.paid_status_to_hopper"

            },
          },
          // {
          //   $lookup: {
          //     from: 
          //   }
          // }
          // {
          //   $addFields: {
          //     sale_status: {
          //       $cond: {
          //         if: { $in: ["$purchased_publication.paid_status", "$$paid_status"] },
          //         then: "sold",
          //         else: "Unsold"
          //       }
          //     }
          //   }
          // },
          {
            $lookup: {
              from: "ratings",
              let: { task_id: "$_id" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$from", "$$task_id"] }],
                    },
                  },
                },



                {
                  $addFields: {
                    value: "$rating"


                  },
                },
              ],
              as: "rating_byhopper",
            },
          },
          {
            $addFields: {
              ratingsforMediahouse: {
                $avg: "$rating_byhopper.rating",
              },
            },
          },
          {
            $match: condition3,
          },
          // {
          //   $project: {
          //     "purchased_publication": 0
          //   }
          // },
          {
            $sort: conditoin2,
          },

          // {
          //   $project: {
          //     profile_image: 1,
          //     createdAt:1,
          //     first_name: 1,
          //     full_name: 1,
          //     company_name: 1,
          //     last_name: 1,
          //     total_presshop_commission: 1,
          //     total_amount_payable: 1,
          //     total_amount_paid: 1,
          //     total_payment_received:1,
          //     purchased_content_value:1
          //   }
          // }
        ];

        // const params = [
        //   {
        //     $match: condition,
        //   },
        //   {
        //     $unwind:"$tag_ids",
        //   },
        //   {
        //     $lookup: {
        //       from: "tags",
        //       let: {
        //         tag_id: "$tag_ids",
        //       },
        //       pipeline: [
        //         {
        //           $match: {
        //             $expr: { $eq: ["$_id", "$$tag_id"] }
        //           },
        //         },
        //       ],
        //       as: "tag_ids",
        //     },
        //   },
        //   {
        //     $lookup: {
        //       from: "categories",
        //       let: {
        //         category_id: "$category_id",
        //       },
        //       pipeline: [
        //         {
        //           $match: {
        //             $expr: { $eq: ["$_id", "$$category_id"] }
        //           },
        //         },
        //       ],
        //       as: "category_id",
        //     },
        //   },
        // {
        //   $unwind:{
        //     path: "$category_id",
        //     preserveNullAndEmptyArrays: true
        //   }
        // },
        //   {
        //     $lookup: {
        //       from: "users",
        //       let: {
        //         mediahouse_id: "$purchased_publication",
        //       },
        //       pipeline: [
        //         {
        //           $match: {
        //             $expr: { $eq: ["$_id", "$$mediahouse_id"] }
        //           },
        //         },
        //       ],
        //       as: "purchased_publication",
        //     },
        //   },
        //   {
        //     $unwind:{
        //       path: "$purchased_publication",
        //       preserveNullAndEmptyArrays: true
        //     }
        //   },
        //   // {
        //   //   $addFields: {
        //   //     tasks_broadcasted: {
        //   //       $size: "$sourcedContentSummery"
        //   //     }
        //   //   }
        //   // },
        //   // {
        //   //   $addFields: {
        //   //     purchased_qty: {
        //   //       $size: {
        //   //         $filter: {
        //   //           input: "$sourcedContentSummery",
        //   //           as: "currdata",
        //   //           cond: { $eq: ["$$currdata.paid_status", "paid"] }
        //   //         }
        //   //       },
        //   //     },
        //   //   },
        //   // },
        //   // {
        //   //   $unwind: {
        //   //     path: "$sourcedContentSummery",
        //   //     preserveNullAndEmptyArrays: false
        //   //   }
        //   // },
        //   // {
        //   //   $addFields: {
        //   //     purchased_content_value: {
        //   //       $sum: [
        //   //         "$sourcedContentSummery.photo_price",
        //   //         "$sourcedContentSummery.videos_price",
        //   //         "$sourcedContentSummery.interview_price"
        //   //       ]
        //   //     }
        //   //   }
        //   // },
        //   // {
        //   //   $addFields: {
        //   //     total_payment_recevable: {
        //   //       $sum: [
        //   //         "$sourcedContentSummery.photo_price",
        //   //         "$sourcedContentSummery.videos_price",
        //   //         "$sourcedContentSummery.interview_price"
        //   //       ]
        //   //     }
        //   //   }
        //   // },
        //   // {
        //   //   $project: {
        //   //     "sourcedContentSummery":0
        //   //   }
        //   // },
        //   {
        //     $sort: { _id: -1 },
        //   },
        // ];
        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition3 },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $project: {
                profile_image: 1,
                createdAt: 1,
                first_name: 1,
                full_name: 1,
                company_name: 1,
                last_name: 1,
                total_presshop_commission: 1,
                total_amount_payable: 1,
                total_amount_paid: 1,
                total_payment_received: 1,
                purchased_content_value: 1,
                purchased_qty: 1,
                type: 1,
                category: 1
              }
            },
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }


        // if (data.hasOwnProperty("Highestpricedcontent") ) {
        //   facet.$facet.data.push(
        //     {
        //       $sort: {ask_price: -1},
        //     },

        //   );
        // }

        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          purchasedPublication: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  // async newPurchasedContentSumary(model, data) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       console.log(data);

  //       const condition = {
  //         // _id: mongoose.Types.ObjectId(data),
  //         // role: "MediaHouse",
  //       };

  //       if(data.media_house_id){
  //         condition.media_house_id = mongoose.Types.ObjectId(data.media_house_id);
  //       }
  //       console.log(condition);
  //       const params = [
  //         {
  //           $lookup: {
  //             from: "users",
  //             localField: "mediahouse_id",
  //             foreignField: "_id",
  //             as: "media_house_details",
  //           },
  //         },
  //         {
  //           $unwind: {
  //             path: "$media_house_details",
  //             preserveNullAndEmptyArrays: true,
  //           },
  //         },

  //         {
  //           $group: {
  //             _id: "$mediahouse_id",
  //             company_name:{$first:"$media_house_details.company_name"},
  //             profile_image:{$first:"$media_house_details.profile_image"},
  //             admin:{$first:"$media_house_details.source_content_employee"},
  //             mode:{$first:"$media_house_details.mode"},
  //             remarks:{$first:"$media_house_details.remarks"},
  //             createdAt:{$first:"$media_house_details.createdAt"},
  //             updatedAt:{$first:"$media_house_details.updatedAt"},
  //             PurchasedContentSummary: { $push: "$$ROOT" },
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "admins",
  //             let:{
  //               admin_id: "$admin"
  //             },
  //             pipeline: [
  //               {
  //                 $match: {
  //                   $expr:{
  //                     $eq:["$_id","$$admin_id"]
  //                   }
  //                 }
  //               }
  //             ],
  //             as: "admin_data",
  //           },
  //         },
  //         {
  //           $unwind: {
  //             path: "$admin_data",
  //             preserveNullAndEmptyArrays: true,
  //           },
  //         },
  //         {
  //           $addFields: {
  //             sourcedContentSumSize: {
  //               $size: "$PurchasedContentSummary",
  //             },
  //             purchased_qty: {
  //               $size: {
  //                 $filter: {
  //                   input: "$PurchasedContentSummary",
  //                   as: "currdata",
  //                   cond: { $eq: ["$$currdata.paid_status", "paid"] },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //         {
  //           $addFields: {
  //             purchased_content_value: {
  //               $reduce: {
  //                 input: "$PurchasedContentSummary",
  //                 initialValue: 0,
  //                 in: {
  //                   $sum: [
  //                     "$$value",
  //                     "$$this.photo_price",
  //                     "$$this.videos_price",
  //                     "$$this.interview_price",
  //                   ],
  //                 },
  //               },
  //             },
  //             total_payment_receivable: {
  //               $reduce: {
  //                 input: "$PurchasedContentSummary",
  //                 initialValue: 0,
  //                 in: {
  //                   $sum: [
  //                     "$$value",
  //                     "$$this.photo_price",
  //                     "$$this.videos_price",
  //                     "$$this.interview_price",
  //                   ],
  //                 },
  //               },
  //             },
  //             total_payment_received: {
  //               $reduce: {
  //                 input: "$sourcedContentSummary",
  //                 initialValue: 0,
  //                 in: {
  //                   $sum: [
  //                     "$$value",
  //                     "$$this.received_amount",
  //                   ],
  //                 },
  //               },
  //             },

  //           },
  //         },
  //         // {
  //         //   $match: condition
  //         // },

  //         // {
  //         //   $project: {
  //         //     _id: 0,
  //         //     sourcedContentSummary: 1,
  //         //     // tasks_broadcasted: "$sourcedContentSumSize",
  //         //     // purchased_qty: 1,
  //         //     // purchased_content_value: 1,
  //         //     // total_payment_receivable: 1,
  //         //   },
  //         // },
  //         {
  //           $sort: { _id: -1 },
  //         },
  //       ];

  //       const facet = {
  //         //use facet to get total count and data according to limit offset
  //         $facet: {
  //           data: [
  //             {
  //               $match: { ...condition },
  //             },
  //           ],
  //           totalCount: [
  //             {
  //               $count: "count",
  //             },
  //           ],
  //         },
  //       };
  //       //check if limit or offset in data object then fetch data accordint to it
  //       // if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
  //       //   facet.$facet.data.push(
  //       //     {
  //       //       $skip: Number(data.offset),
  //       //     },
  //       //     {
  //       //       $limit: Number(data.limit),
  //       //     }
  //       //   );
  //       // }

  //       params.push(facet); //finally push facet in params
  //       const result = await model.aggregate(params);
  //       resolve({
  //         sourcedContentSummery: result[0].data,
  //       });
  //     } catch (err) {
  //       console.log(err);
  //       reject(buildErrObject(422, err.message));
  //     }
  //   });
  // },

  async publishedContentSummery(data, datas, model) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          content_id: mongoose.Types.ObjectId(data),
        };
        let dataLimit = datas.limit ? parseInt(datas.limit) : Number.MAX_SAFE_INTEGER;
        let dataOffset = datas.offset ? parseInt(datas.offset) : 0;
        if (data.status) {
          condition.status = data.status;
        }


        // sorting

        let sorting = { createdAt: -1 }
        if (datas.hasOwnProperty("NewtoOld")) {
          sorting = { createdAt: -1 }
        }

        if (datas.hasOwnProperty("OldtoNew")) {
          sorting = { createdAt: 1 }
        }

        if (datas.hasOwnProperty("Highestpricedcontent")) {
          sorting = { ask_price: -1 }
        }

        if (datas.hasOwnProperty("Lowestpricedcontent")) {
          sorting = { ask_price: 1 }
        }

        // filters

        let filters = {}

        if (datas.hasOwnProperty("Soldcontent")) {
          filters = { salestatus: "sold" }
        }

        if (datas.hasOwnProperty("Unsoldcontent")) {
          filters = { salestatus: "unsold" }
        }

        if (datas.hasOwnProperty("Publishedcontent")) {
          filters = { content_status: "published" }
        }

        if (datas.hasOwnProperty("Pendingcontent")) {
          filters = { content_status: "pending" }
        }

        if (datas.hasOwnProperty("Paymentreceived")) {
          filters = { amountpaid: { $gt: 0 } }
        }

        if (datas.hasOwnProperty("Paymentpayable")) {
          filters = { amountPayabletoHopper: { $gt: 0 } }
        }

        if (datas.hopper_search) {
          filters.hopper_name = { $regex: new RegExp("^" + datas.hopper_search + "$", "i") }
        }

        // if (datas.startPrice && datas.endPrice) {
        //   filters ={
        //     $expr: {
        //       $and:[
        //         {$gte:["$ask_price",datas.startPrice]},
        //         {$lte: ["$ask_price",datas.endPrice]}
        //       ]
        //     }
        //   }          
        // }

        if (datas.startdate && datas.endDate) {
          filters = {
            $expr: {
              $and: [
                { $gte: ["$createdAt", datas.startdate] },
                { $lte: ["$createdAt", new Date(datas.endDate)] }
              ]
            }
          }
        }

        // if (datas.catagory) {
        //   filters= {category_id: data.catagory} 
        // }

        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "contents",
              let: {
                content_id: "$content_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$content_id"] },
                  },
                },
                {
                  $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "categoryDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$categoryDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    let: { hopper_id: "$hopper_id" },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [{ $eq: ["$_id", "$$hopper_id"] }],
                          },
                        },
                      },
                      {
                        $lookup: {
                          from: "avatars",
                          localField: "avatar_id",
                          foreignField: "_id",
                          as: "avatar_details",
                        },
                      },
                      {
                        $unwind: {
                          path: "$avatar_details",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "hopperDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$hopperDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
              as: "content_id",
            },
          },
          {
            $unwind: {
              path: "$content_id",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "admin_id",
              foreignField: "_id",
              as: "admin_id",
            },
          },
          {
            $unwind: {
              path: "$admin_id",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              salestatus: "$content_id.sale_status"

            }
          },
          {
            $addFields: {
              amountpaid: "$content_id.amount_paid"

            }
          },
          {
            $addFields: {
              content_status: "$content_id.status"
            }
          },

          {
            $addFields: {
              amountPayabletoHopper: "$content_id.amount_payable_to_hopper"
            }
          },
          {
            $addFields: {
              hopper_name: {
                $concat: ["$content_id.hopperDetails.first_name", " ", "$content_id.hopperDetails.last_name"]
              }
            }
          },

          {
            $match: filters
          },

          {
            $sort: sorting,
          },
          {
            $skip: dataOffset,
          },
          {
            $limit: dataLimit,
          },
        ];
        const result = await model.aggregate(params);
        resolve({
          publishedContentSummery: result,
          // totalCount: result[0].totalCount[0]
          //   ? result[0].totalCount[0].count
          //   : 0,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async uploadedContentSummeryHopper(data, model) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          role: "Hopper",
        };
        const dataLimit = data.limit ? Number(data.limit) : Number.MAX_SAFE_INTEGER;
        const dataOffset = data.offset ? Number(data.offset) : 0;


        let sortby



        if (data.hasOwnProperty("NewtoOld")) {
          sortby = {
            createdAt: -1
          }
        } else if (data.hasOwnProperty("OldtoNew")) {
          sortby = {
            createdAt: 1
          }
        } else if (data.hasOwnProperty("Highestpricedcontent")) {
          sortby = {
            uploaded_content_val: -1
          }
        } else if (data.hasOwnProperty("Lowestpricedcontent")) {
          sortby = {
            uploaded_content_val: 1
          }
        } else if (data.HighestPaymentReceived) {
          sortby = {
            total_amount_recieved: -1
          }
        } else if (data.LowestPaymentReceived) {
          sortby = {
            total_amount_recieved: 1
          }
        } else {
          sortby = {
            createdAt: 1
          }
        }
        // filters

        let filters = {}
        if (data.hasOwnProperty("PaymentPaid")) {
          condition2.total_amount_paid = {
            $gt: 0
          };
          // filters = {
          //   total_amount_paid: { $gt: 0 }
          // }
        }

        // if (data.hasOwnProperty("PaymentPayable")) {
        //   filters = {
        //     total_amount_payable: { $gt: 0 }
        //   }
        // }


        let condition2 = {};

        if (data.sale_status == "sold") {
          condition2.ValueOfSoldUploadedContent = {
            $gt: [{ $size: "$ValueOfSoldUploadedContent" }, 0]
          };
        } else if (data.sale_status == "unsold") {
          condition2.ValueOfUnSoldUploadedContent = {
            $gt: [{ $size: "$ValueOfUnSoldUploadedContent" }, 0]
          };
        }

        if (data.paymentPayable) {
          condition2.total_amount_payable = {
            $gt: 0
          };
        }
        // let  condition2 ={}
        // if (data.sale_status == "sold") {
        //   condition2.ValueOfSoldUploadedContent = {
        //     $gt: 0
        //   }
        // } else if (data.sale_status == "unsold") {
        //   condition2.ValueOfUnSoldUploadedContent = {
        //     $gt: 0
        //   }
        // }
        if (data.Hoppers) {
          const searchRegex = new RegExp(data.Hoppers, 'i')

          condition.$or = [
            {
              $or: [
                { user_name: searchRegex },
              ]
            }, {
              $expr: {
                $regexMatch: {
                  input: { $concat: ["$first_name", " ", "$last_name"] },
                  regex: searchRegex
                }
              }
            }
          ];


          // filters = {
          //   first_name: { $regex: data.Hopper_Search, $options: "i" }
          // }
        }


        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "avatars",
              localField: "avatar_id",
              foreignField: "_id",
              as: "avtar_image",
            },
          },
          {
            $unwind: {
              path: "$avtar_image",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "uploaded_content_admin_employee_id",
              foreignField: "_id",
              as: "employee_details",
            },
          },
          {
            $unwind: {
              path: "$employee_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "uploadcontents",
              localField: "_id",
              foreignField: "hopper_id",
              as: "uploaded_contents",
            },
          },

          {
            $addFields: {
              ValueOfUnSoldUploadedContent: {
                $filter: {
                  input: "$uploaded_contents",
                  as: "item",
                  cond: { $eq: ["$$item.paid_status", false] }
                }
              },

            }

          },


          {
            $addFields: {
              ValueOfSoldUploadedContent: {
                $filter: {
                  input: "$uploaded_contents",
                  as: "item",
                  cond: { $eq: ["$$item.paid_status", true] }
                }
              },

            }
          },


          {
            $addFields: {
              ValueOfPaidToHopperUploadedContent: {
                $filter: {
                  input: "$uploaded_contents",
                  as: "item",
                  cond: { $eq: ["$$item.paid_status_to_hopper", true] }
                }
              },

            }
          },
          {
            $addFields: {
              ValueOfPaidToHopperFalseseUploadedContent: {
                $filter: {
                  input: "$uploaded_contents",
                  as: "item",
                  cond: {
                    $and: [
                      { $eq: ["$$item.paid_status", true] },
                      { $eq: ["$$item.paid_status_to_hopper", false] }
                    ]
                  }//{ $eq: ["$$item.paid_status_to_hopper", false] }
                }
              },

            }
          },


          {
            $match: condition2,
          },
          {
            $lookup: {
              from: "acceptedtasks",
              let: {
                hopper_id: "$_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$hopper_id", "$$hopper_id"] },
                  },
                },
                {
                  $lookup: {
                    from: "uploadcontents",
                    localField: "hopper_id",
                    foreignField: "hopper_id",
                    as: "taskDetails",
                  },
                },
                {
                  $lookup: {
                    from: "tasks",
                    localField: "task_id",
                    foreignField: "_id",
                    as: "content",
                  },
                },
                {
                  $unwind: {
                    path: "$content",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $addFields: {
                    uploadedContentValue: {
                      $sum: [
                        "$content.photo_price",
                        "$content.videos_price",
                        "$content.interview_price",
                      ],
                    },
                  },
                },
                {
                  $addFields: {
                    uploadedContent: {
                      $size: "$taskDetails",
                    },
                  },
                },
                {
                  $addFields: {
                    task_id: "$content._id"
                  },
                },
              ],
              as: "accepted_tasks",
            },
          },
          {
            $match: {
              accepted_tasks: { $ne: [] },
            },
          },
          {
            $addFields: {
              _id: "$_id"
            },
          },
          {
            $lookup: {
              from: "hopperpayments",
              let: { contentIds: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$hopper_id", "$$contentIds"] },
                        { $eq: ["$paid_status_for_hopper", true] },
                        // { $eq: ["$content_id", "$$id"] },
                        { $eq: ["$type", "task_content"] },
                      ],
                    },
                  },
                },
              ],
              as: "transictions_true",
            },
          },
          {
            $lookup: {
              from: "hopperpayments",
              let: { contentIds: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$hopper_id", "$$contentIds"] },
                        { $eq: ["$paid_status_for_hopper", false] },
                        // { $eq: ["$content_id", "$$id"] },
                        { $eq: ["$type", "task_content"] },
                      ],
                    },
                  },
                },
              ],
              as: "transictions_false",
            },
          },


          {
            $project: {
              _id: 1,
              first_name: 1,
              last_name: 1,
              user_name: 1,
              email: 1,
              transictions_false: 1,
              createdAt: 1,
              transictions_true: 1,
              task_id: "$accepted_tasks.task_id",
              avatar: "$avtar_image.avatar",
              // log: "$accepted_tasks.taskDetails",
              // firstValue: {
              //   $size: { $arrayElemAt: ["$accepted_tasks.taskDetails", 0] },
              // },
              uploaded_contents: 1,
              accepted_tasks: {
                $size: "$accepted_tasks",
              },
              uploaded_content: {
                $size: { $arrayElemAt: ["$accepted_tasks.taskDetails", 0] },
              },
              uploaded_content_val: {
                $sum: "$accepted_tasks.uploadedContentValue",
              },
              uploaded_content_admin_employee_id_date: 1,
              uploaded_content_admin_mode: 1,
              uploaded_content_remarks: 1,
              employee_name: "$employee_details.name",
              total_presshop_commission: {
                $sum: {
                  $map: {
                    input: "$ValueOfSoldUploadedContent",
                    as: "content",
                    in: { $toDouble: "$$content.commition_to_payable" },
                  },
                }
              },

              total_amount_payable: {
                $sum: {
                  $map: {
                    input: "$ValueOfPaidToHopperFalseseUploadedContent",
                    as: "content",
                    in: { $toDouble: "$$content.amount_payable_to_hopper" },
                  },
                }
              },

              total_amount_paid: {
                $sum: {
                  $map: {
                    input: "$ValueOfPaidToHopperUploadedContent",
                    as: "content",
                    in: { $toDouble: "$$content.amount_payable_to_hopper" },
                  },
                }
              },
              total_amount_recieved: {
                $sum: {
                  $map: {
                    input: "$ValueOfSoldUploadedContent",
                    as: "content",
                    in: { $toDouble: "$$content.amount_paid" },
                  },
                }
              },

              // total_presshop_commission: {
              //   $sum: "$transictions_false.presshop_commission",
              // },
              // total_amount_payable: {
              //   $sum: "$transictions_false.payable_to_hopper",
              // },
              // total_amount_paid: {
              //   $sum: "$transictions_true.amount_paid_to_hopper",
              // },
              // total_amount_recieved: {
              //   $sum: "$transictions_false.amount",
              // },
            },
          },

          // {
          //   $addFields: {
          //     hopper_name: {
          //       $concat: ["$first_name", " ","$last_name"]
          //     }
          //   }
          // },
          // {
          //   $unwind: {
          //     path: "$hoper_name"
          //   }
          // },
          {
            $match: filters
          },
          {
            $facet: {
              data: [
                {
                  $sort: sortby
                },
                {
                  $skip: dataOffset,
                },
                {
                  $limit: dataLimit,
                },
              ],
              totalCount: [
                {
                  $count: "count",
                },
              ],
            },
          },
        ];

        // const facet = {
        //   //use facet to get total count and data according to limit offset
        //   $facet: {
        //     data: [
        //       {
        //         $match: { ...condition },
        //       },
        //       // {
        //       //   $match: { ...condition2 },
        //       // },
        //     ],
        //     totalCount: [
        //       {
        //         $count: "count",
        //       },
        //     ],
        //   },
        // };

        // if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
        //   facet.$facet.data.push(
        //     {
        //       $skip: Number(data.offset),
        //     },
        //     {
        //       $limit: Number(data.limit),
        //     }
        //   );
        // }

        // params.push(facet);


        // if (data.hasOwnProperty("OldtoNew")) {
        //   facet.$facet.data.push(
        //     {
        //       $sort: { createdAt: 1 },
        //     },
        //   );
        // }
        // if (data.hasOwnProperty("NewtoOld")) {
        //   facet.$facet.data.push(
        //     {
        //       $sort: { createdAt: -1 },
        //     },
        //   );
        // }
        // if (data.hasOwnProperty("highpaymentrecived")) {
        //   facet.$facet.data.push(
        //     {
        //       $sort: { amount_paid: -1 },
        //     },
        //   );
        // }
        // if (data.hasOwnProperty("lowpaymentrecived")) {
        //   facet.$facet.data.push(
        //     {
        //       $sort: { amount_paid: 1 },
        //     },
        //   );
        // }
        // if (data.hasOwnProperty("Highestpricedcontent")) {
        //   facet.$facet.data.push(
        //     {
        //       $sort: { amount_payable_to_hopper: -1 },
        //     },
        //   );
        // }
        // if (data.hasOwnProperty("Lowestpricedcontent")) {
        //   facet.$facet.data.push(
        //     {
        //       $sort: { amount_payable_to_hopper: 1 },
        //     },
        //   );
        // }


        // params.push(facet); //finally push facet in params
        // const result = await model.aggregate(params);
        const result = await model.aggregate(params);
        resolve({
          uploadedContentSummeryHopper: result,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },


  async publishedContentSummeryHopper(data, model) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          role: "Hopper",
        };
        const dataLimit = data.limit ? Number(data.limit) : Number.MAX_SAFE_INTEGER;
        const dataOffset = data.offset ? Number(data.offset) : 0;

        // Filters 

        let filters = {
          contents: { $ne: [] },
        }



        // Sorting

        let sortBy = { "contents._id": -1 }

        if (data.hasOwnProperty("HighestPaymentReceived")) {
          sortBy = {
            published_content_val: -1
          }
        }


        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "avatars",
              localField: "avatar_id",
              foreignField: "_id",
              as: "avtar_image",
            },
          },
          {
            $unwind: {
              path: "$avtar_image",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "published_content_admin_employee_id",
              foreignField: "_id",
              as: "employee_details",
            },
          },
          {
            $unwind: {
              path: "$employee_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "contents",
              let: { hopper_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$hopper_id", "$$hopper_id"] }],
                    },
                  },
                },
              ],
              as: "contents",
            },
          },


          {
            $lookup: {
              from: "hopperpayments",
              let: { contentIds: "$hopper_id", list: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$hopper_id", "$$list"] },
                        { $eq: ["$paid_status_for_hopper", true] },
                        // { $eq: ["$content_id", "$$id"] },
                        { $eq: ["$type", "content"] },
                      ],
                    },
                  },
                },
              ],
              as: "transictions",
            },
          },



          {
            $lookup: {
              from: "hopperpayments",
              let: { contentIds: "$hopper_id", list: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$hopper_id", "$$list"] },
                        { $eq: ["$paid_status_for_hopper", false] },
                        // { $eq: ["$content_id", "$$id"] },
                        { $eq: ["$type", "content"] },
                      ],
                    },
                  },
                },
              ],
              as: "transictions_false",
            },
          },
          {
            $project: {
              _id: 1,
              first_name: 1,
              last_name: 1,
              user_name: 1,
              email: 1,
              // "published_content_admin_employee_id":1,
              published_content_admin_mode: 1,
              published_content_remarks: 1,
              avatar: "$avtar_image.avatar",
              // payment_pending: {
              //   $size: "$contents"
              // },
              published_content_qty: {
                $size: "$contents",
              },
              published_content_val: {
                $sum: "$contents.ask_price",
              },
              transictions_false: 1,
              total_amount_payable: {
                $sum: "$transictions_false.payable_to_hopper",
              },
              total_payment_earned: { $sum: "$transictions.payable_to_hopper" },
              total_presshop_commission: { $sum: "$transictions_false.presshop_commission" },
              employee_name: "$employee_details.name",
              published_content_admin_employee_id_date: 1,
            },
          },

          {
            $facet: {
              data: [
                {
                  $skip: dataOffset,
                },
                {
                  $limit: dataLimit,
                },
              ],
              totalCount: [
                {
                  $count: "count",
                },
              ],
            },
          },
          {
            $match: {
              contents: { $ne: [] },
            },
          },
          {
            $sort: { "contents.createdAt": -1 },
          },
        ];

        // const facet = {
        //   //use facet to get total count and data according to limit offset
        //   $facet: {
        //     data: [
        //       {
        //         $match: { ...condition },
        //       },
        //     ],
        //     totalCount: [
        //       {
        //         $count: "count",
        //       },
        //     ],
        //   },
        // };

        // if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
        //   facet.$facet.data.push(
        //     {
        //       $skip: Number(data.offset),
        //     },
        //     {
        //       $limit: Number(data.limit),
        //     }
        //   );
        // }

        // params.push(facet); //finally push facet in params
        // const result = await model.aggregate(params);
        // resolve({
        //   publishedContentSummeryHopper: result[0].data,
        //   totalCount: result[0].totalCount[0]
        //     ? result[0].totalCount[0].count
        //     : 0,
        // });

        const result = await model.aggregate(params);
        resolve({
          // publishedContentSummeryHopper: result,
          publishedContentSummeryHopper: result[0].data,
          totalCount: result[0].totalCount
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async viewPublishedContentSummeryHopper(data, model) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          hopper_id: data.hopper_id,
        };
        const dataLimit = data.limit ? Number(data.limit) : Number.MAX_SAFE_INTEGER;
        const dataOffset = data.offset ? Number(data.offset) : 0;
        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "users",
              let: { hopper_id: "$hopper_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$_id", "$$hopper_id"] }],
                    },
                  },
                },
              ],
              as: "contents",
            },
          },
          {
            $match: {
              contents: { $ne: [] },
            },
          },
          {
            $sort: { "contents._id": -1 },
          },
          {
            $project: {
              _id: 1,
              first_name: 1,
              last_name: 1,
              user_name: 1,
              email: 1,
              // "published_content_admin_employee_id":1,
              published_content_admin_mode: 1,
              published_content_remarks: 1,
              avatar: "$avtar_image.avatar",
              //   published_content_qty: {
              //     $size: "$contents"
              //   },
              //   published_content_val: {
              //     $sum:"$contents.ask_price",

              //   },
              //   total_payment_earned: {$sum:"$contents.amount_paid"},
              //   "employee_name":"$employee_details.name",
              //   "published_content_admin_employee_id_date":1,
            },
          },
          {
            $facet: {
              data: [
                {
                  $skip: dataOffset,
                },
                {
                  $limit: dataLimit,
                },
              ],
              totalCount: [
                {
                  $count: "count",
                },
              ],
            },
          },
        ];
        const result = await model.aggregate(params);
        resolve({
          publishedContentSummeryHopper: result,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },


  async gethopperContenthistoryList(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        // const condition = {
        //   is_draft: false,
        // };

        // if (data.status) {
        //   condition.status = data.status;
        // }
        const params = [
          //  {
          //    $match: {
          //      $expr: {
          //        $and: [{ $eq: ["content_id", mongoose.Types.ObjectId(data.content_id)] }],
          //      },
          //    },
          //  },
          {
            $match: { content_id: mongoose.Types.ObjectId(data.content_id) },
          },
          {
            $lookup: {
              from: "contents",
              localField: "content_id",
              foreignField: "_id",
              as: "content_id",
            },
          },

          { $unwind: "$content_id" },

          // {
          //   $match: { content_id: mongoose.Types.ObjectId(data.content_id) },
          // },
          {
            $lookup: {
              from: "categories",
              let: { task_id: "$content_id" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$_id", "$$task_id.category_id"] }],
                    },
                  },
                },
              ],
              as: "category_details",
            },
          },

          {
            $lookup: {
              from: "admins",
              localField: "admin_id",
              foreignField: "_id",
              as: "admin_id",
            },
          },
          {
            $lookup: {
              from: "users",
              let: { task_id: "$content_id" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$_id", "$$task_id.hopper_id"] }],
                    },
                  },
                },
              ],
              as: "hopper_details",
            },
          },
          { $unwind: "$hopper_details" },

          {
            $lookup: {
              from: "avatars",
              let: { hopper_id: "$hopper_details" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$_id", "$$hopper_id.avatar_id"] }],
                    },
                  },
                },
                // {
                //   $addFields:{
                //     console:"$$task_id"
                //   }
                // }
              ],
              as: "avatar_detals",
            },
          },

          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "content_id.purchased_publication",
          //     foreignField: "_id",
          //     as: "purchased_publication_details",
          //   },
          // },

          // { $unwind: "$purchased_publication_details" },
        ];
        // const facet = {
        //   //use facet to get total count and data according to limit offset
        //   $facet: {
        //     data: [
        //       {
        //         $match: { ...condition },
        //       },
        //     ],
        //     totalCount: [
        //       {
        //         $count: "count",
        //       },
        //     ],
        //   },
        // };
        //check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }

        // params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          contentList: result,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },







  async livetaskfordashbord(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const currentDate = new Date();
        // console.log("currentDate",currentDate);
        // const condition = { paid_status: "paid" }
        // const condition = {};


        let condition
        let sortBy = {
          createdAt: -1
        }


        if (data.hasOwnProperty("NewtoOld")) {
          sortBy = {
            createdAt: -1
          }
        }

        if (data.hasOwnProperty("OldtoNew")) {
          sortBy = {
            createdAt: 1
          }
        }

        let condition1 = {};
        const startDate = new Date(data.startdate);
        const endDate = new Date(data.endDate);
        if (data.startDate && data.endDate) {
          condition1.createdAt = {
            $lte: endDate,
            $gte: startDate
          }
        }
        // if (data.){
        //   condition1 = {
        //    $expr:{
        //      $and:[{$eq:["$paid_status", data.status]}]
        //    }
        //   }
        //  }

        if (data.sale_status == "sold") {
          condition1 = {
            $expr: {
              $and: [{ $eq: ["$paid_status", data.status] }]
            }
          }
        }


        if (data.sale_status == "unsold") {
          condition1 = {
            $expr: {
              $and: [{ $eq: ["$paid_status", data.status] }]
            }
          }
        }


        // if (data.search) {
        //   const like = { $regex: data.search, $options: "i" };
        //   condition1.location = like;
        //   // condition.description = like
        // }

        // if (data.category) {
        //   condition.category_id = mongoose.Types.ObjectId(data.category);
        // }


        // let condition

        if (data.task_id) {
          // console.log("data.id",mongoose.Types.ObjectId(data.sassa))
          //  delete condition
          condition = {
            $expr: {
              $and: [{ $eq: ["$_id", mongoose.Types.ObjectId(data.task_id)] }],
            },
          }
        } else {
          condition = {
            $expr: {
              $and: [{ $gt: ["$deadline_date", currentDate] }],
            },
          }
        }
        const params = [
          {
            $addFields: {
              longitude: { $arrayElemAt: ["$address_location.coordinates", 0] },
              latitude: { $arrayElemAt: ["$address_location.coordinates", 1] },
            },
          },
          {
            $match: condition
          },
          // {
          //   $match: yesterday
          // },
          // {
          //   $lookup: {
          //     from: "uploadcontents",
          //     let: { task_id: "$_id" },

          //     pipeline: [
          //       {
          //         $match: {
          //           $expr: {
          //             $and: [{ $eq: ["$task_id", "$$task_id"] }],
          //           },
          //         },
          //       },
          //       {
          //         $addFields: {
          //           imagecount: {
          //             $cond: {
          //               if: { $eq: ["$type", "image"] },
          //               then: 1,
          //               else: 0,
          //             },
          //           },

          //           videocount: {
          //             $cond: {
          //               if: { $eq: ["$type", "video"] },
          //               then: 1,
          //               else: 0,
          //             },
          //           },
          //           interviewcount: {
          //             $cond: {
          //               if: { $eq: ["$type", "interview"] },
          //               then: 1,
          //               else: 0,
          //             },
          //           },

          //           // totalDislikes: { $sum: "$dislikes" }
          //         },
          //       },
          //     ],
          //     as: "uploaded_content",
          //   },
          // },
          // {
          //   $addFields: {
          //     // uploadedcontent: "$task_id",
          //     // acceptedby: "$acepted_task_id",
          //     image_count: { $sum: "$uploaded_content.imagecount" },
          //     video_count: { $sum: "$uploaded_content.videocount" },
          //     interview_count: { $sum: "$uploaded_content.interviewcount" },

          //     // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
          //   },
          // },
          // {
          //   $lookup: {
          //     from: "acceptedtasks",
          //     localField: "_id",
          //     foreignField: "task_id",
          //     as: "acepted_Contents",
          //   },
          // },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "acepted_Contents.hopper_id",
          //     foreignField: "_id",
          //     as: "acceptedby",
          //   },
          // },


          // {
          //   $lookup: {
          //     from: "categories",
          //     localField: "category_id",
          //     foreignField: "_id",
          //     as: "category_details",
          //   },
          // },
          // {
          //   $lookup: {
          //     from: "users",
          //     let: { task_id: "$acceptedby" },

          //     pipeline: [
          //       {
          //         $match: {
          //           $expr: {
          //             $and: [{ $eq: ["$_id", "$$task_id"] }],
          //           },
          //         },
          //       },
          //     ],
          //     as: "category_details",
          //   },
          // },
        ];

        const facet = {
          //use facet to get total count and data according to limit offset
          $facet: {
            data: [
              {
                $match: { ...condition },
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        };
        //check if limit or offset in data object then fetch data accordint to it
        if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
          facet.$facet.data.push(
            {
              $skip: 0//Number(data.offset),
            },
            {
              $limit: Number(data.limit),
            }
          );
        }
        // if (data.hasOwnProperty("HighestpricedTask")) {
        //   sortBy = { totalPriceofTask: -1 }
        // } else if (data.hasOwnProperty("LowestpricedTask")) {
        //    sortBy =  { totalPriceofTask: 1 }
        // }
        // if (data.hasOwnProperty("HighestpricedTask") || data.hasOwnProperty("LowestpricedTask")) {
        //   facet.$facet.data.push(
        //     {
        //       $skip: 0//Number(data.offset),
        //     },
        //     {
        //       $limit: Number(data.limit),
        //     }
        //   );
        // }
        params.push(facet); //finally push facet in params
        const result = await model.aggregate(params);
        resolve({
          livetask: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },
  async getMinMaxPrice(model, id) {
    return new Promise((resolve, reject) => {
      try {
        const minMax = model.aggregate([
          {
            $match: {
              _id: mongoose.Types.ObjectId(id), // replace with your document id
            },
          },
          {
            $project: {
              min_price: {
                $min: ["$photo_price", "$videos_price", "$interview_price"],
              },
              max_price: {
                $max: ["$photo_price", "$videos_price", "$interview_price"],
              },
            },
          },
        ]);
        resolve(minMax);
      } catch (error) {
        reject(buildErrObject(422, error.message));
      }
    });
  },

  async getSales(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        var date = new Date();
        date.setDate(date.getDate() - data);

        const normalorders = await model.aggregate([
          {
            $match: {
              createdAt: {
                $gte: date,
              },
              order_type: "normal",
              user_view: true,
              order_status: "completed",
            },
          },
          {
            $lookup: {
              from: "orderitems",
              let: { order_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$order_id", "$$order_id"] }],
                    },
                  },
                },
                {
                  $group: {
                    _id: "id",
                    totalorderquantity: {
                      $sum: "$quantity",
                    },
                  },
                },
              ],
              as: "orderItems",
            },
          },
          {
            $unwind: {
              path: "$orderItems",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "id",
              total_amount: {
                $sum: "$total_amount",
              },
              unitSold: {
                $sum: "$orderItems.totalorderquantity",
              },
            },
          },
        ]);
        const returnorders = await model.aggregate([
          {
            $match: {
              createdAt: {
                $gte: date,
              },
              user_view: true,
              order_type: "return",
              return_order_status: "return_completed",
            },
          },
          {
            $lookup: {
              from: "orderitems",
              let: { order_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$order_id", "$$order_id"] }],
                    },
                  },
                },
                {
                  $group: {
                    _id: "id",
                    totalorderquantity: {
                      $sum: "$quantity",
                    },
                  },
                },
              ],
              as: "orderItems",
            },
          },
          {
            $group: {
              _id: "id",
              refund_amount: {
                $sum: "$refund_amount",
              },
              unitSold: {
                $sum: "$orderItems.totalorderquantity",
              },
            },
          },
        ]);
        const sales = {};
        sales.total_amount = (
          (normalorders.length > 0 ? normalorders[0].total_amount : 0) -
          (returnorders.length > 0 ? returnorders[0].refund_amount : 0)
        ).toFixed(2);
        sales.unitSold = (
          (normalorders.length > 0 ? normalorders[0].unitSold : 0) -
          (returnorders.length > 0 ? returnorders[0].unitSold : 0)
        ).toFixed(2);
        sales.normalOrderAmount =
          normalorders.length > 0 ? normalorders[0].total_amount : 0;
        sales.ReturnOrderAmount =
          returnorders.length > 0 ? returnorders[0].refund_amount : 0;
        resolve(sales);
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },
};
