module.exports = {
    name        : "settings",
    aliases     : ["guildsettings"],
    guildOnly   : true,
    blacklist   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        const fs = require("fs");
        const config = require("../configs/config.json");
        const settings = require("../configs/settings.json");

        let text = args.join(" ").split(" ");
        if(!text[0]){
            return msg.channel.send(`You didn't specify enough arguments! If you believe this is an error, contact a system administrator.\nCommand Usage » ${config.prefix}permissions (setting) (value)`);
        }

        let setting = text[0];

        text.shift();
        let value = text.join(" ");
        if(!value){
            return msg.channel.send(`${msg.author}, you didn't specify a value! Please use channel/role names.`);
        }

        if(settings[msg.guild.id][setting]){
            settings[msg.guild.id][setting] = value;
            fs.writeFile("./configs/settings.json", JSON.stringify(settings, null, 4), (err) => { if(err) console.log(err) });
        }
        else {
            return msg.channel.send("This setting does not exist! Please enter a valid setting name.");
        }

    }
}