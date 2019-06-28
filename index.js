const discord = require("discord.js");
const fs = require("fs");

const bot = new discord.Client();
const config = require("./configs/config.json")

bot.commands = new discord.Collection(); 

const system = require("./events/system.js");
system.run(bot);

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for(const file of commandFiles){
    const cmd = require(`./commands/${file}`);
    bot.commands.set(cmd.name, cmd);
}

bot.login(config.TOKEN);