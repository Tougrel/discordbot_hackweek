module.exports = {
    name        : "help",
    aliases     : ["commands"],
    guildOnly   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        let discord = require("discord.js"),
            config = require("../configs/config.json"),
            package = require("../package.json");

        let embed = new discord.RichEmbed()
        .setColor(config.color)
        .addField("Global Commands", "help, server, warns, user")
        .addField("Administrator Commands", "clear, ban, permissions, mute, kick, warn")
        .addField("Prefix", config.prefix)
        .setFooter(`Centaurus ${package.version}`);

        msg.channel.send(embed);

    }
}