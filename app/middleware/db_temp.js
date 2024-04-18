var bcrypt = require("bcrypt");

const {
  buildSuccObject,
  buildErrObject,
  itemNotFound,
} = require("../middleware/utils");
const mongoose = require("mongoose");

module.exports = {
  /**
   * Gets items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getItems(model, query) {
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

  async addUserBankDetails(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        if (data.is_default == "true") {
          const findUserBank = await model.findOne(
            { _id: data.user_id, "bank_detail.is_default": true },
            { "bank_detail.$": 1 }
          );
          console.log("findUserBank===>", findUserBank);
          if (findUserBank) {

            console.log("isDefault", data.is_default);
            await model.updateOne(
              {
                _id: data.user_id,
                "bank_detail._id": findUserBank.bank_detail[0]._id,
              },
              { $set: { "bank_detail.$.is_default": false } }
            );
          }
        }

        const updateData = await model.updateOne(
          {
            _id: data.user_id,
          },
          { $push: { bank_detail: data } }
        );
        resolve(true);
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async getUserProfile(id, model) {
    return new Promise(async (resolve, reject) => {
      try {
        const params = [
          {
            $match: { _id: mongoose.Types.ObjectId(id) },
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
        ];
        const getData = await model.aggregate(params);
        resolve(getData[0]);
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async updateBankDetail(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        if (data.bank_detail.is_default) {
          const findUserBank = await model.findOne(
            { _id: data.user_id, "bank_detail.is_default": true },
            { "bank_detail.$": 1 }
          );
          console.log("findUserBank===>", findUserBank);
          if (findUserBank) {
            await model.updateOne(
              {
                _id: data.user_id,
                "bank_detail._id": findUserBank.bank_detail[0]._id,
              },
              { $set: { "bank_detail.$.is_default": false } }
            );
          }
        }
        await model.updateOne(
          {
            _id: data.user_id,
            "bank_detail._id": data.bank_detail_id,
          },
          { $set: { "bank_detail.$": data.bank_detail } }
        );
        resolve(true);
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async deleteBankDetail(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        await model.updateOne(
          {
            _id: data.user_id,
          },
          { $pull: { bank_detail: { _id: data.bank_detail_id } } }
        );
        resolve(true);
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async getBankList(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        /* const findUserBanks = await model.findOne(
          { _id: data.user_id },
          { bank_detail: 1 }
        );*/

        const findUserBanks = await model.aggregate(
          [
            {
              $match: { _id: mongoose.Types.ObjectId(data.user_id) },
            },
            {
              $unwind: "$bank_detail",
            },
            {
              $sort: { "bank_detail.is_default": -1 },
            },
            {
              $group: {
                _id: "$_id",
                bank_detail: { $push: "$bank_detail" },
              },
            },
          ]
          // { _id: data.user_id },
          // { bank_detail: 1 }
        );
        resolve(findUserBanks[0].bank_detail);
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },
  async getPriceTipAndFAQs(model, query) {
    return new Promise((resolve, reject) => {
      model.find(query, (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve(items);
      });
    });
  },

  async getContentById(id, model) {
    return new Promise(async (resolve, reject) => {
      try {
        const params = [
          {
            $match: { _id: mongoose.Types.ObjectId(id) , status: "published"  },
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
        ];
        const getData = await model.aggregate(params);
        resolve(getData[0]);
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  async getContentList(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          status: "published",
        };
        if (data.role === "Hopper") {
          condition.hopper_id = mongoose.Types.ObjectId(data.hopper_id);
          if (data.is_draft && data.is_draft) {
            data.is_draft = JSON.parse(data.is_draft);
          }
          if (data.is_draft) {
            //give any status results when user wants its draft results
            delete condition.status;
            condition.is_draft = true;
          }
        }
        const params = [
          {
            $match: condition,
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
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user_details",
            },
          },
          {
            $unwind: {
              path: "$user_details",
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

  async tasksAssignedByMediaHouse(data, model, supermodel) {
    return new Promise(async (resolve, reject) => {
      const user = await model.find(
        {
          address_location:
          {
            $near:
            {
              $geometry: { type: "Point", coordinates: [data.latitude, data.longitude] },
              $minDistance: 1000,
              $maxDistance: 5000
            }
          }
        }).populate('mediahouse_id').then(async (tasks) => {
          console.log(data.hopper_id);
          for (let task of tasks) {
            const taskExist = await supermodel.findOne({ hopper_id: data.hopper_id, task_id: task._id });
            if (taskExist) {
              resolve("No task found")
            } else {
              resolve(task);
            }
          };
        })
    })
  },

  async tasksRequest(model, data) {
    return new Promise((resolve, reject) => {
      model.updateOne(
        {
          _id: data.broadcast_id,
        },
        {
          $push: {
            "accepted_by.hopper_id": data.hopper_id
          },
        },
        (err, item) => {
          console.log("item is +++++++", item);
          itemNotFound(err, item, reject, "NOT_FOUND");
          resolve(item);
        }
      );
    });
  },

  async addTaskContent(model, data) {
    return new Promise(async (resolve, reject) => {
      //  if(data.content){
      //   data.content = data.content.map(content=>content);
      //  }
      const task = await this.createItem(data, model);
      resolve(task);
    });
  },

  async uploadImg(imgs, path) {
    return new Promise(async (resolve, reject) => {
      try {
        let multipleImgs = [];
        let singleImg
        if (imgs && Array.isArray(imgs.images)) {
          for await (const imgData of imgs.images) {
            const image = await uploadFile({
              file: imgData,
              path: `${STORAGE_PATH}/${path}`,
            });
            multipleImgs.push(`https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${image}`);
            resolve(multipleImgs)
          }
        } else if (imgs && !Array.isArray(imgs.images)) {
          var image = await uploadFile({
            file: imgs.images,
            path: `${STORAGE_PATH}/${path}`,
          });
          singleImg = `https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${image}`
          resolve(singleImg)
        }
      } catch (error) {
        reject(buildErrObject(422, error.message));
      }
    });
  },

  async favourites(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {};
        if (data.id) {
          condition._id = mongoose.Types.ObjectId(data.id)
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
                    as: "category_id",
                  },
                },
                {
                  $unwind: {
                    path: "$category_id",
                    preserveNullAndEmptyArrays: true,
                  }
                },
                {
                  $lookup: {
                    from: "tags",
                    localField: "tag_ids",
                    foreignField: "_id",
                    as: "tag_ids",
                  },
                },
                // {
                //   $unwind: {
                //     path: "$tag_ids",
                //     preserveNullAndEmptyArrays: true,
                //   }
                // },
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
          // {
          //   $project: {
          //     // "hopperData.bank_detail": 0,
          //     // "hopperData.password": 0,
          //     "adminData.password": 0,
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
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
          response: result[0].data,
        });
      } catch (error) {
        reject(buildErrObject(422, error));
      }
    });
  },

  async createRoom(body, model) {
    return new Promise(async (resolve, reject) => {
      try {
        var resp = await model.findOne({
          $or: [
            {
              $and: [
                {
                  sender_id: body.sender_id,
                },
                {
                  receiver_id: body.receiver_id,
                },
              ],
            },
            {
              $and: [
                {
                  receiver_id: body.sender_id,
                },
                {
                  sender_id: body.receiver_id,
                },
              ],
            },
          ],
        });

        if (resp) {
          resolve(resp);
        } else {
          resp = await model.create({
            room_id: body.room_id,
            sender_id: body.sender_id,
            receiver_id: body.receiver_id,
          });

          resolve(resp);
        }
      } catch (error) {
        reject(buildErrObject(422, error.message));
      }
    });
  },

  async roomList(body, model) {
    return new Promise((resolve, reject) => {
      try {
        const list = model.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "sender_id",
              foreignField: "_id",
              as: "sender_user",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "receiver_id",
              foreignField: "_id",
              as: "receiver_user",
            },
          },
          {
            $unwind: {
              path: "$sender_user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: "$receiver_user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              $or: [
                { "sender_user._id": mongoose.Types.ObjectId(body.user_id) },
                { "receiver_user._id": mongoose.Types.ObjectId(body.user_id) },
              ],
            },
          },
          {
            $skip: parseInt(body.offset),
          },
          {
            $limit: parseInt(body.limit),
          },
        ]);
        resolve(list);
      } catch (error) {
        reject(buildErrObject(422, error.message));
      }
    });
  },

  async roomDetails(body, model) {
    return new Promise(async (resolve, reject) => {
      try {
        const added = await model
          .findOne({
            _id: body.room_id,
          })
          .populate([
            {
              path: "sender_id",
            },
            {
              path: "receiver_id",
            },
          ]);

        resolve(added);
      } catch (error) {
        reject(buildErrObject(422, error.message));
      }
    });
  },

  async getMinMaxPrice(model, id,) {
    return new Promise((resolve, reject) => {
      try {
        const minMax = model.aggregate([
          {
            $match: {
              _id: mongoose.Types.ObjectId(id) // replace with your document id
            }
          },
          {
            $project: {
              min_price: {
                $min: [
                  "$photo_price",
                  "$videos_price",
                  "$interview_price"
                ]
              },
              max_price: {
                $max: [
                  "$photo_price",
                  "$videos_price",
                  "$interview_price"
                ]
              }
            }
          }
        ])
        resolve(minMax);
      } catch (error) {
        reject(buildErrObject(422, error.message));
      }
    });
  },
}