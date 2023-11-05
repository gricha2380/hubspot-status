const AWS = require("aws-sdk");
const https = require("https");
const ses = new AWS.SES();
// const dynamodb = new AWS.DynamoDB();

module.exports = {
  sendResponse: (statusCode, message) => {
    const response = {
      headers: {
        // "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json"
      },
      statusCode: statusCode,
      body: JSON.stringify(message),
    };
    return response;
  },
  parseEmails: function (list) { return list.split(",") },
  fetch: async function (url, callback) {
    console.log("Inside fetch...", url);
    
    https.get(url, (resp)=>{
      let data = "";
      
      // A chunk of data has been received.
      resp.on("data", (chunk) => {
        data += chunk;
      });
      
      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        console.log("data result",data);
        let json = JSON.parse(data);
        console.log("data parsed. Status indicator value:", json.status.indicator);

        // Look for response status
        if (json.status.indicator == "none") {
          console.log("status is normal. No further action.")
        } else {
          // send email
          console.log("status is not normal. Sending email." );
          this.sendEmail(json, callback);
        }
      });
      
    }).on("error", (err) => {
      console.error("Error: ", err);
    });
  },
  sendEmail: async function (json, callback) {
    const From = process.env.From; // Must belong to a verified SES account
    const RecipientEmailAddress = this.parseEmails(process.env.RecipientEmailAddress) // ["me@gmail.com"];
    console.log("inside email", From, RecipientEmailAddress);
    let d = new Date();
    let date = "" + d.getFullYear() + d.getMonth() + d.getDay() + d.getHours() + d.getMinutes() + d.getMilliseconds();
    
    var params = {
      Source: From,
      Destination: { ToAddresses: RecipientEmailAddress },
      Message: {
        Subject: {
          Data: `Hubspot status alert - ${date}`
        },
        Body: {
          Text: {
            Data: `
            There has been a change in Hubspot status. This is what their API reported:
            Status: ${json.status.indicator}
            Description: ${json.status.description}
            `
          }
        }
      }
    };
    
    return ses.sendEmail(
      params,
      (err, data) => {
        if (err) {
          return this.sendResponse(401, {err:`Item not found`});
        } else {
          return this.sendResponse(200, "Email sent.");
        }
      }
      ).promise()
      
    }
  };