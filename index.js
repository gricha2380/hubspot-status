const util = require("util.js");
const mode = process.env.mode; // SUMMARY || STATUS
let url;

exports.handler = (event, context, callback) => {
  if (mode == "SUMMARY") {
    url = process.env.summaryUrl;
    util.fetchSummary( url, mode);
  }
  else if (mode == "STATUS") {
    url = process.env.statusUrl;
    url = "https://status.hubspot.com/api/v2/status.json";
    util.fetchStatus( url, mode);
  }
  
};