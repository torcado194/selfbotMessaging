const Discord = require('discord.js');

const bot = new Discord.Client();

const token = require('./token.json').token;

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.on("message", message => {
    if(message.author !== bot.user) return;

    var prefix = "!"; 
    if(!message.content.startsWith(prefix)) return; 

    const params = message.content.split("|").slice(1);
    
    if(message.content.startsWith(prefix+"h")) {
        var color = "EEEB22";
        var image = false;
        var link = "https://github.com/torcado194/selfbotMessaging";
        var title = "selfbot formatted messaging";
        var author = false;
        var content;
        var fields = [
            {
                name: "Syntax:",
                value: "```css\n\
!f |color^FF0000|message^Message Body^|\n\
    ^tag  ^value        ^data separator\n\
                ^tag separator               \n\
```"
            },
            {
            name: "Tags:",
            value: "```css\n\
|color^FF0000|\n|c^FF0000|\n\
```\n\
Sets color of left border. If no color is specified, uses the user's role color\n\
\n\
```css\n\
|title^Hello|\n|t^Hello|\n\
```\n\
Main message title.\n\
\n\
```css\n\
|link^http://google.com|\n|l^http://google.com|\n\
```\n\
Link for title and author name.\n\
\n\
```css\n\
|message^Message body.|\n|m^Message Body.|\n\
```\n\
Main message content.\n\
\n\
```css\n\
|field^Field Title^Field content.^inline|\n|f^Field Title^Field content.^i|\n\
```\n\
A field block. 'inline' is optional, defaults to **false**.\n\
\n\
```css\n\
|image^http://i.imgur.com/Z0uH4jE.jpg|\n|i^http://i.imgur.com/Z0uH4jE.jpg|\n\
```\n\
Main image for message. Inline images can be added using Markdown.\n\
\n\
```css\n\
|padding|\n|p|\n\
```\n\
Add spacing between message and footer. Defaults to **false**.\n\
\n\
```css\n\
|footer^Footer message.^icon.png|\n|o^Footer message.|\n\
```\n\
The footer icon and message. Defaults to **[user avatar ©username]**.\nIcon tag is optional, defaults to **user avatar**.\n\
\n\
```css\n\
|time^false|\n|date^false|\n|d^false|\n\
```\n\
Timestamp of the message. Defaults to **true**."
            }
        ];
        embedMessage(bot, message, {author: author, title: title, link: link, color: color, content: content, fields: fields, image: image});
    }
    
    if(message.content.startsWith(prefix+"f") || message.content.startsWith(prefix+"m") || message.content.startsWith(prefix+"k")) {
        let messagecount = 0;
        if(!message.content.startsWith(prefix+"k")){
            message.channel.fetchMessages({limit: 100})
                .then(messages => {
                let msg_array = messages.array();
                msg_array = msg_array.filter(m => m.author.id === bot.user.id);
                msg_array.length = messagecount + 1;
                msg_array.map(m => m.delete().catch(console.error));
            });
        }
        if(params[0] != null){
            var color;
            if(message.guild != null){
                color = message.guild.members.filter(m => m.user.username === message.author.username).array()[0].highestRole.hexColor.replace("#","");
            }
            var image = false;
            var link = false;
            var content, title, p, c;
            var author = true;
            var timestamp = true;
            var footer = true;
            var fields = [];
            for(var i = 0; i < params.length; i++){
                p = params[i];
                c = p.split("^");
                if(params[i].startsWith("t") || params[i].startsWith("title")){
                    title = c[1];
                }
                if(params[i].startsWith("l") || params[i].startsWith("link")){
                    link = c[1];
                }
                if(params[i].startsWith("c") || params[i].startsWith("color")){
                    color = c[1];
                }
                if(params[i].startsWith("m") || params[i].startsWith("message")){
                    content = c[1];
                }
                if(params[i].startsWith("f") || params[i].startsWith("field")){
                    fields.push({name: c[1], value: c[2], inline: c[3] == null ? false : (c[3].indexOf("i") != -1 || c[3].indexOf("inline") != -1)});
                }
                if(params[i] == "p" || params[i] == "padding"){
                    fields.push({name: "**͘ **", value: "[](http://i.imgur.com/thIoLvC.png)"})
                }
                if(params[i].startsWith("i") || params[i].startsWith("image")){
                    image = c[1];
                }
                if(params[i].startsWith("d") || params[i].startsWith("date") || params[i].startsWith("time")){
                    timestamp = c[1] == "false" ? false : true;
                }
                if(params[i].startsWith("o") || params[i].startsWith("footer")){
                    footer = c[1] == null ? false : {text: c[1], icon_url: (c[2] == null ? false : c[2])};
                }
            }
            console.log(color + "|" + content + "|" + footer.icon_url);
            embedMessage(bot, message, {author: author, title: title, link: link, color: color, content: content, fields: fields, image: image, timestamp: timestamp, footer: footer});
        }
        
    }
});

bot.login(token);



function embedMessage(client, msg, params){
    //var fields = [];    
    var user = params.user == null ? msg.author : params.user;
    if(params.user == null || params.user == undefined){
        var author = {
            name: msg.author.username,
            icon_url: msg.author.avatarURL
        }
    } else {
        var author = {
            name: params.user.username,
            icon_url: params.user.avatarURL
        }
    }
    
    embed = {
        color: parseInt("0x" + params.color),
        author: params.author ? {
            name: user.username,
            icon_url: user.avatarURL
        } : {},
        title: params.title,
        url: params.link ? params.link : "", 
        description: params.content,
        fields: params.fields,
        image: params.image ? {
            url: params.image
        } : {},
        timestamp: params.timestamp ? new Date() : "",
        footer: params.footer ? {
            icon_url: (params.footer.icon_url ? (params.footer.icon_url == "false" ? "" : params.footer.icon_url) : user.avatarURL), 
            text: (params.footer.text ? params.footer.text : ('©' + user.username))
        } : {}
    };

    msg.channel.sendMessage('', { embed });
}