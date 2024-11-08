// const options = {
//     autoQuery: true,
//     autoBody: true,
//     writeOutputFile: true
//   }
  
//   const swaggerAutoed = require('swagger-autogen')(options)
  
//   const doc = {
//     info: {
//       title: 'My API',
//       description: 'Description'
//     },
//     host: 'uat.presshop.live:5019',
//     basePath: '/',
//     schemes: ['https']
//     //   components: {
//     //     securitySchemes:{
//     //         bearerAuth: {
//     //             type: 'https',
//     //             scheme: 'bearer'
//     //         }
//     //     }
//     // }
//   }
  
//   // const routesall = require("./app/routes")
//   const outputFile = './swaggerjson.json'
//   const routes = ['./app/routes/auth.js', './app/routes/hopper.js' ,'./app/routes/mediaHouse.js']
  
//   swaggerAutoed(outputFile, routes, doc).then(() => {
//     require('./server.js') // Your project's root file
//   })
  

const options = {
    autoQuery: true,
    autoBody: true,
    writeOutputFile: true
  }
  
  const swaggerAutoed = require('swagger-autogen')(options)
  
  const doc = {
    info: {
      title: 'My API',
      description: 'Description'
    },
    host: 'uat.presshop.live:5019',
    basePath: '/auth/',
    schemes: ['https']
    //   components: {
    //     securitySchemes:{
    //         bearerAuth: {
    //             type: 'https',
    //             scheme: 'bearer'
    //         }
    //     }
    // }
  }
  
  // const routesall = require("./app/routes")
  const outputFile = './swaggerjson.json'
  const routes = ['./app/routes/auth.js', './app/routes/users.js']
  
  swaggerAutoed(outputFile, routes, doc).then(() => {
    require('./server.js') // Your project's root file
  })
  