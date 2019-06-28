module.exports = {
    name        : "administrator",
    aliases     : ["adminperms"],
    guildOnly   : true,
    blacklist   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        const fs = require("fs");
        const permissions = require("../configs/permissions.json");

        if(!msg.guild.owner){
            return msg.channel.send(`🚨 I'm sorry, ${msg.author}, only the guild owner can execute this command.`);
        }

        permissions.users[msg.author.id] = {
            blacklist: "disabled",
            commands: {
                permissions: "enabled",
                shutdown: "enabled",
                settings: "enabled",
                restart: "enabled",
                server: "enabled",
                clear: "enabled",
                warns: "enabled",
                role: "enabled",
                user: "enabled",
                help: "enabled",
                kick: "enabled",
                mute: "enabled",
                warn: "enabled",
                ban: "enabled"
            },
            commandHistoryNumber: 0,
            commandHistory: {},
            warnsNumber: 0,
            warns: {}
        }

        msg.channel.send(`I have successfully granted administrator permission to the guild owner, ${msg.author}`);

        fs.writeFile("./configs/permissions.json", JSON.stringify(permissions, null, 4), (err) => { if(err) console.log(err) });

    }
}