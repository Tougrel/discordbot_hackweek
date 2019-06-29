module.exports = {
    name        : "help",
    aliases     : ["commands"],
    guildOnly   : true,
    blacklist   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        const discord = require("discord.js");
        const config = require("../configs/config.json");
        const package = require("../package.json");

        let embed = new discord.RichEmbed()
        .setColor(config.color)
        .addField("Global Commands", "help, server, warns, user")
        .addField("Administrator Commands", "clear, ban, permissions, mute, kick, warn, role, blacklist, advperm")
        .addField("Prefix", config.prefix)
        .setFooter(`Centaurus ${package.version}`);

        msg.channel.send(embed);

    }
}