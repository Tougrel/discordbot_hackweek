module.exports = {
    name        : "advperm",
    aliases     : ["advertise"],
    guildOnly   : true,
    blacklist   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        const fs = require("fs");
        const config = require("../configs/config.json");
        const permissions = require("../configs/permissions.json");

        let text = args.join(" ").split(" ");
        if(!text[0]){
            return msg.channel.send(`You didn't specify enough arguments! If you believe this is an error, contact a system administrator.\nCommand Usage » ${config.prefix}advperm (user) (value)`);
        }

        text.shift();
        let user = msg.mentions.users.first();
        if(!user){
            return msg.channel.send(`${msg.author}, you didn't specify an user!`);
        }

        let value = text.join(" ");
        if(!value || value !== "enabled" && value !== "disabled"){
            return msg.channel.send(`${msg.author}, you didn't specify a value! Default values: \`enabled\`, \`disabled\``);
        }

        msg.channel.send(`Successfully changed advertise permission for ${user.username} to ${value}`);

        permissions.users[user.id].advertise = value;
        fs.writeFile("./configs/permissions.json", JSON.stringify(permissions, null, 4), (err) => { if(err) console.log(err) });

    }
}