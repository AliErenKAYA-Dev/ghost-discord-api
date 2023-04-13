const Parser = require('rss-parser');
const parser = new Parser();
const webhook = require("webhook-discord");
const express = require('express');
const slowDown = require("express-slow-down");
const app = express();

let firstSavedFeed = {};
let lastSavedFeed = {};

const Hook = new webhook.Webhook("YOUR WEBHOOK URL") // Example: https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN
const rssUrl = "https://www.siteurl.com/rss"; // Example: https://www.ise.town/rss
const defaultImg = 'default img url'; // Example: https://www.ise.town/content/images/2023/04/town.png
const timeOut = 2000;
const port = 1111;

const limiter = slowDown({
  windowMs: 60 * 1000, // 1 min
  delayAfter: 10, // Start delay after 10 requests
  delayMs: 1000, // 1 second delay per request
});

app.use(limiter);

app.get('/', (req, res) => {
  res.send('Success!')
  setTimeout(getFeed, timeOut);
})

app.post('/', (req, res) => {
  res.send('Success!')
  setTimeout(getFeed, timeOut);
})

app.put('/', (req, res) => {
  res.send('Success!')
  setTimeout(getFeed, timeOut);
})

function getFeed() {
  try {
    if (Object.keys(firstSavedFeed).length === 0) {
      parser.parseURL(rssUrl, async function (err, feed) {
        if (err) return console.log(err);
        console.log('First RSS Request:', feed.title);
        firstSavedFeed = feed;
        lastSavedFeed = feed;
        setTimeout(getFeed, timeOut);
      });
    } else {
      parser.parseURL(rssUrl, async function (err, feed) {
        if (err) return console.log(err);
        console.log('Last RSS Request:', feed.title);
        if (JSON.stringify(feed) !== JSON.stringify(lastSavedFeed)) {
          const newEntries = feed.items.filter(item => {
            return !lastSavedFeed.items || !lastSavedFeed.items.find(savedItem => savedItem.guid === item.guid);
          });
          if (newEntries.length > 0) {
            console.log('New record:', newEntries);

            const date = new Date(newEntries[0].isoDate);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString();

            const imgSrcRegex = /<img[^>]+src="([^">]+)"/i;

            const imgMatch = newEntries[0]['content:encoded'].match(imgSrcRegex);
            const imgSrc = imgMatch ? imgMatch[1] : defaultImg;


            const msg = new webhook.MessageBuilder()
              .setName('Webhook Name') // Your webhook name
              .setColor('#f1e05a') // Message color
              .setTitle(newEntries[0].title) // Message Title
              .addField('', newEntries[0].contentSnippet.substring(0, 120) + "...") // We adding new field for short content
              .setFooter("Author: " + newEntries[0].creator + " - Release Time: " + formattedDate + " " + formattedTime) // Setting footer
              .setImage(imgSrc) // Image url
              .setURL(newEntries[0].link); // Post url
            Hook.send(msg); // We sending a message
          }
          lastSavedFeed = feed;
        }
      });
    }
  } catch (error) {
    return console.error(error);
  }
}

getFeed();

app.listen(port, () => {
  console.log(`Server started on port ${port}.`)
})