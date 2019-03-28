const Discord = require('discord.js');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const { app, BrowserWindow } = require('electron');

var win = null;

function createWindow() {
    win = new BrowserWindow({ width: 600, height: 900 });
    win.loadFile('index.html');
}

app.on('ready', createWindow);

const client = new Discord.Client();
const permissions = '68608';
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
        win.reload();
    });
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const clientInviteUrl = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=${permissions}`;
    console.log(`Invite link: ${clientInviteUrl}`);
});

client.on('message', msg => {
    if (msg.member &&
        msg.member.id == '365975655608745985') {
        if (msg.embeds) {
            msg.embeds.forEach(e => {
                if (e.image) {
                    if (e.title.includes('wild')) {
                        console.log(`Looking up ${e.image.url}..`);
                        fs.writeFileSync('index.html', `<p>Loading ${e.image.url}..</p>`);
                        win.reload();
                        lookup(e.image.url);
                    }
                }
            });
        }
    }
});

client.login(token);
