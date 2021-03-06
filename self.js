const Discord = require('discord.js');

const bot = new Discord.Client();

const token = require('./token.json').token;

const store = require('data-store')('data', {cwd: 'data'});

console.log(store.get('t'));

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.on("message", message => {
    if(message.author !== bot.user) return;
    
    var prefix = "!"; 
    if(!message.content.startsWith(prefix)) return; 

    var command = message.content.split(" ")[0].replace(prefix,"")

    var params = message.content.split("|").slice(1);
    var blocks = message.content.split(" ").slice(1);
    
    
    if(command == "h") {
        var helps = {
            syntax: false,
            tags: false,
            examples: false,
            commands: false,
            saving: false
        }
        
        var color = "EEEB22";
        var image = false;
        var link = "https://github.com/torcado194/selfbotMessaging";
        var title = "selfbot formatted messaging";
        var author = false;
        var content;
        if(blocks[0] == null){
            content = "```css\n\
!h syntax\n\
!h tags\n\
!h examples\n\
!h commands\n\
!h all\n\
```";
        } else {
            console.log(blocks[0])
            console.log(helps)
            console.log(helps.hasOwnProperty(blocks[0]))
            if(blocks[0] == "all"){
                helps.syntax = true;
                helps.tags = true;
                helps.examples = true;
                helps.commands = true;
                helps.saving = true;
            } else if(helps.hasOwnProperty(blocks[0])){
                helps[blocks[0]] = true;
            }
            var fields = [
                helps.syntax ? {
                    name: "Syntax:",
                    value: "```css\n\
!f |color^FF0000|message^Message Body^|\n\
    ^tag  ^value        ^data separator\n\
                ^tag separator\n\
```"
                } : {},
                helps.tags ? {
                    name: "Tags:",
                    value: "```css\n\
|color^FF0000|\n|c^FF0000|\n\
```\n\
Sets color of left border. Defaults user's **role color**\n\
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
|author|\n|a|\n\
```\n\
Author avatar and name. Defaults to *user avatar* and *username*.\nUsing `|a|` removes author.\n\
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
Main image for message. Inline images can be added using Markdown."
                } : {},
                helps.tags ? {
                    name: "**͘ **",
                    value: "\
```css\n\
|padding|\n|p|\n\
```\n\
Add spacing between message and footer. Defaults to **false**.\n\
\n\
```css\n\
|signature^Footer message.^icon.png|\n|s^Footer message.|\n\
```\n\
The footer icon and message. Defaults to **[user avatar ©username]**.\nIcon tag is optional, defaults to **user avatar**.\nUsing `|s|` removes signature.\n\
\n\
```css\n\
|date|\n|d|\n\
```\n\
Timestamp of the message. Defaults to **true**.\nUsing `|d|` removes timestamp."
                } : {},
                helps.examples ? {
                    name: "Examples",
                    value: "\
```css\n\
!f |c^0000DD|m^Hello!!|i^http://i.imgur.com/o8xQlCM.jpg|s|d\n\
```\n\
```css\n\
!m torcado |c^EE1288|m^Wow looks at me|s^a super dork|p\n\
```\n\
```css\n\
!k |c^EE1288|f^Cool things^part 1^i|f^Cool things^part 2^i|a|s|d\n\
```"
                } : {},
                helps.commands ? {
                    name: "Commands:",
                    value: "\
```css\n\
!f torcado |m^My message looks so pretty|\n\
```\n\
**f**ormatted message sent in place of the original code.\n\
```css\n\
!m torcado |m^Hey look at me|\n\
```\n\
**m**imics another user by using their role color, username, and avatar in the author and signature.\n\
```css\n\
!k |m^Secrets revealed|d|p\n\
```\n\
**k**eeps the original message, if you want to show someone the message code.\n\
```css\n\
!s name !f |t^My title is: $|m^My message is: %|\n\
```\n\
**s**ave a template for a formatted message.\n\
```css\n\
!t name |$^Custom title|%^Custom message|\n\
```\n\
Use a saved **t**emplate for message, add custom tags for replacing characters."
                } : {},
                helps.saving ? {
                    name: "Saving templates:",
                    value: "\
You can save template formats with custom fields for easy use later. For example:\n\
```css\n\
!s bee !f |c^FFFF00|m^According to all known laws of aviation...|i^https://i.ytimg.com/vi/uzcGZ3ZsENE/hqdefault.jpg|s|a|d\n\
!t bee\n\
```\n\
The `!s` command saves a template formatted message, and the `!t` command uses that template in a much more simple command.\n\
\n\
A feature of saved templates is custom placeholder tags. For example:\n\
```css\n\
!s notice !f |c^FFFF00|t^**IMPORTANT MESSAGE:**|m^%|s|a|d\n\
!t notice |%^i am really cool\n\
```\n\
In this example, a `%` is used as a placeholder tag in the save command. In the template command, a block is used which replaces all instances of a `%` with the text after the separator.\n\
Any character or string of characters can be used for placeholders.\
"
                } : {}
            ];
        }
        fields = fields.filter(value => Object.keys(value).length !== 0);
        embedMessage(bot, message, {author: author, title: title, link: link, color: color, content: content, fields: fields, image: image});
    }
    if(command == "s"){
        store.set(blocks[0], message.content.split(' ').slice(2).join(' '));
    }
    if(command == "t"){
        if(blocks[0] == "?"){
            if(blocks[1] == null){
                message.channel.sendMessage("```JSON\n" + JSON.stringify(store.data) + "\n```");
            } else {
                message.channel.sendMessage("`" + store.get(message.content.split(' ').slice(2).join(' ')) + "`");
            }
            return;
        }
    }
    if(command == "d"){
        let messagecount = Number(blocks[0]);
        console.log(messagecount)
        message.channel.fetchMessages({limit: 8})
            .then(messages => {
            let msg_array = messages.array();
            msg_array = msg_array.filter(m => m.author.id === bot.user.id);
            msg_array.length = messagecount + 1;
            msg_array.map(m => m.delete().catch(console.error));
        });
    }
    if(command == "f" || command == "m" || command == "t" || command == "k") {
        let messagecount = 0;
        if(command != "k"){
            message.channel.fetchMessages({limit: 100})
                .then(messages => {
                let msg_array = messages.array();
                msg_array = msg_array.filter(m => m.author.id === bot.user.id);
                msg_array.length = messagecount + 1;
                msg_array.map(m => m.delete().catch(console.error));
            });
        }
        
        var baseContent = "";
        var p, c;
        if(command == "t"){
            baseContent = store.get(blocks[0]);
            if(baseContent == null){
                console.log("NO STORAGE");
                return;
            }
            for(var i = 0; i < params.length; i++){
                p = params[i];
                c = p.split("^");
                if(p == '') continue;
                baseContent = baseContent.replaceAll(c[0],c[1])
            }
            baseContent = baseContent.trim();
            params = baseContent.split("|").slice(1);
            blocks = baseContent.split(" ").slice(1);
            command = baseContent.split(" ")[0].replace(prefix,"");
        } else {
            baseContent = message.content;
        }
        if(params[0] != null){
            var m = (command == "m");
            var color;
            var user = false;
            if(message.guild != null){
                if(m){
                    console.log("----mimic----")
                    user = message.guild.members.filter(m => m.user.username === blocks[0]);
                } else {
                    user = message.guild.members.filter(m => m.user.username === message.author.username);
                }
                if(user.array()[0] == null){
                    user = message.guild.members.filter(m => m.user.username === message.author.username)
                }
                color = user.array()[0].highestRole.hexColor.replace("#","");
            }
            var image = false;
            var link = false;
            var content, title;
            var author = true;
            var timestamp = true;
            var footer = true;
            var fields = [];
            for(var i = 0; i < params.length; i++){
                p = params[i];
                c = p.split("^");
                if(params[i].startsWith("a") || params[i].startsWith("author")){
                    author = false;
                }
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
                if(params[i].startsWith("d") || params[i].startsWith("date")){
                    timestamp = c[1] == null ? false : true;
                }
                if(params[i].startsWith("s") || params[i].startsWith("signature")){
                    footer = c[1] == null ? false : {text: c[1], icon_url: (c[2] == null ? false : c[2])};
                }
            }
            user = user.array()[0].user;
            embedMessage(bot, message, {user: user, author: author, title: title, link: link, color: color, content: content, fields: fields, image: image, timestamp: timestamp, footer: footer});
        }
        
    }
});

bot.login(token);



function embedMessage(client, msg, params){
    //var fields = [];    
    var user = params.user == null ? msg.author : params.user;
    if(params.user == null || params.user == false){
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


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};