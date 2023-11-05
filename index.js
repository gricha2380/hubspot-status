const util = require("util.js");

exports.handler = (event, context, callback) => {  
  const url = process.env.Url; // "https://status.hubspot.com/api/v2/status.json";
  util.fetch( url, callback);
};