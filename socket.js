require("dotenv-safe").config();

const app = require("express")();
const cors = require("cors");
const fs = require("fs");
app.options("*", cors());
const initMongo = require("./config/mongo");
const Content = require("./app/models/contents");
const Room = require("./app/models/room");
const lastchat = require("./app/models/latestchat");
const rating = require("./app/models/rating");
const HopperPayment = require("./app/models/hopperPayment");
const Chat = require("./app/models/chat");
const uploadedContent = require("./app/models/uploadContent");
const BroadCastTask = require("./app/models/mediaHouseTasks");
const uuid = require("uuid");
const User = require("./app/models/user");
const MhInternalGroups = require("./app/models/mh_internal_groups");
var mime = require("mime-types");
const notify = require("./app/middleware/notification");
const notification = require("./app/models/notification");
const db = require("./app/middleware/db");
// const http = require('http');
const FcmDevice = require("./app/models/fcm_devices");
const { resolve } = require("path");
const options = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/uat.presshop.live/privkey.pem",
    "utf8"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/uat.presshop.live/fullchain.pem",
    "utf8"
  ),
};
// const app = express();
// const server = http.createServer(app);
const https = require("https").createServer(options,app);
const io = require("socket.io")(https, {
  // for cors purpose
  pingInterval:1000 * 60 * 5,
  pingTimeout: 1000 * 60 * 3,
  // cookie: false,
  // transports: ["websocket"],
  // serveClient: false,
  // for cors purpose
  cors: {
    origin: "*", // allowed any origin
  },
});
const port = process.env.SOCKET_PORT || 5021;

const dir_file = "/var/www/mongo/presshop_rest_apis/";
const public_path = "/app/chat/";

app.get("/", async (req, res) => {
  console.log("dsdsdsd");
  /*const d = {
    room_id : uuid.v4(),
    sender_id : "6135e42bdeb6c01340bd8222",    
    receiver_id : "61361d90fee6eb15328f0b4e",
    room_type : "individual",
  }
  await Room.create(d)*/
  res.sendFile(__dirname + "/index.html");
});


