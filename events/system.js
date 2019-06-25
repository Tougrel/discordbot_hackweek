module.exports.run = function(bot){

    const discord = require("discord.js");
    const fs = require("fs");

    const cooldowns = new discord.Collection();

    let permissions = require("../configs/permissions.json");
    let package = require("../package.json");
    let config = require("../configs/config.json");

    bot.on("ready", () => {
        bot.user.setActivity(`Centaurus ${package.version}`);
        console.log("System initialized!");
    });

    // Permissions Stats
    bot.on("message", msg => {
        if(msg.author.bot) return;
        if(!permissions.users[msg.author.id]) permissions.users[msg.author.id] = {
            blacklist: "disabled",
            commands: {
                permissions: "disabled",
                botexit: "disabled",
                server: "enabled",
                clear: "disabled",
                warns: "enabled",
                role: "disabled",
                user: "enabled",
                help: "enabled",
                kick: "disabled",
                mute: "disabled",
                warn: "disabled",
                ban: "disabled"
            },
            commandHistoryNumber: 0,
            commandHistory: {},
            warnsNumber: 0,
            warns: {}
        }
        fs.writeFile("./configs/permissions.json", JSON.stringify(permissions, null, 4), (err) => { if(err) console.log(err) });
    });

    // Command Handler
    bot.on("message", msg => {
        if(msg.author.bot) return;
        if(msg.content.indexOf(config.prefix) !== 0) return;

        let args = msg.content.slice(config.prefix.length).split(/ +/);
        let commandName = args.shift().toLowerCase();
        if(!commandName) return;

        let command = bot.commands.get(commandName) || bot.commands.find(command => command.aliases && command.aliases.includes(commandName));
        if(!command){
            if(config.prefix === "<") return;
            return msg.channel.send(`${msg.author}, the command you specified was not found! If you believe this is an error, please contact an administrator.`);
        }
        
        let name = command.name || command.aliases;
        if(command.guildOnly && msg.channel.type !== "text"){
            return msg.channel.send(`I'm sorry ${msg.author}, but I can only execute this command inside guilds.`);
        }
        if(command.permissions && permissions.users[msg.author.id].commands[name.toLowerCase()] === "disabled"){
            return msg.channel.send(`I'm sorry ${msg.author}, I'm afraid I can't do that.`);
        }
        if(command.maintenance){
            return msg.channel.send(`I'm sorry ${msg.author}, this command is currently under maintenance! We are trying our best to make it better. Please try again later!`);
        }
        if(!cooldowns.has(command.name)){
            cooldowns.set(command.name, new discord.Collection());
        }

        let now = new Date(),
            timestamps = cooldowns.get(command.name),
            cooldownAmount = (command.cooldown || 2) * 1000;
        if(timestamps.has(msg.author.id)){
            let expireTime = timestamps.get(msg.author.id) + cooldownAmount;
            if(now < expireTime){
                let timeLeft = (expireTime - now) / 1000;
                
                return msg.channel.send(`${msg.author}, please wait **${timeLeft.toFixed(1)}** more second(s) before reusing the **${command}** command.`);
            }
        }

        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

        try {
            command.execute(bot, msg, args);

            permissions.users[msg.author.id].commandHistory[msg.createdTimestamp] = msg.content;
            permissions.users[msg.author.id].commandHistoryNumber += 1;
            fs.writeFile("./configs/permissions.json", JSON.stringify(permissions, null, 4), (err) => { if(err) console.log(err) });
        } catch(err) {
            console.log(err);
            msg.channel.send("An unexpected error occured while executing this command! Please contact a system administrator.");
        }

    });

}