module.exports = {
    name        : "user",
    aliases     : ["userinfo"],
    guildOnly   : true,
    blacklist   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        const discord = require("discord.js");
        const moment = require("moment");
        const ms = require("ms");
        
        const config = require("../configs/config.json");
        const permissions = require("../configs/permissions.json");

        let user = msg.mentions.users.first();
        if(!user){
            return msg.channel.send(`${msg.author}, you didn't specify an user!`);
        }

        let number = 0;
        let commandHistory = [];
        if(permissions.users[user.id].commandHistoryNumber <= 0) commandHistory = "*Nothing to see here.*";
        
        let command = args[1].toLowerCase();
        if(!command){
            for(let i in permissions.users[user.id].commandHistory){
                number += 1;
    
                let time = ms(i);
                if(number <= 5){
                    commandHistory += `»» ${moment(time).format("DD/MM/YYYY, h:mm:ss a")} » ${permissions.users[user.id].commandHistory[i]}\n`;
                }
            }

            if(!user.presence.game){
                let embed = new discord.RichEmbed()
                .setColor(config.color)
                .setAuthor(`Information for ${user.username}`, user.avatarURL)
                .setDescription(`User ID: ${user.id}`)
                .setThumbnail(user.avatarURL)
                .addField("Username", user.username, true)
                .addField("Discrim", user.discriminator, true)
                .addField("Bot", user.bot, true)
                .addField("Presence Status", user.presence.status, true)
                .addField("Presence Game", `*Nothing to see here*`, true)
                .addField("Tag", user.tag, true)
                .addField("Created At", moment.utc(user.createdAt).format("DD / MM / YYYY"), true)
                .addField("Joined At", moment.utc(user.joinedAt).format("DD / MM / YYYY"), true)
                .addField("Command History", commandHistory);
    
                msg.channel.send(embed);
            }
            else {
                let embed = new discord.RichEmbed()
                .setColor(config.color)
                .setAuthor(`Information for ${user.username}`, user.avatarURL)
                .setDescription(`User ID: ${user.id}`)
                .setThumbnail(user.avatarURL)
                .addField("Username", user.username, true)
                .addField("Discrim", user.discriminator, true)
                .addField("Bot", user.bot, true)
                .addField("Presence Status", user.presence.status, true)
                .addField("Presence Game", user.presence.game, true)
                .addField("Tag", user.tag, true)
                .addField("Created At", moment.utc(user.createdAt).format("DD / MM / YYYY"), true)
                .addField("Joined At", moment.utc(user.joinedAt).format("DD / MM / YYYY"), true)
                .addField("Command History", commandHistory);
    
                msg.channel.send(embed);
            }
        }
        else if(command === "commands" || command === "commandhistory" || "commandshistory"){
            for(let i in permissions.users[user.id].commandHistory){
                number += 1;
    
                let time = ms(i);
                if(number <= 10){
                    commandHistory += `»» ${moment(time).format("DD/MM/YYYY, h:mm:ss a")} » ${permissions.users[user.id].commandHistory[i]}\n`;
                }
            }

            let embed = new discord.RichEmbed()
            .setColor(config.color)
            .setAuthor(`Command History for ${user.username}`, user.avatarURL)
            .setDescription(commandHistory)
            .setThumbnail(user.avatarURL);

            msg.channel.send(embed);
        }

    }
}