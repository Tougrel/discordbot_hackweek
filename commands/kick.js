module.exports = {
    name        : "kick",
    aliases     : ["ckick"],
    guildOnly   : true,
    blacklist   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        const discord = require("discord.js");
        const config = require("../configs/config.json");

        let text = args.join(" ").split(" ");
        if(!text[0]){
            return msg.channel.send(`You didn't specify enough arguments! If you believe this is an error, contact a system administrator.\nCommand Usage » ${config.prefix}kick (user)`);
        }

        let user = msg.mentions.users.first();
        if(!user){
            return msg.channel.send(`${msg.author}, you didn't specify an user!`);
        }

        let logs = msg.guild.channels.find(c => c.name === config.logs);
        if(logs){
            let embed = new discord.RichEmbed()
            .setColor(config.color)
            .setAuthor(user.username, user.avatarURL)
            .setDescription(`User ${user.username} has been kicked by ${msg.author}!`)
            .setTimestamp();

            msg.channel.send(embed);
        } else {
            msg.channel.send(`${msg.author}, couldn't find logs channels.`);
        }

        let member = msg.guild.members.get(user.id);
        member.kick();

    }
}