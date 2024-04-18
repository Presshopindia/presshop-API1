var bcrypt = require("bcrypt");

const {
  buildSuccObject,
  buildErrObject,
  itemNotFound,
  handleError,
} = require("../middleware/utils");
const mongoose = require("mongoose");

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
  async getItems(model, query, sort = { _id: -1 }, limit, offset) {
    return new Promise((resolve, reject) => {
      model
        .find(query, (err, items) => {
          if (err) {
            reject(buildErrObject(422, err.message));
          }
          resolve(items);
        })
        .sort(sort)
        .skip(Number(offset))
        .limit(Number(limit));
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
              localField: "hopper_id",
              foreignField: "_id",
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
          content_id: mongoose.Types.ObjectId(data.content_id),
        };
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
                    $expr: { $eq: ["$_id", "$$content_id"] }
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
                  }
                }
              ],
              as: "ContentData",
            },
          },
          {
            $unwind: {
              path: "$ContentData",
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

  async getPublicationMgmtHistory(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          publication_id: mongoose.Types.ObjectId(data.publication_id),
        };
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
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
            },
          },
          {
            $unwind: {
              path: "$hopper_id",
              preserveNullAndEmptyArrays: true,
            }
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

  async getPublicationList(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          role: "MediaHouse",
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
        const params = [
          {
            $match: condition,
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
            }
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
            }
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


  async getBroadCastHistory(model, data) {
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
                    $expr: { $eq: ["$_id", "$$broadCast_id"] }
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
                  }
                },
                {
                  $project: {
                    "userDetails.password": 0,
                    "userDetails.bank_detail": 0,
                  }
                }
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
                    $expr: { $eq: ["$_id", "$$content_id"] }
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
                  }
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
                  }
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
          role: "Hopper"
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
                $size: "$content_details"
              }
            }
          },
          {
            $addFields: {
              published_content_value: {
                $sum: "$content_details.ask_price"
              }
            }
          },
          {
            $addFields: {
              total_payment_earned: {
                $sum: "$content_details.amount_paid"
              }
            }
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
      const update = model
        .update(
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
        )
      resolve(update);
    })
  },
  async updatePrivacyPlocies(model, body) {
    return new Promise((resolve, reject) => {
      const update = model
        .update(
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
        )
      resolve(update);
    })
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
      const update = model
        .update(
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
        )
      resolve(update);
    })
  },

  async updateDocs(model, body) {
    return new Promise((resolve, reject) => {
      const update = model
        .update(
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
        )
      resolve(update);
    })
  },

  async purchasedContentSummery(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          paid_status: "paid"
        };
        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "hopperpayments",
              let: {
                content_id: "$_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$content_id", "$$content_id"] }
                  }
                },
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
                  }
                }
              ],
              as: "payments",
            },
          },
          {
            $lookup:
            {
              from: "admins",
              localField: "purchased_content_employee_id",
              foreignField: "_id",
              as: "employee_details",
            }
          },
          {
            $unwind: {
              path: "$employee_details",
              preserveNullAndEmptyArrays: true,
            }
          },
          {
            $addFields: {
              purchased_qty: {
                $size: "$payments"
              }
            }
          },
          {
            $addFields: {
              purchased_content: {
                $sum: "$payments.amount"
              }
            }
          },
          {
            $addFields: {
              total_payment_recevied: {
                $sum: "$payments.amount"
              }
            }
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

  async sourcedContentSummery(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
        };
        const params = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "tasks",
              let: {
                mediahouse_id: "$_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$mediahouse_id", "$$mediahouse_id"] }
                  }
                },
              ],
              as: "sourcedContentSummery",
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "source_content_employee",
              foreignField: "_id",
              as: "employe_details",
            },
          },
          {
            $unwind:{
              path:"$employe_details",
              preserveNullAndEmptyArrays:false
            }
          },
          {
            $addFields: {
              tasks_broadcasted: {
                $size: "$sourcedContentSummery"
              }
            }
          },
          {
            $addFields: {
              purchased_qty: {
                $size: {
                  $filter: {
                    input: "$sourcedContentSummery",
                    as: "currdata",
                    cond: { $eq: ["$$currdata.paid_status", "paid"] }
                  }
                },
              },
            },
          },
          {
            $unwind: {
              path: "$sourcedContentSummery",
              preserveNullAndEmptyArrays: false
            }
          },
          {
            $addFields: {
              purchased_content_value: {
                $sum: [
                  "$sourcedContentSummery.photo_price",
                  "$sourcedContentSummery.videos_price",
                  "$sourcedContentSummery.interview_price"
                ]
              }
            }
          },
          {
            $addFields: {
              total_payment_recevable: {
                $sum: [
                  "$sourcedContentSummery.photo_price",
                  "$sourcedContentSummery.videos_price",
                  "$sourcedContentSummery.interview_price"
                ]
              }
            }
          },
          {
            $project: {
              "sourcedContentSummery": 0
            }
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
          sourcedContentSummery: result[0].data,
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
        });
      } catch (err) {
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
  async purchasedContent(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        // const condition = { paid_status: "paid" }
        const condition = {};
        const params = [
          {
            $lookup: {
              from: "contents",
              // let: {
              //   mediahouse_id: "$_id",
              // },
              // pipeline: [
              //   {
              //     $match: {
              //       $expr: {
              //         $and: [
              //           {
              //             $eq: ["$purchased_publication", "$$mediahouse_id"],
              //             $eq: ["$paid_status", "paid"]
              //           }
              //         ]
              //       }
              //     },
              //   },
              // ],
              foreignField: "purchased_publication",
              localField: "_id",
              as: "purchased_publication",
            },
          },
          {
            $addFields: {
              purchased_qty: {
                $size: "$purchased_publication"
              }
            }
          },
          {
            $addFields: {
              purchased_content_value: {
                $sum: "$purchased_publication.amount_paid"
              }
            }
          },
          {
            $addFields: {
              total_payment_recevable: {
                $sum: "$purchased_publication.amount_paid"
              }
            }
          },
          {
            $match: {
              "purchased_qty": { $gt: 0 }
            }
          },
          // {
          //   $project: {
          //     "purchased_publication": 0
          //   }
          // },
          {
            $sort: { _id: -1 },
          },
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
        //   {
        //     $unwind:{
        //       path: "$category_id",
        //       preserveNullAndEmptyArrays: true
        //     }
        //   },
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

};
