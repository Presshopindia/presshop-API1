var bcrypt = require("bcrypt");
var uuid = require("uuid");
const {
  buildSuccObject,
  buildErrObject,
  itemNotFound,
} = require("../middleware/utils");
const mongoose = require("mongoose");
const moment = require("moment");
module.exports = {
  /**
   * Gets items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getItems(model, query) {
    return new Promise((resolve, reject) => {
      model
        .find(query, (err, items) => {
          if (err) {
            reject(buildErrObject(422, err.message));
          }
          resolve(items);
        })
        .populate("category_id")
        .populate({
          path: "hopper_id",
          populate: {
            path: "avatar_id",
          },
        }).populate("category_id")
        .populate({
          path: "content_id",
          populate: {
            path: "category_id",
          },
        }).sort({ createdAt: -1 });
    });
  },

  async getItemswithsort(model, query, sort,data) {


    console.log("data-----------",)
    return new Promise((resolve, reject) => {
      model
        .find(query, (err, items) => {
          if (err) {
            reject(buildErrObject(422, err.message));
          }
          resolve(items);
        })
        .populate({
          path: "hopper_id",
          select:"user_name avatar_id",
          populate: {
            path: "avatar_id",
          },
        })
        .populate({
          path: "completed_by",
          select:"user_name avatar_id",
          populate: {
            path: "avatar_id",
          },
        })
        .populate("category_id")
        .populate({
          path: "content_id",
          populate: {
            path: "category_id",
          },
        })
        .sort(sort).limit(data.limit ?parseInt(data.limit):Number.MAX_SAFE_INTEGER).skip(data.offset ?parseInt(data.offset):0);
    });
  },



  async getItemswithsortOnlyCount(model, query, sort) {


    console.log("data-----------",)
    return new Promise((resolve, reject) => {
      model
        .find(query, (err, items) => {
          if (err) {
            reject(buildErrObject(422, err.message));
          }
          resolve(items);
        })
        .populate({
          path: "hopper_id",
          select:"user_name avatar_id",
          populate: {
            path: "avatar_id",
          },
        })
        .populate({
          path: "completed_by",
          select:"user_name avatar_id",
          populate: {
            path: "avatar_id",
          },
        })
        .populate("category_id")
        .populate({
          path: "content_id",
          populate: {
            path: "category_id",
          },
        })
        .sort(sort)
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

          await model.updateMany(
            {
              _id: mongoose.Types.ObjectId(data.user_id),
            },
            { $set: { "bank_detail.$[].is_default": false} } // Use the $[] operator for all elements
          );


          console.log("findUserBank===>", findUserBank);
          if (findUserBank) {
            console.log("isDefault", data.is_default);
            // await model.updateOne(
            //   {
            //     _id: data.user_id,
            //     "bank_detail._id": findUserBank.bank_detail[0]._id,
            //   },
            //   { $set: { "bank_detail.$.is_default": false } }
            // );


            // await model.updateMany(
            //   {
            //     _id: data.user_id,
            //     "bank_detail.stripe_bank_id": { $ne: data.stripe_bank_id },
            //   },
            //   { $set: { "bank_detail.$[].is_default": false } } // Use the $[] operator for all elements
            // );
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

  async createRoom1(model, body) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("sdsdsd", model);
        if (body.type == "external_task") {
          var resp = await model.findOne({
            $or: [
              {
                $and: [
                  {
                    task_id: mongoose.Types.ObjectId(body.task_id),
                  },
                  {
                    sender_id: mongoose.Types.ObjectId(body.sender_id),
                  },
                  // {
                  //   receiver_id: mongoose.Types.ObjectId(body.receiver_id),
                  // },
                ],
              },
              {
                $and: [
                  {
                    task_id: mongoose.Types.ObjectId(body.task_id),
                  },
                  {
                    receiver_id: mongoose.Types.ObjectId(body.sender_id),
                  },
                  // {
                  //   sender_id: mongoose.Types.ObjectId(body.receiver_id),
                  // },
                ],
              },
            ],
          });
        } else if (body.type == "external_content") {
          var resp = await model.findOne({
            $or: [
              {
                $and: [
                  {
                    content_id: mongoose.Types.ObjectId(body.content_id),
                  },
                  {
                    sender_id: mongoose.Types.ObjectId(body.sender_id),
                  },
                  {
                    receiver_id: mongoose.Types.ObjectId(body.receiver_id),
                  },
                ],
              },
              {
                $and: [
                  {
                    content_id: mongoose.Types.ObjectId(body.content_id),
                  },
                  {
                    receiver_id: mongoose.Types.ObjectId(body.sender_id),
                  },
                  {
                    sender_id: mongoose.Types.ObjectId(body.receiver_id),
                  },
                ],
              },
            ],
          });
        } else if (body.type == "internal_content") {
          var resp = await model.findOne({
            $or: [
              {
                $and: [
                  {
                    content_id: mongoose.Types.ObjectId(body.content_id),
                  },
                  {
                    sender_id: mongoose.Types.ObjectId(body.sender_id),
                  },
                  {
                    receiver_id: mongoose.Types.ObjectId(body.receiver_id),
                  },
                ],
              },
              {
                $and: [
                  {
                    content_id: mongoose.Types.ObjectId(body.content_id),
                  },
                  {
                    receiver_id: mongoose.Types.ObjectId(body.sender_id),
                  },
                  {
                    sender_id: mongoose.Types.ObjectId(body.receiver_id),
                  },
                ],
              },
            ],
          });
        } else {
          var resp = await model.findOne({
            $or: [
              {
                $and: [
                  {
                    sender_id: mongoose.Types.ObjectId(body.sender_id),
                  },
                  {
                    receiver_id: mongoose.Types.ObjectId(body.receiver_id),
                  },
                ],
              },
              {
                $and: [
                  {
                    receiver_id: mongoose.Types.ObjectId(body.sender_id),
                  },
                  {
                    sender_id: mongoose.Types.ObjectId(body.receiver_id),
                  },
                ],
              },
            ],
          });
        }

        if (resp) {
          let detail;
          // console.log("Response", resp);
          if (body.room_type == "mediaHousetoEmployee") {
            detail = await model.aggregate([
              {
                $lookup: {
                  from: "users",
                  foreignField: "_id",
                  localField: "sender_id",
                  as: "senderDetails",
                },
              },
              {
                $unwind: {
                  path: "$senderDetails",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "users",
                  foreignField: "_id",
                  localField: "receiver_id",
                  as: "receiverDetails",
                },
              },
              {
                $unwind: {
                  path: "$receiverDetails",
                  preserveNullAndEmptyArrays: true,
                },
              },

              {
                $match: {
                  _id: mongoose.Types.ObjectId(resp._id),
                },
              },
            ]);
          } else {
            detail = await model.aggregate([
              {
                $lookup: {
                  from: "users",
                  foreignField: "_id",
                  localField: "sender_id",
                  as: "senderDetails",
                },
              },
              {
                $unwind: {
                  path: "$senderDetails",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "users",
                  foreignField: "_id",
                  localField: "receiver_id",
                  as: "receiverDetails",
                },
              },
              {
                $unwind: {
                  path: "$receiverDetails",
                  preserveNullAndEmptyArrays: true,
                },
              },

              {
                $lookup: {
                  from: "admins",
                  foreignField: "_id",
                  localField: "receiver_id",
                  as: "receiverDetails",
                },
              },
              {
                $unwind: {
                  path: "$receiverDetails",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $match: {
                  _id: mongoose.Types.ObjectId(resp._id),
                },
              },
            ]);
          }
          resolve(detail[0]);
        } else {
          resp = await model.create({
            room_id: uuid.v4(),
            sender_id: body.sender_id,
            receiver_id: body.receiver_id,
            task_id: body.task_id,
            room_type: body.room_type,
            type: body.type,
            content_id: body.content_id,
          });
          console.log("dfgdfdfdfdfdfdfdfdfdfd", resp);
          // resolve(added);
        }

        const detail = await model.aggregate([
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "sender_id",
              as: "senderDetails",
            },
          },
          {
            $unwind: {
              path: "$senderDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "receiver_id",
              as: "receiverDetails",
            },
          },
          {
            $unwind: {
              path: "$receiverDetails",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: "admins",
              foreignField: "_id",
              localField: "receiver_id",
              as: "receiverDetails",
            },
          },
          {
            $unwind: {
              path: "$receiverDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              _id: mongoose.Types.ObjectId(resp._id),
            },
          },
        ]);

        resolve(detail[0]);
      } catch (error) {
        console.log(error);
        reject(buildErrObject(422, error.message));
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

  // async updateBankDetail(model, data) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       if (data.bank_detail.is_default) {
  //         const findUserBank = await model.findOne(
  //           { _id: data.user_id, "bank_detail.is_default": true },
  //           { "bank_detail.$": 1 }
  //         );
  //         console.log("findUserBank===>", findUserBank);
  //         if (findUserBank) {
  //           await model.updateOne(
  //             {
  //               _id: data.user_id,
  //               "bank_detail._id": findUserBank.bank_detail[0]._id,
  //             },
  //             { $set: { "bank_detail.$.is_default": false } }
  //           );
  //         }
  //       }
  //       await model.updateOne(
  //         {
  //           _id: data.user_id,
  //           "bank_detail._id": data.bank_detail_id,
  //         },
  //         { $set: { "bank_detail.$": data.bank_detail } }
  //       );
  //       resolve(true);
  //     } catch (err) {
  //       reject(buildErrObject(422, err.message));
  //     }
  //   });
  // },


  async updateBankDetail(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        // if (data.bank_detail.is_default) {
        //   const findUserBank = await model.findOne(
        //     { _id: data.user_id, "bank_detail.is_default": true },
        //     { "bank_detail.$": 1 }
        //   );
        //   console.log("findUserBank===>", findUserBank);
        //   if (findUserBank) {
        //     await model.updateOne(
        //       {
        //         _id: data.user_id,
        //         "bank_detail._id": findUserBank.bank_detail[0]._id,
        //       },
        //       { $set: { "bank_detail.$.is_default": false } }
        //     );
        //   }
        // }

        await model.updateOne(
          {
            _id: data.user_id,
            "bank_detail.stripe_bank_id": data.stripe_bank_id,
          },
          {
            // Update the specified bank detail to set is_default to true
            $set: {
              "bank_detail.$.is_default": true,
            },
            // Update all other bank details to set is_default to false
            // $set: {
            //   "bank_detail": {
            //     $map: {
            //       input: "$bank_detail",
            //       as: "detail",
            //       in: {
            //         $mergeObjects: [
            //           "$$detail",
            //           { is_default: { $cond: [{ $eq: ["$$detail.stripe_bank_id", data.stripe_bank_id] }, true, false] } }
            //         ]
            //       }
            //     }
            //   }
            // }
          }
        );


        // await model.updateMany(
        //   {
        //     _id: data.user_id,
        //     "bank_detail.stripe_bank_id": { $ne: data.stripe_bank_id },
        //   },
        //   { $set: { "bank_detail.$[].is_default": false } } // Use the $[] operator for all elements
        // );
        

        // await model.updateOne(
        //   {
        //     _id: data.user_id,
        //     "bank_detail.stripe_bank_id": data.stripe_bank_id,
        //   },
        //   { $set: { "bank_detail.$.is_default": data.is_default } }
        // );
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

        if (findUserBanks.length > 0) {
          const userBanks = findUserBanks[0].bank_detail;
          // Reorder array to put the first 'true' is_default bank at index 0
          const sortedUserBanks = [
            userBanks.find(bank => bank.is_default) || null, // First element: is_default = true
            ...userBanks.filter(bank => !bank.is_default) // Remaining elements
          ].filter(Boolean); // Filter out nulls if no default is found
        
          findUserBanks[0].bank_detail = sortedUserBanks; // Update the original result
        }
        resolve(findUserBanks[0]?.bank_detail);
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
            $match: { _id: mongoose.Types.ObjectId(id), status: "published" },
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
              from: "chats",
              let: { hopper_id: "$_id" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$image_id", "$$hopper_id"] },
                        { $eq: ["$sender_type", "Mediahouse"] },
                        { $eq: ["$message_type", "Mediahouse_initial_offer"] },
                        { $eq: ["$paid_status", false] }
                      ],
                    },
                  },
                },



                {
                  $addFields: {
                    current_offers: {
                      $cond: {
                        if: {
                          $and: [
                            { $eq: ["$paid_status", false] },
                            // { $eq: ["$paid_status", true] }, // Additional condition
                          ],
                        },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                },
              ],
              as: "offsered_mediahouse",
            },
          },
          {
            $addFields: {
              offer_content_size: { $size: "$offsered_mediahouse" },
              current_offers_of_mediahouse: "$offsered_mediahouse.current_offers",
            },
          },
          // {
          //   $lookup: {
          //     from: "hopperpayments",
          //     localField: "_id",
          //     foreignField: "content_id",
          //     as: "content_data",
          //   },
          // },
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

  async getContentListforHopper(model, data, userId, role) {
    return new Promise(async (resolve, reject) => {
      try {

        const yesterdayStart = new Date(moment(data.startdate).clone().startOf('day'));
        const yesterdayEnd = new Date(moment(data.endDate).clone().endOf('day'));

        const condition = {
          status: "published",
          is_deleted:false,
          paid_status :"un_paid",
          paid_status_to_hopper:false
        };
        if (role === "Hopper") {
          condition.hopper_id = mongoose.Types.ObjectId(userId);
          // if (data.is_draft && data.is_draft) {
          //   data.is_draft = JSON.parse(data.is_draft);
          // }
          if (data.is_draft == "true") {
            //give any status results when user wants its draft results
            delete condition.status;
            condition.is_draft = true;
          }


          if (data.is_draft == "false" || data.is_draft == false) {
            //give any status results when user wants its draft results
            delete condition.paid_status;
            delete condition.paid_status_to_hopper

            const d = new Date()
            const val = d.setDate(d.getDate() - 30)
            
            condition.published_time_date = {
              $gte: new Date(val),
              $lte: new Date()
            };
          }
          
          if (data.type == "exclusive") {
            //give any status results when user wants its draft results
            // delete condition.status;
            delete condition.paid_status;
            delete condition.paid_status_to_hopper
            condition.type = "exclusive";
          }

          if (data.sharedtype == "shared") {
            //give any status results when user wants its draft results
            delete condition.paid_status;
            delete condition.paid_status_to_hopper
            condition.type = "shared";
          }

          if (data.livecontent == "un_paid") {
            //give any status results when user wants its draft results
            // delete condition.status;
            // condition.paid_status = true;
          }

          if (data.sale_status == "sold") {
            //give any status results when user wants its draft results
            delete condition.paid_status;
            condition.paid_status = "paid";
            // condition.paid_status_to_hopper = false;
          }

          if (data.recieved == "recieved") {
            //give any status results when user wants its draft results
            // delete condition.status;
            delete condition.paid_status;
            delete condition.paid_status_to_hopper
            condition.paid_status = "paid";
            condition.paid_status_to_hopper = true;
          }

          if (data.payment_pending == "true") {
            //give any status results when user wants its draft results
            delete condition.paid_status;
            condition.paid_status = "paid";
            condition.paid_status_to_hopper = false;
          }
       
          


          if (data.startdate && data.endDate && data.is_draft == "false" ) {
            // delete condition.status;
            // data.startdate = parseInt(data.startdate);
            // const today = data.endDate;
            // const days = new Date(today.getTime() - (data.startdate*24*60*60*1000));
            // console.log("day back----->",days);
            // delete condition.paid_status;
            // delete condition.paid_status_to_hopper
            condition.published_time_date = {
              $lte: yesterdayEnd,
              $gte: yesterdayStart,
            }; //{[Op.gte]: data.startdate};
          }

          if (data.startdate && data.endDate && data.is_draft == "true") {
            // delete condition.status;
            // data.startdate = parseInt(data.startdate);
            // const today = data.endDate;
            // const days = new Date(today.getTime() - (data.startdate*24*60*60*1000));
            // console.log("day back----->",days);
            // delete condition.paid_status;
            // delete condition.paid_status_to_hopper
            condition.createdAt = {
              $lte: yesterdayEnd,
              $gte: yesterdayStart,
            }; //{[Op.gte]: data.startdate};
          }

          if (data.posted_date) {
            data.posted_date = parseInt(data.posted_date);
            const today = new Date();
            const days = new Date(
              today.getTime() - data.posted_date * 24 * 60 * 60 * 1000
            );
            console.log("day back----->", days);
            condition.createdAt = { $gte: days };
          }
        }

        if (data.posted_date) {
          data.posted_date = parseInt(data.posted_date);
          const today = new Date();
          const days = new Date(
            today.getTime() - data.posted_date * 24 * 60 * 60 * 1000
          );
          console.log("day back----->", days);
          condition.createdAt = { $gte: days };
        }

        // const resp = await Chat.find({
        //   image_id: data.image_id,
        //   sender_type: "Mediahouse",
        //   message_type: "Mediahouse_initial_offer",
        // }).populate("receiver_id sender_id");

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
            $lookup: {
              from: "users",
              localField: "purchased_publication",
              foreignField: "_id",
              as: "purchased_publication_details",
            },
          },
          {
            $unwind: {
              path: "$purchased_publication_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          // {
          //   $lookup: {
          //     from: "chats",
          //     localField: "_id",
          //     foreignField: "image_id",
          //     as: "offsered_mediahouse",
          //   },
          // },

          {
            $lookup: {
              from: "chats",
              let: { hopper_id: "$_id" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$image_id", "$$hopper_id"] },
                        { $eq: ["$sender_type", "Mediahouse"] },
                        { $eq: ["$message_type", "Mediahouse_initial_offer"] },
                        { $eq: ["$paid_status", false] }
                      ],
                    },
                  },
                },



                {
                  $addFields: {
                    current_offers: {
                      $cond: {
                        if: {
                          $and: [
                            { $eq: ["$paid_status", false] },
                            // { $eq: ["$paid_status", true] }, // Additional condition
                          ],
                        },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                },
              ],
              as: "offsered_mediahouse",
            },
          },
          {
            $addFields: {
              offer_content_size: { $size: "$offsered_mediahouse" },
              current_offers_of_mediahouse: "$offsered_mediahouse.current_offers",
            },
          },
          // {
          //   $addFields: {
          //     offer_content_size: {
          //       $cond: {
          //         if: {
          //           $and: [
          //             { $gt: ["$latitude", 0] },
          //             // { $eq: ["$paid_status", true] }, // Additional condition
          //           ],
          //         },
          //         then: 1,
          //         else: 0,
          //       },
          //     },
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
      const user = await model
        .find({
          address_location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [data.latitude, data.longitude],
              },
              $minDistance: 1000,
              $maxDistance: 5000,
            },
          },
        })
        .populate("mediahouse_id")
        .then(async (tasks) => {
          console.log(data.hopper_id);
          for (let task of tasks) {
            const taskExist = await supermodel.findOne({
              hopper_id: data.hopper_id,
              task_id: task._id,
            });
            if (taskExist) {
              resolve("No task found");
            } else {
              resolve(task);
            }
          }
        });
    });
  },

  async tasksRequest(model, data) {
    return new Promise((resolve, reject) => {
      model.updateOne(
        {
          _id: data.broadcast_id,
        },
        {
          $push: {
            "accepted_by.hopper_id": data.hopper_id,
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
        let singleImg;
        if (imgs && Array.isArray(imgs.images)) {
          for await (const imgData of imgs.images) {
            const image = await uploadFile({
              file: imgData,
              path: `${STORAGE_PATH}/${path}`,
            });
            multipleImgs.push(
              `https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${image}`
            );
            resolve(multipleImgs);
          }
        } else if (imgs && !Array.isArray(imgs.images)) {
          var image = await uploadFile({
            file: imgs.images,
            path: `${STORAGE_PATH}/${path}`,
          });
          singleImg = `https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${image}`;
          resolve(singleImg);
        }
      } catch (error) {
        reject(buildErrObject(422, error.message));
      }
    });
  },

  async favourites(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = { user_id: data.user_id };

        let sortBy = { createdAt: -1 }
        if (data.favcontent == "latest") {
          sortBy = {
            createdAt: -1,
          };
        }
        //ask_price
        if (data.favcontent == "lowPrice") {
          sortBy = {
            ask_price: 1,
          };
        }
        if (data.favcontent == "highPrice") {
          sortBy = {
            ask_price: -1,
          };
        }

        if (data.sort == "latest") {
          sortBy = {
            createdAt: -1,
          };
        }
        //ask_price
        if (data.sort == "low_price_content") {
          sortBy = {
            ask_price: 1,
          };
        }
        if (data.sort == "high_price_content") {
          sortBy = {
            ask_price: -1,
          };
        }
        let condition1 = {};
        if (data.maxPrice && data.minPrice) {
          condition1 = {
            $expr: {
              $and: [
                { $gte: ["$content_id.ask_price", data.minPrice] },
                { $lte: ["$content_id.ask_price", data.maxPrice] },
              ],
            },
          };
        }


        if (data.favMaxPrice) {
          condition1 = {
            $expr: {
              $and: [
                // { $gte: ["$content_id.ask_price", data.minPrice] },
                { $lte: ["$content_id.ask_price", data.favMaxPrice] },
              ],
            },
          };
        }
        if (data.favMinPrice) {
          condition1 = {
            $expr: {
              $and: [
                { $gte: ["$content_id.ask_price", data.favMinPrice] },
                // { $lte: ["$content_id.ask_price", data.favMaxPrice] },
              ],
            },
          };
        }
        if (data.contentType) {
          condition1.type = data.contentType;
        }

        if (data.id) {
          condition._id = mongoose.Types.ObjectId(data.id);
        }




        let val = "year";
        if (data.hasOwnProperty("daily")) {
          val = "day";
        }
        if (data.hasOwnProperty("Weekly")) {
          val = "week";
        }
    
        if (data.hasOwnProperty("Monthly")) {
          val = "month";
        }
    
        if (data.hasOwnProperty("Yearly")) {
          val = "year";
        }

        if (data.sort && data.sort != "high_price_content" && data.sort != "low_price_content") {
          val = data.sort
        }
    
        const yesterdayStart = new Date(moment().utc().startOf(val).format());
        const yesterdayEnd = new Date(moment().utc().endOf(val).format());

        let cond = {}

        if (data.daily || data.yearly || data.monthly || data.weekly) {
          condition1.createdAt = {
            $lte: yesterdayEnd,
            $gte: yesterdayStart,
          }
          // cond = {
          //   createdAt: {
          //     $lte: yesterdayEnd,
          //     $gte: yesterdayStart,
          //   },
          // };
        } 

        if (data.sort && data.sort != "high_price_content" && data.sort != "low_price_content") {
          // cond = {
          //   createdAt: {
          //     $lte: yesterdayEnd,
          //     $gte: yesterdayStart,
          //   },
          // };
          condition1.createdAt = {
            $lte: yesterdayEnd,
            $gte: yesterdayStart,
          }
        }

        console.log('data.user_id---------------------->', data.user_id)
        const params = [
          {
            $match: condition,
          },

          {
            $lookup: {
              from: "baskets",
              let: { id: "$content_id", user_id: mongoose.Types.ObjectId(data.user_id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$post_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }
  
                      ],
                    },
                  },
                },
  
              ],
              as: "bakset_data",
            },
          },
  
          {
            $addFields: {
              basket_status: {
                $cond: {
                  if: { $ne: [{ $size: "$bakset_data" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
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
                    $expr:  {
                      $and: [
                        { $eq: ["$_id", "$$content_id"] },
                        { $not: { $in: [data.user_id, "$purchased_mediahouse"] } },
                        { $eq: ["$is_deleted", false] },
                        // { $eq: ["$message_type", "Mediahouse_initial_offer"] },
                        // { $eq: ["$paid_status", false] }
                      ],
                    },
                    // { $eq: ["$_id", "$$content_id"] },
                  },
                },
                {
                  $match:cond
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
                  $lookup: {
                    from: "tags",
                    localField: "tag_ids",
                    foreignField: "_id",
                    as: "tag_ids",
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    // localField: "hopper_id",
                    // foreignField: "_id",
                    let: {
                      hopper_id: "$hopper_id",
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$_id", "$$hopper_id"] }
                        }
                      },
                      {
                        $lookup: {
                          from: "avatars",
                          localField: "avatar_id",
                          foreignField: "_id",
                          as: "avatar_id"
                        }
                      },
                      {
                        $unwind: {
                          path: "$avatar_id",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
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
            $addFields: {
              ask_price: "$content_id.ask_price",
            },
          },
          {
            $addFields: { type: "$content_id.type" },
          },


          
          {
            $match: {content_id:{$exists:true}},
          },
          {
            $match: condition1,
          },
          {
            // $sort: { _id: -1 },
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
          totalCount: result[0].totalCount[0]
            ? result[0].totalCount[0].count
            : 0,
          response: data.id ? result[0].data[0] : result[0].data,
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

  async acceptedHopperListDatafortask(model, data, userID) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataLimit = data.limit ? Number(data.limit) : 10;
        const dataOffset = data.offset ? Number(data.offset) : 0;
        const condition = {
          task_id: mongoose.Types.ObjectId(data.task_id),
          task_status: "accepted",
          // hopper_id:mongoose.Types.ObjectId(userID)
        };
        // if (userID) {
        //   condition.task_id = mongoose.Types.ObjectId(data.task_id)
        // }
        const param = [
          {
            $match: condition,
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
        console.log("param------------>", param);
        const list = await model.aggregate(param);
        resolve(list);
      } catch (error) {
        reject(buildErrObject(422, error.message));
      }
    });
  },

  async acceptedHopperListData(model, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataLimit = data.limit ? Number(data.limit) : 10;
        const dataOffset = data.offset ? Number(data.offset) : 0;
        const condition = {};

        if (data.hopper_id) {
          condition.hopper_id = mongoose.Types.ObjectId(data.hopper_id);
        }

        const param = [
          {
            $match: condition,
          },
          {
            $lookup: {
              from: "users",
              let: {
                hopper_id: data.hopper_id ? condition : "$hopper_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$hopper_id"] },
                  },
                },
              ],
              as: "hopper_details",
            },
          },
          {
            $unwind: {
              path: "$hopper_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              hopper_details: 1,
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

        const list = await model.aggregate(param);
        resolve(list);
      } catch (error) {
        reject(buildErrObject(422, error.message));
      }
    });
  },
};
