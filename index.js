const Discord = require('discord.js');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const client = new Discord.Client();
const permissions = '68608';
const clientId = '560361265139286017';
const clientInviteUrl = `https://discordapp.com/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=${permissions}`;
const token = fs.readFileSync('token.txt', 'utf8').trim();


function lookup(url) {
    var google = 'https://www.google.com/searchbyimage';
    var options = {
        url: google,
        qs: { image_url: url },
        headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11' }
    };

    request(options, function (err, res, body) {
        var $ = cheerio.load(body);
        fs.writeFileSync("./index.html", $.html());
    });
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Invite link: ${clientInviteUrl}`);
});

client.on('message', msg => {
    if (msg.member.id == '365975655608745985') {
        msg.embeds.forEach(e => {
            if (e.image) {
                console.log(`Looking up ${e.image.url}..`);

                lookup(e.image.url);
                // google.searchByImageURL({
                //     imageURL: e.image.url
                // }).then(result => {
                //     console.log(result);
                // }).catch(err => {
                //     console.error(err);
                // });
            }
        });
    }
});

client.login(token);
