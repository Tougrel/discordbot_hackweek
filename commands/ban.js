module.exports = {
    name        : "ban",
    aliases     : ["pban"],
    guildOnly   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        const fs = require("fs");
        const config = require("../configs/config.json");
        const permissions = require("../configs/permissions.json");

        let text = args.join(" ").split(" ");
        if(!text[0]){
            return msg.channel.send(`You didn't specify enough arguments! If you believe this is an error, contact a system administrator.\nCommand Usage » ${config.prefix}permissions (command) (user)`);
        }

        let command = text[0];

        text.shift();
        let user = msg.mentions.users.first();
        if(!user){
            return msg.channel.send(`${msg.author}, you didn't specify an user!`);
        }

        text.shift();
        let value = text.join(" ");
        if(!value){
            return msg.channel.send(`${msg.author}, you didn't specify a value! Default values: \`enabled\`, \`disabled\``);
        }

        // <perms [command] [user];
        permissions.users[user.id].commands[command] = value;

        // Write updated permissions to file
        fs.writeFile("./configs/permissions.json", JSON.stringify(permissions, null, 4), (err) => { if(err) console.log(err) });

    }
}