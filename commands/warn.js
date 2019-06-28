module.exports = {
    name        : "warn",
    aliases     : ["cwarn"],
    guildOnly   : true,
    blacklist   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        const discord = require("discord.js");
        const fs = require("fs");
        
        const config = require("../configs/config.json");
        const times = require("../configs/times.json");

        let text = args.join(" ").split(" ");
        if(!text[0]){
            return msg.channel.send(`You didn't specify enough arguments! If you believe this is an error, contact a system administrator.\nCommand Usage » *${config.prefix}warn (user) (reason)*`);
        }

        let user = msg.mentions.users.first();
        if(!user){
            return msg.channel.send(`${msg.author}, you didn't specify an user!`);
        }

        text.shift();
        let reason = text.join(" ");
        if(!reason){
            return msg.channel.send(`${msg.author}, please specify the reason to warn ${user.username}!`);
        }

        let logs = msg.guild.channels.find(c => c.name === config.logs);
        if(logs){
            let embed = new discord.RichEmbed()
            .setColor(config.color)
            .setAuthor(user.username, user.avatarURL)
            .setDescription(`User ${user.username} has been warned by ${msg.author}!`)
            .addField("Reason", reason)
            .setTimestamp();

            msg.channel.send(embed);
        } else {
            msg.channel.send(`${msg.author}, couldn't find logs channels.`);
        }

        if(!times[msg.guild.id].warns[user.id]){
            times[msg.guild.id].warns = {
                [user.id]: {
                    number: 1,
                    list: {}
                }
            };
        }

        let time = msg.createdTimestamp;
        let number = times[msg.guild.id].warns[user.id].number;
        times[msg.guild.id].warns[user.id].list[number] = {
                time: parseInt(time),
                reason: reason
        }

        times[msg.guild.id].warns[user.id].number += 1;
        fs.writeFile("./configs/times.json", JSON.stringify(times, null, 4), (err) => { if(err) console.log(err) });

    }
}