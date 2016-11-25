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

    if(message.content.startsWith(prefix+"a")) {
        let messagecount = 0;
        message.channel.fetchMessages({limit: 100})
            .then(messages => {
            let msg_array = messages.array();
            msg_array = msg_array.filter(m => m.author.id === bot.user.id);
            msg_array.length = messagecount + 1;
            msg_array.map(m => m.delete().catch(console.error));
        });
        if(params[0] != null){
            var color;
            if(message.guild != null){
                color = message.guild.members.filter(m => m.user.username === message.author.username).array()[0].highestRole.hexColor.replace("#","");
            }
            var image = false;
            var link = false;
            var content, title, p, c;
            var fields = [];
            for(var i = 0; i < params.length; i++){
                p = params[i];
                c = p.split("^");
                if(params[i].startsWith("t") || params[i].startsWith("title")){
                    title = p.split(" ")[1];
                }
                if(params[i].startsWith("t") || params[i].startsWith("link")){
                    link = p.split(" ")[1];
                }
                if(params[i].startsWith("c") || params[i].startsWith("color")){
                    color = p.split(" ")[1];
                }
                if(params[i].startsWith("m") || params[i].startsWith("message")){
                    content = c[1];
                }
                if(params[i].startsWith("f") || params[i].startsWith("field")){
                    fields.push({name: c[1], value: c[2], inline: c[3] == null ? false : c[3].indexOf("i") != -1});
                }
                if(params[i] == "p" || params[i] == "padding"){
                    fields.push({name: "**͘ **", value: "[](http://i.imgur.com/thIoLvC.png)"})
                }
                if(params[i].startsWith("i") || params[i].startsWith("image")){
                    image = p.split(" ")[1];
                }
            }
            console.log(color + "|" + content);
            embedMessage(bot, message, {title: title, link: link, color: color, content: content, fields: fields, image: image});
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
        author: {
            name: user.username,
            icon_url: user.avatarURL
        },
        title: params.title,
        url: params.link ? params.link : "", // The url for the title.
        description: params.content,
        fields: params.fields,
        image: params.image ? {
            url: params.image
        } : {},
        timestamp: new Date(),
        footer: {
            icon_url: user.avatarURL, // eslint-disable-line camelcase
            text: '©' + user.username
        }
    };

    msg.channel.sendMessage('', { embed });
}