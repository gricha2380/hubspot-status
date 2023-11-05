## Overview
Email alerts for Hubspot outages. Powered by AWS.

## Why is this necessary?
This script is useful for anyone who relies on Hubspot for site hosting and wishes to know when there's an ongoing issue.


The need for this project came about after a [Cloudflare](https://blog.cloudflare.com/cloudflare-incident-on-october-30-2023/) outage led to a Hubspot outage. That's when I discovered that Hubspot does not offer a subscription to their status page.

## Cloud components
* Lambda - Compute
* EventBridge - Scheduling
* SES - Email delivery

EventBridge is set to invoke the Lambda function every 15 minutes. The function fetches the live status from Hubspot's status page and delivers an email to the specified recipients.


## Hubspot status response

Documentation: https://status.hubspot.com/api

Example response
```
{
    "page": {
        "id": "8b9w1wwq3g7d",
        "name": "HubSpot",
        "url": "https://status.hubspot.com",
        "time_zone": "America/New_York",
        "updated_at": "2023-11-02T12:16:47.862-04:00"
    },
    "status": {
        "indicator": "none",
        "description": "All Systems Operational"
    }
}
```

## Common Actions
* Deploy changes: `npm run deploy`
* Manually trigger status check: `npm run checknow`