let onlineUser = [];
io.on("connection", (socket) => {
  console.log("Socket connected...", socket.client.conn.server.clientsCount);
  socket.on('chat group', async (msg) => {
    console.log('msg aya----->', msg);
    const chat = await Chat.create(msg);
    console.log('chat----->', chat);
    io.to(msg.room_id).emit('chat group', chat);
  });

  socket.on("addAdmin", (user) => {
    onlineUser.push({ userId: user, socketId: socket.id });
    io.emit("getAdmins", onlineUser);
    socket.on("disconnect", () => {
      onlineUser = onlineUser?.filter((el) => el.socketId !== socket.id);
      io.emit("getAdmins", onlineUser)
    })
  })

  // Total user connected
  setInterval(function () {
    // console.log(socket.client.conn.server.clientsCount)
    io.sockets.emit(
      "total participants",
      socket.client.conn.server.clientsCount
    );
  }, 1000);



  const _sendPushNotification = async (data) => {
    console.log(
      "------------------------------------------ N O T I F I C A T I O N -----------------------------------",
      data
    );
    if (data) {
      User.findOne({
        _id: data.sender_id,
      }).then(
        async (senderDetail) => {
          if (senderDetail) {
            let body, title;
            // var message = "";
            let notificationObj = {
              sender_id: data.sender_id,
              receiver_id: data.receiver_id,
              title: data.title,
              body: data.body,
            };



            

          //   if (findnotifivation) {
          //     await notification.updateOne({ _id: findnotifivation._id }, { createdAt: new Date() })
          //   } else {
          //     const create = await db.createItem(notificationObj, notification);
          //     console.log("create: ", create);
          //   }
          // } catch (err) {
          //   console.log("main err: ", err);
          // }
            try {
              console.log(
                "--------------- N O T I - - O B J ------",
                notificationObj
              );
              const findnotifivation = await notification.findOne(notificationObj)
     if (findnotifivation) {
              await notification.updateOne({ _id: findnotifivation._id }, { createdAt: new Date() })
            } else {
              const create = await db.createItem(notificationObj, notification);
              console.log("create: ", create);
            }
              await db.createItem(notificationObj, notification);
            } catch (err) {
              console.log("main err: ", err);
            }

            // console.log("Before find user device");

            const log = await FcmDevice.find({
              user_id: data.receiver_id,
            })
              .then(
                (fcmTokens) => {
                  console.log("fcmTokens", fcmTokens);
                  if (fcmTokens) {
                    const device_token = fcmTokens.map((ele) => ele.device_token);
                    console.log(device_token);

                    const r = notify.sendPushNotificationforAdmin(
                      device_token,
                      data.title,
                      data.body,
                      notificationObj
                    );
                    return r;
                  } else {
                    console.log("NO FCM TOKENS FOR THIS USER");
                  }
                },
                (error) => {
                  throw utils.buildErrObject(422, error);
                }
              )
              .catch((err) => {
                console.log("err: ", err);
              });
          } else {
            throw utils.buildErrObject(422, "sender detail is null");
          }
        },
        (error) => {
          console.log("notification error in finding sender detail", error);
          throw utils.buildErrObject(422, error);
        }
      );
    } else {
      throw utils.buildErrObject(422, "--* no type *--");
    }
  };

  async function userDetails(data) {

    let USER = await User.findOne({
      _id: data,
    });
    return USER
  }

  // For send message and recieve
  socket.on("chat message", async (msg) => {
    console.log("chat msg)))))", msg);
    var USER = await User.findOne({
      _id: msg.image_id,
    });

    // if (!msg.room_type) {
    //   msg.room_type = "individual";
    // }

    // if (msg.room_type === "individual") {
    const added = await Chat.create({
      room_id: msg.room_id,
      message: msg.message,
      image_id: msg.image_id,
      rating: msg.rating,
      review: msg.review,
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      message_type: msg.message_type,
      amount: msg.amount
    });


    const findroom = await Room.findOne({
      room_id: msg.room_id,
    });
    let lastchats = await lastchat.create({
      room_id: msg.room_id,
      content_id: msg.content_id,
      mediahouse_id: msg.sender_id,
      hopper_id: msg.receiver_id,
    });
    console.log("findroom", findroom)
    if (msg.message_type == "reject_mediaHouse_offer") {
      const added = await Content.update({
        _id: findroom.content_id,
      }, { content_under_offer: false });

    } else if (msg.message_type == "offer_started") {
      const notiObj = {
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        // data.receiver_id,
        title: " content offered ",
        body: `content offered by mediahouse ${msg.sender_id}`,
      };
      console.log(notiObj);
      const resp = await _sendPushNotification(notiObj);

      const added = await Content.update({
        _id: findroom.content_id,
      }, { content_under_offer: true });

    } else if (msg.message_type == "hopper_counter_offer") {
      const mediahouse = await userDetails(msg.sender_id)
      const notiObj = {
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        // data.receiver_id,
        title: "Counter offer made by you(Socket)",
        body: `${mediahouse.user_name}, has made a final counter offer of £${msg.finaloffer_price} price for the content. Please accept and pay to purchase the content or reject the offer. Thanks 😊🤟🏼`,
      };

      const notiObj1 = {
        sender_id: msg.sender_id,
        receiver_id: "64bfa693bc47606588a6c807",
        // data.receiver_id,
        title: "OFFER Recieved",
        body: `${mediahouse.user_name}, has made a final counter offer of £${msg.finaloffer_price} price for the content. Please accept and pay to purchase the content or reject the offer. Thanks 😊🤟🏼`,
      };
      const resp1 = await _sendPushNotification(notiObj);
      console.log(notiObj);
      const resp = await _sendPushNotification(notiObj1);
    } else if (msg.message_type == "mediahouse_counter_offer") {
      const hopper = await  userDetails(msg.receiver_id)
      const mediahouse = await  userDetails(msg.sender_id)
      console.log("msg--------------",msg)
      const notiObj = {
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        // data.receiver_id,
        title: "Counter offer made by you(Socket)",
        body: `👋🏼 Hi ${hopper.user_name}, thank you for making your counter offer of £${msg.finaloffer_price} to ${mediahouse.first_name}. We will update you shortly with their decision. Fingers crossed 🤞🏼`,
      }
      const resp = await _sendPushNotification(notiObj);
    }

    else {
      console.log("error")
    }

    io.to(msg.room_id).emit("chat message", added);
    // } 
    /* else {
      // group chat

      const added = await Chat.create({
        room_id: msg.room_id,
        message: msg.message,
        sender_id: msg.sender_id,
        primary_room_id: msg.primary_room_id,
        room_type: msg.room_type,
      });

      io.to(msg.room_id).emit("chat message", added);
    } */

    // io.to(msg.room_id).emit('chat message', msg);
  });






  socket.on("getallchat", async (msg) => {
    console.log("chat msg)))))", msg);

    // if (!msg.room_type) {
    //   msg.room_type = "individual";
    // }

    // if (msg.room_type === "individual") {
    var resp = await Chat.find({ room_id: msg.room_id }).populate(
      "receiver_id sender_id"
    );

    io.to(msg.room_id).emit("getallchat", resp);
    // } 
    /* else {
      // group chat

      const added = await Chat.create({
        room_id: msg.room_id,
        message: msg.message,
        sender_id: msg.sender_id,
        primary_room_id: msg.primary_room_id,
        room_type: msg.room_type,
      });

      io.to(msg.room_id).emit("chat message", added);
    } */

    // io.to(msg.room_id).emit('chat message', msg);
  });

  socket.on("updatehide", async (msg) => {
    console.log("chat msg)))))", msg);

    // if (!msg.room_type) {
    //   msg.room_type = "individual";
    // }

    // if (msg.room_type === "individual") {
    const added = await Chat.update({
      _id: msg.chat_id,
    }, { is_hide: true });

    io.to(msg.room_id).emit("updatehide", added);

  });



  socket.on("media message", async (msg) => {
    console.log(msg);

    if (!msg.room_type) {
      msg.room_type = "individual";
    }
    const resp = await Room.findOne({ room_id: msg.room_id })
    console.log("taskdetails", resp)
    const findtask = resp.task_id
    const taskdetails = await BroadCastTask.findOne({ _id: findtask })
    console.log("taskdetails", taskdetails)

    const contentType = mime.lookup(msg.attachment_name);
    let attachments;
    if (msg.media_type == "image") {


      attachments = {
        name: msg.attachment_name,
        mime: msg.media_type,
        size: msg.attachment_size,
        url: msg.attachment,
        thumbnail_url: msg.thumbnail_url,
        amount: taskdetails.photo_price
      }

    } else if (msg.media_type == "video") {
      attachments = {
        name: msg.attachment_name,
        mime: msg.media_type,
        size: msg.attachment_size,
        url: msg.attachment,
        thumbnail_url: msg.thumbnail_url,
        amount: taskdetails.videos_price
      }
    } else {
      attachments = {
        watermarkimage_url: msg.watermarkimage_url,
        name: msg.attachment_name,
        mime: msg.media_type,
        size: msg.attachment_size,
        url: msg.attachment,
        thumbnail_url: msg.thumbnail_url,
        amount: taskdetails.interview_price
      }
    }

    // if (msg.room_type == "individual") {
    const added = await Chat.create({
      room_id: msg.room_id,
      message: msg.message,
      primary_room_id: msg.primary_room_id,
      sender_id: msg.sender_id,
      // message_type : "media",
      // type: msg.type,
      image_id: msg.image_id,
      sender_type: msg.sender_type,
      message_type: msg.message_type,
      // message_type: msg.message_type,
      media: attachments,
      receiver_id: msg.receiver_id,
      room_type: msg.room_type,
    });


    // const d = await Chat.updateMany({
    //   image_id: msg.image_id,
    // },{request_sent:null });


    console.log("IN IFFFFFF", added);
    io.to(msg.room_id).emit("media message", added);
    // } else {
    //   // group chat
    //   console.log("IN ELSSSSSS");
    //   const added = await Chat.create({
    //     room_id: msg.room_id,
    //     message: msg.message,
    //     sender_id: msg.sender_id,
    //     receiver_id: msg.receiver_id,
    //     primary_room_id: msg.primary_room_id,
    //     room_type: msg.room_type,
    //   });

    //   io.to(msg.room_id).emit("media message", added);
    // }

    // io.to(msg.room_id).emit('chat message', msg);
  });


  socket.on("offer message", async (msg) => {
    console.log(msg);

    if (!msg.room_type) {
      msg.room_type = "individual";
    }

    // const contentType = mime.lookup(msg.attachment_name);

    const attachments = {
      mime: msg.media_type,
      url: msg.attachment
    }


    const d = await Chat.updateMany({
      room_id: msg.room_id,
    }, { request_sent: "sent" });

    // if (msg.room_type == "individual") {
    const added = await Chat.create({
      room_id: msg.room_id,
      // type: msg.type,
      request_sent: "sent",
      sender_type: msg.sender_type,
      // message: msg.message,
      // primary_room_id: msg.primary_room_id,
      sender_id: msg.sender_id,
      // media_ttype : "media",
      message_type: msg.message_type,
      media: attachments,
      receiver_id: msg.receiver_id,
      room_type: msg.room_type,
    });






    console.log("IN IFFFFFF", added);
    io.to(msg.room_id).emit("offer message", added);
    // } else {
    //   // group chat
    //   console.log("IN ELSSSSSS");
    //   const added = await Chat.create({
    //     room_id: msg.room_id,
    //     message: msg.message,
    //     sender_id: msg.sender_id,
    //     receiver_id: msg.receiver_id,
    //     primary_room_id: msg.primary_room_id,
    //     room_type: msg.room_type,
    //   });

    //   io.to(msg.room_id).emit("media message", added);
    // }

    // io.to(msg.room_id).emit('chat message', msg);
  });



  socket.on("rating", async (msg) => {
    console.log(msg);

    const update = await Chat.updateMany({
      _id: msg.chat_id,
    }, { rating: msg.rating, review: msg.review });



    // console.log("IN IFFFFFF", added );
    io.to(msg.room_id).emit("rating", update);
    // } else {
    //   // group chat
    //   console.log("IN ELSSSSSS");
    // const added = await rating.create({
    //   from: msg.sender_id,
    //   to: msg.receiver_id,
    //   review: msg.review,
    //   rating: msg.rating,
    //   sender_type: msg.sender_type,
    //   // is_rated:true
    // });

    const mediahouse =await  userDetails(msg.receiver_id)
    const sender =await  userDetails(msg.sender_id)
    const notiObj = {
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      // data.receiver_id,
      title: "rating",
      body: `👋🏼 Hi ${mediahouse.user_name}, you have received a ${msg.rating} star rating from ${sender.user_name}. Please check Ratings and Reviews on your app to read the review. Good luck - Team PRESSHOP🐰 `,
    };


    const resp1 = await _sendPushNotification(notiObj);




    if (msg.type == "content") {

      const find = await HopperPayment.findOne({
        content_id: msg.image_id,
      });

      const added = await rating.create({
        from: msg.sender_id,
        to: msg.receiver_id,
        content_id: msg.image_id,
        type: msg.type,
        review: msg.review,
        rating: msg.rating,
        sender_type: msg.sender_type,
        is_rated: true
      });


      const updateHoppePA = await HopperPayment.updateMany({
        content_id: msg.image_id,
      }, { is_rated: true });
    } else if(msg.image_id ){
      const find = await HopperPayment.findOne({
        task_content_id: msg.image_id,
      });
      const added = await rating.create({
        from: msg.sender_id,
        to: msg.receiver_id,
        task_content_id: msg.image_id,
        type: msg.type,
        review: msg.review,
        rating: msg.rating,
        sender_type: msg.sender_type,
        is_rated: true
      });

      const updateHoppePA = await HopperPayment.updateMany({
        task_content_id: msg.image_id,
      }, { is_rated: true });
    }


    //   io.to(msg.room_id).emit("media message", added);
    // }

    // io.to(msg.room_id).emit('chat message', msg);
  });

  socket.on("voice message", (msg) => {
    console.log("voice message", msg.room_id);
    //console.log(msg);
    let base64String = msg.data; // Not a real image
    // Remove header
    // let base64File = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    let base64File = base64String.replace(
      "data:audio/wav; codecs=opus;base64,",
      ""
    );
    var filename = Date.now() + ".wav";

    fs.writeFile(
      dir_file + filename,
      base64File,
      { encoding: "base64" },
      function (err) {
        if (err) {
          console.log(err);
        }

        console.log("File created");
        msg.file = public_path + "" + filename;

        io.to(msg.room_id).emit("voice message", msg);
      }
    );
  });



  // For join room
  socket.on("room join", (msg) => {
    socket.join(msg.room_id);
    console.log("Room joined -> ", msg.room_id);
    io.to(msg.room_id).emit("room join", msg);
  });

  socket.on("leave room", (msg) => {
    console.log("LEAVING", msg);
    socket.leave(msg.room_id);
    io.to(msg.room_id).emit("leave room", msg);
  });



  socket.on("buy", async (msg) => {
    console.log(msg);

    // if (!msg.room_type) {
    //   msg.room_type = "individual";
    // }

    // const contentType = mime.lookup(msg.attachment_name);

    // const attachments = {
    //   name : msg.attachment_name,
    //   mime: msg.media_type,
    //   size: msg.attachment_size,
    //   url: msg.attachment
    // }

    // if (msg.room_type == "individual") {
    const added = await Chat.update({
      image_id: msg.primary_id,
    }, { paid_status: true });

    const added1 = await uploadedContent.update({
      _id: msg.image_id,
    }, { paid_status: true });

    console.log("IN IFFFFFF", added);
    io.to(msg.room_id).emit("buy", added);
    // } else {
    //   // group chat
    //   console.log("IN ELSSSSSS");
    //   const added = await Chat.create({
    //     room_id: msg.room_id,
    //     message: msg.message,
    //     sender_id: msg.sender_id,
    //     receiver_id: msg.receiver_id,
    //     primary_room_id: msg.primary_room_id,
    //     room_type: msg.room_type,
    //   });

    //   io.to(msg.room_id).emit("media message", added);
    // }

    // io.to(msg.room_id).emit('chat message', msg);
  })

  socket.on("reqstatus", async (msg) => {
    console.log(msg);

    // if (!msg.room_type) {
    //   msg.room_type = "individual";
    // }

    // const contentType = mime.lookup(msg.attachment_name);

    // const attachments = {
    //   name : msg.attachment_name,
    //   mime: msg.media_type,
    //   size: msg.attachment_size,
    //   url: msg.attachment
    // }

    // if (msg.room_type == "individual") {
    const added = await Chat.update({
      _id: msg.chat_id,
    }, { request_status: msg.status });



    // const rated = await rating.create({
    //   from: msg.sender_id,
    //   to: msg.receiver_id,

    //   primary_room_id: msg.primary_room_id,
    //   room_type: msg.room_type,
    // });

    console.log("IN IFFFFFF", added);
    io.to(msg.room_id).emit("reqstatus", added);
    // } else {
    //   // group chat
    //   console.log("IN ELSSSSSS");
    //   const added = await Chat.create({
    //     room_id: msg.room_id,
    //     message: msg.message,
    //     sender_id: msg.sender_id,
    //     receiver_id: msg.receiver_id,
    //     primary_room_id: msg.primary_room_id,
    //     room_type: msg.room_type,
    //   });

    //   io.to(msg.room_id).emit("media message", added);
    // }

    // io.to(msg.room_id).emit('chat message', msg);
  })


  socket.on("initialoffer", async (msg) => {
    console.log(msg);

    // if (!msg.room_type) {
    //   msg.room_type = "individual";
    // }

    // const contentType = mime.lookup(msg.attachment_name);

    // const attachments = {
    //   name : msg.attachment_name,
    //   mime: msg.media_type,
    //   size: msg.attachment_size,
    //   url: msg.attachment
    // }

    const taskdetails = await Content.findOne({ _id: msg.content_id })
    console.log("taskdetails", taskdetails)

    // if (msg.room_type == "individual") {
    // const added = await Chat.create({
    //   room_id: msg.room_id,
    //   // type: msg.type,
    //   // request_sent:"sent",
    //   image_id:msg.content_id,
    //   sender_type:msg.sender_type,
    //   initial_offer_price:msg.initial_offer_price,
    //   finaloffer_price:msg.finaloffer_price,
    //   offer_accepted:msg.offer_accepted,
    //   amount:taskdetails.ask_price,
    //   // message: msg.message,
    //   // primary_room_id: msg.primary_room_id,
    //   sender_id: msg.sender_id,
    //   // media_ttype : "media",
    //   message_type: msg.message_type,
    //   // media: attachments,
    //   receiver_id: msg.receiver_id,
    //   room_type: msg.room_type,
    // });

    let added;
    if (msg.sender_type == "hopper") {
      added = await Chat.create({
        room_id: msg.room_id,
        // type: msg.type,
        // request_sent:"sent",
        image_id: msg.content_id,
        sender_type: msg.sender_type,
        initial_offer_price: msg.initial_offer_price,
        finaloffer_price: msg.finaloffer_price,
        is_hide: msg.is_hide,
        amount: taskdetails.ask_price,
        // message: msg.message,
        // primary_room_id: msg.primary_room_id,
        sender_id: msg.sender_id,
        // media_ttype : "media",
        message_type: msg.message_type,
        // media: attachments,
        receiver_id: msg.receiver_id,
        room_type: msg.room_type,
      });


      const update = await Chat.updateMany({
        _id: msg.chat_id,
      }, { is_hide: true, finaloffer_price: msg.finaloffer_price });
    } else {
      added = await Chat.create({
        room_id: msg.room_id,
        // type: msg.type,
        // request_sent:"sent",
        image_id: msg.content_id,
        sender_type: msg.sender_type,
        initial_offer_price: msg.initial_offer_price,
        finaloffer_price: msg.finaloffer_price,
        // offer_accepted:msg.offer_accepted,
        amount: taskdetails.ask_price,
        // message: msg.message,
        // primary_room_id: msg.primary_room_id,
        sender_id: msg.sender_id,
        // media_ttype : "media",
        message_type: msg.message_type,
        // media: attachments,
        receiver_id: msg.receiver_id,
        room_type: msg.room_type,
      });
      let lastchats = await lastchat.create({
        room_id: msg.room_id,
        content_id: msg.content_id,
        mediahouse_id: msg.sender_id,
        hopper_id: msg.receiver_id,
      });
      console.log("latestchat=============1", lastchats)

      if (msg.message_type == "Mediahouse_initial_offer") {
        let lastchats = await lastchat.create({
          room_id: msg.room_id,
          content_id: msg.content_id,
          mediahouse_id: msg.sender_id,
          hopper_id: msg.receiver_id,
        });
        console.log("latestchat=============", lastchats)
        const added = await Content.update({
          _id: msg.content_id,
        }, { content_under_offer: true });

        const findreceiver = await Content.findOne({
          _id: msg.content_id,
        });
        const purchased_mediahouse = findreceiver.offered_mediahouses.map((hopperIds) => hopperIds);
        if (!purchased_mediahouse.includes(msg.sender_id)) {
          const update = await Content.updateOne(
            { _id: msg.content_id },
            { $push: { offered_mediahouses: msg.sender_id }, }
          );
        }

        const users = await userDetails(msg.sender_id)
        const users2 = await userDetails(msg.receiver_id)

        const notiObj = {
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          // data.receiver_id,
          title: "Offer received ",
          body: `BINGO 🤟🏼🤑 You have recieved an offer of ${msg.initial_offer_price} from the ${users.user_name}. Visit My Content to accept, reject or make a counter offer. Let's do this🚀`,
        };


        const notiObj3 = {
          sender_id: msg.receiver_id,
          receiver_id: msg.sender_id,
          // data.receiver_id,
          title: "Offer received ",
          body: `👋🏼 Hey guys, thank you for your generous offer of ${msg.initial_offer_price} . We will keep you informed when ${users2.user_name} accepts, rejects or makes a counter offer. Cheers🤩`,
        };
        const notiObj2 = {
          sender_id: msg.sender_id,
          receiver_id: "64bfa693bc47606588a6c807",
          // data.receiver_id,
          title: "Offer received ",
          body: `Offer received  - ${users2.user_name} has received an offer for ${msg.initial_offer_price} from The ${users.user_name}`,
        };
        console.log(notiObj);
        const resp1 = await _sendPushNotification(notiObj);
        const resp = await _sendPushNotification(notiObj2);
        const resp3 = await _sendPushNotification(notiObj3);
      } else if (msg.message_type == "buy") {
        const added = await Content.update({
          _id: msg.content_id,
        }, { content_under_offer: false });
        const notiObj = {
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          // data.receiver_id,
          title: " content buy ",
          body: `content buy by mediahouse ${msg.sender_id}`,
        };
        console.log(notiObj);
        const resp = await _sendPushNotification(notiObj);
      } else {
        console.log("error")
      }
    }

    console.log("IN IFFFFFF", added);
    io.to(msg.room_id).emit("initialoffer", added);
    // } else {
    //   // group chat
    //   console.log("IN ELSSSSSS");
    //   const added = await Chat.create({
    //     room_id: msg.room_id,
    //     message: msg.message,
    //     sender_id: msg.sender_id,
    //     receiver_id: msg.receiver_id,
    //     primary_room_id: msg.primary_room_id,
    //     room_type: msg.room_type,
    //   });

    //   io.to(msg.room_id).emit("media message", added);
    // }

    // io.to(msg.room_id).emit('chat message', msg);
  })




  socket.on("updateOffer", async (msg) => {
    console.log(msg);

    // if (!msg.room_type) {
    //   msg.room_type = "individual";
    // }

    // const contentType = mime.lookup(msg.attachment_name);

    // const attachments = {
    //   name : msg.attachment_name,
    //   mime: msg.media_type,
    //   size: msg.attachment_size,
    //   url: msg.attachment
    // }

    const taskdetails = await Content.findOne({ _id: msg.content_id })
    console.log("taskdetails", taskdetails)

    // if (msg.room_type == "individual") {
    const added = await Chat.update({
      _id: msg.primary_id,
    }, { req });

    console.log("IN IFFFFFF", added);
    io.to(msg.room_id).emit("updateOffer", added);
    // } else {
    //   // group chat
    //   console.log("IN ELSSSSSS");
    //   const added = await Chat.create({
    //     room_id: msg.room_id,
    //     message: msg.message,
    //     sender_id: msg.sender_id,
    //     receiver_id: msg.receiver_id,
    //     primary_room_id: msg.primary_room_id,
    //     room_type: msg.room_type,
    //   });

    //   io.to(msg.room_id).emit("media message", added);
    // }

    // io.to(msg.room_id).emit('chat message', msg);
  })



  socket.on("total joinee", (msg) => {
    msg.total = io.sockets.adapter.rooms.get(msg.room_id).size;
    console.log("Total -> ", msg.total);
    io.to(msg.room_id).emit("total joinee", msg);
  });

  socket.on("typing", (msg) => {
    console.log(msg);
    io.to(msg.room_id).emit("typing", msg);
  });

  socket.on("type out", (msg) => {
    console.log(msg);
    io.to(msg.room_id).emit("type out", msg);
  });

  socket.on("end chat", (msg) => {
    io.to(msg.room_id).emit("end chat", msg);
  });

  socket.on("check status", async (msg) => {
    const status = await User.findById(msg.user_id, "is_online");
    msg.is_online = status.is_online;
    io.to(msg.room_id).emit("check status", msg);
  });


  socket.on("internal group chat", async msg => {
    console.log('<<<---msg--->>>', msg);
    const added = await Chat.create(msg);
    let messages = {
      mediahouse_id: msg.sender_id,
      room_id: msg.room_id,
      message: msg.message,
      type: msg.type,
    };

    let lastchats = await lastchat.create(messages);
    io.to(msg.room_id).emit("internal group chat", added);
  })

  socket.on("seen message", async (msg) => {
    console.log("seen message", msg);
    await Chat.updateOne(
      {
        _id: msg.msg_id,
      },
      {
        seen: true,
      }
    );

    io.to(msg.room_id).emit("seen message", msg);
  });
  socket.on("seen room all message", async (msg) => {
    console.log("seen room all message------->", msg);
    await Chat.updateMany(
      {
        room_id: msg.room_id,
        receiver_id: msg.receiver_id,
        seen: false,
      },
      {
        $set: {
          seen: true,
        }
      }
    );

    io.to(msg.room_id).emit("seen room all message", msg);
  });


  socket.on("disconnect", (reason) => {
    console.log("Disconnected..", reason);
  });
});

io.of("/").adapter.on("leave-room", (room) => {
  io.to(room).emit("leave joinee", room);
  console.log(`room ${room} was leaved`);
});

// app.listen(app.get('port'))
https.listen(port, () => {
  console.log(`Socket.IO server running at ${port}/`);
});

initMongo();
