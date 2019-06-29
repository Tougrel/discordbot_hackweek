module.exports.run = function(bot){

    const discord = require("discord.js");
    const fs = require("fs");

    const cooldowns = new discord.Collection();

    const permissions = require("../configs/permissions.json");
    const settings = require("../configs/settings.json");
    const config = require("../configs/config.json");
    const times = require("../configs/times.json");
    const package = require("../package.json");

    bot.on("ready", () => {
        bot.user.setActivity(`Centaurus ${package.version}`);
        console.log("System initialized!");

        if(!permissions.users){
            permissions.users = {};
            fs.writeFile("./configs/permissions.json", JSON.stringify(permissions, null, 4), (err) => { if(err) console.log(err) });
        }

        bot.guilds.forEach(guild => {
            if(!settings[guild.id]){
                settings[guild.id] = {
                    logs: null,
                    muterole: null
                }
            }
            if(!times[guild.id]){
                times[guild.id] = {
                    mutes: {},
                    warns: {},
                    bans: {}
                }
            }
        });

        setInterval(function(){
            bot.guilds.forEach(guild => {
                for(let i in times[guild.id].bans){
                    let bans = times[guild.id].bans;
                    if(bans[i] && bans[i].time > 0){
                        bans[i].time -= 1000;
                        fs.writeFile("./configs/times.json", JSON.stringify(times, null, 4), (err) => { if(err) console.log(err) });
                    }
                    else if(bans[i] && bans[i].time <= 0){
                        guild.unban(i);
                        delete bans[i];
                        fs.writeFile("./configs/times.json", JSON.stringify(times, null, 4), (err) => { if(err) console.log(err) });
                    }
                }
            });
        }, 1000);
        setInterval(function(){
            bot.guilds.forEach(guild => {
                let muterole = guild.roles.find(role => role.name.toLowerCase() === settings[guild.id].muterole);
                if(!muterole) return;

                guild.members.forEach(member => {
                    if(!guild.members.get(member.id)) return;

                    let mutes = times[guild.id].mutes;
                    if(mutes[member.id] && mutes[member.id].time > 0){
                        if(!member.roles.has(muterole.id)){
                            member.addRole(muterole);
                        }
                        mutes[member.id].time -= 1000;
                        fs.writeFile("./configs/times.json", JSON.stringify(times, null, 4), (err) => { if(err) console.log(err) });
                    }
                    else if(mutes[member.id] && mutes[member.id].time <= 0){
                        if(member.roles.has(muterole.id)){
                            member.removeRole(muterole);
                            delete mutes[member.id];
                            fs.writeFile("./configs/times.json", JSON.stringify(times, null, 4), (err) => { if(err) console.log(err) });
                        }
                    }
                });

            });
        }, 1000);

        fs.writeFile("./configs/settings.json", JSON.stringify(settings, null, 4), (err) => { if(err) console.log(err) });
        fs.writeFile("./configs/times.json", JSON.stringify(times, null, 4), (err) => { if(err) console.log(err) });
    });

    // Permissions Stats
    bot.on("message", msg => {
        if(msg.author.bot) return;
        if(!permissions.users[msg.author.id]){
            permissions.users[msg.author.id] = {
                advertise: "disabled",
                blacklist: "disabled",
                commands: {
                    permissions: "disabled",
                    blacklist: "disabled",
                    advertise: "disabled",
                    shutdown: "disabled",
                    settings: "disabled",
                    restart: "disabled",
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
        }
        fs.writeFile("./configs/permissions.json", JSON.stringify(permissions, null, 4), (err) => { if(err) console.log(err) });
    });

    // Anti-Advertise
    bot.on("message", async msg => {
        let links = ["discord.gg", "discord.me", "https://", "http://", "www."];
        if(links.some(w => msg.content.toLowerCase().includes(w))){
            // If the user has the permission to bypass the anti-advertise system return nothing.
            if(permissions.users[msg.author.id].advertise === "enabled") return;
            await msg.delete();
            
            msg.channel.send(`Hey, ${msg.author}, sending links isn't allowed here.`).then(message => message.delete(5000));
        }
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
            return msg.channel.send(`🚨 ${msg.author}, the command you specified was not found! If you believe this is an error, please contact an administrator.`);
        }
        
        let name = command.name || command.aliases;
        if(command.guildOnly && msg.channel.type !== "text"){
            return msg.channel.send(`🚨 I'm sorry ${msg.author}, but I can only execute this command inside guilds.`);
        }
        if(command.blacklist && permissions.users[msg.author.id].blacklist === "enabled"){
            return msg.channel.send(`🚨 I'm sorry ${msg.author}, I'm afraid I can't do that.`);
        }
        if(command.permissions && permissions.users[msg.author.id].commands[name.toLowerCase()] === "disabled"){
            return msg.channel.send(`🚨 I'm sorry ${msg.author}, I'm afraid I can't do that. If you are the guild owner use the command ${config.prefix}administrator.`);
        }
        if(command.maintenance){
            return msg.channel.send(`🚨 I'm sorry ${msg.author}, this command is currently under maintenance! We are trying our best to make it better. Please try again later!`);
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
                
                return msg.channel.send(`🚨 ${msg.author}, please wait **${timeLeft.toFixed(1)}** more second(s) before reusing the **${command}** command.`);
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
            msg.channel.send(":warning: An unexpected error occured while executing this command! Please contact a system administrator. :warning:");
        }

    });

    // Create settings.
    bot.on("guildCreate", guild => {
        if(!settings[guild.id]){
            settings[guild.id] = {
                logs: null,
                muterole: null
            }
        }
        fs.writeFile("./configs/settings.json", JSON.stringify(settings, null, 4), (err) => { if(err) console.log(err) });
    });

    // Delete settings.
    bot.on("guildDelete", guild => {
        delete settings[guild.id];
        fs.writeFile("./configs/settings.json", JSON.stringify(settings, null, 4), (err) => { if(err) console.log(err) });
    });

}