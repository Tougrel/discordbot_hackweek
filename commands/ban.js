module.exports = {
    name        : "ban",
    aliases     : ["cban"],
    guildOnly   : true,
    blacklist   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        const discord = require("discord.js");
        const moment = require("moment");
        const ms = require("ms");
        const fs = require("fs");
        
        const config = require("../configs/config.json");
        const times = require("../configs/times.json");

        let text = args.join(" ").split(" ");
        if(!text[0]){
            return msg.channel.send(`You didn't specify enough arguments! If you believe this is an error, contact a system administrator.\nCommand Usage » ${config.prefix}ban (user) (time) (reason)`);
        }

        let user = msg.mentions.users.first();
        if(!user){
            return msg.channel.send(`${msg.author}, you didn't specify an user!`);
        }

        text.shift();
        let time = text.join(" ");
        if(!time){
            return msg.channel.send(`${msg.author}, enter a valid time to mute ${user.username}! Example \`10s, 10m, 10d\``);
        }

        let mutetime = ms(text[0]);

        text.shift();
        let reason = text.join(" ");
        if(!reason){
            return msg.channel.send(`${msg.author}, please specify the reason to ban ${user.username}!`);
        }

        let logs = msg.guild.channels.find(c => c.name === config.logs);
        if(logs){
            let embed = new discord.RichEmbed()
            .setColor(config.color)
            .setAuthor(user.username, user.avatarURL)
            .setDescription(`User ${user.username} has been banned by ${msg.author}!`)
            .addField("Reason", reason)
            .addField("Time", moment.utc(mutetime).format("HH:mm:ss"));

            msg.channel.send(embed);
        } else {
            msg.channel.send(`${msg.author}, couldn't find logs channels.`);
        }

        times[msg.guild.id].bans = {
            [user.id]: {
                time: mutetime
            }
        };

        let member = msg.guild.members.get(user.id);

        member.ban({ reason: reason });
        setInterval(function(){
            if(times[msg.guild.id].bans[user.id] && times[msg.guild.id].bans[user.id].time > 0){
                times[msg.guild.id].bans[user.id].time -= 1000;
            }
            fs.writeFile("./configs/times.json", JSON.stringify(times, null, 4), (err) => { if(err) console.log(err) });
        }, ms("1s"));
        setTimeout(function(){
            msg.guild.unban(user.id);
            delete times[msg.guild.id].bans[user.id];
        }, mutetime);

        fs.writeFile("./configs/times.json", JSON.stringify(times, null, 4), (err) => { if(err) console.log(err) });

    }
}