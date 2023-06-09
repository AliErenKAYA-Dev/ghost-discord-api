# Ghost CMS Discord Webhook v2

##### 0- Demo message:

![ghost-discord-api](/ghost-discord-api.png "ghost-discord-api")

##### 1- First, install dependencies for node app:

<pre>
npm i
</pre>

##### 2- After opening the index.js file, you need to enter the webhook URL you created on Discord in the section below:

<pre>
const Hook = new webhook.Webhook("YOUR WEBHOOK URL") // Example: https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN
</pre>

##### 3- You should add the RSS feed URL of your site:

<pre>
const rssUrl = "https://www.siteurl.com/rss"; // Example: https://www.ise.town/rss
</pre>

##### 4- If the written article does not contain an image, add the default image to be displayed:

<pre>
const defaultImg = 'default img url'; // Example: https://www.ise.town/content/images/2023/04/town.png
</pre>

##### 5- You must specify in milliseconds how long after the sharing takes place, control will be provided:

<pre>
const timeOut = 20000;
</pre>

##### 6- We determine how your webhook will appear when sending a message:
<pre>
  const msg = new webhook.MessageBuilder()
    .setName('Webhook Name') // Your webhook name
    .setColor('#f1e05a') // Message color
    .setTitle(newEntries[0].title) // Message Title
    .addField('', newEntries[0].contentSnippet.substring(0, 120) + "...") // We adding new field for short content
    .setFooter("Author: " + newEntries[0].creator + " - Release Time: " + formattedDate + " " + formattedTime) // Setting footer
    .setImage(imgSrc) // Image url
    .setURL(newEntries[0].link); // Post url
  Hook.send(msg); // We sending a message
</pre>

##### 7- We can start node app:

<pre>
node index.js
</pre>

##### 8- Access your Ghost CMS Admin Panel and add integration:

![ghost-integrations](/ghost-integrations.png "ghost-integrations")
