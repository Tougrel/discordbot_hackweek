module.exports = {
    name        : "server",
    aliases     : ["guild"],
    guildOnly   : true,
    blacklist   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        const discord = require("discord.js");
        const config = require("../configs/config.json");

        let guild = msg.guild;
        if(!args.length){
            let category = 0;
            let voice = 0;
            let text = 0;

            guild.channels.forEach(channel => {
                if(channel.type === "category") category += 1;
                if(channel.type === "voice") text += 1;
                if(channel.type === "text") text += 1;
            });

            let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
            let embed = new discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`ID: ${guild.id}`)
            .setAuthor(guild.name, guild.iconURL)
            .setThumbnail(guild.iconURL)
            .addField("Verification Level", verifLevels[guild.verificationLevel], true)
            .addField("Region", guild.region, true)
            .addField(`Members [${guild.memberCount}]`, `Total » ${guild.memberCount} \nUsers » ${guild.members.filter(m => !m.user.bot).size}\nBots » ${guild.members.filter(m => m.user.bot).size}`, true)
            .addField(`Channels [${msg.guild.channels.size}]`, `Categories » ${category}\nVoice » ${voice}\nText » ${text}`, true)
            .addField("Server Owner", `${guild.owner} (${guild.ownerID})`, true)
            .addField("Created On", guild.createdAt, true)
.addField(`Roles [${guild.roles.size}]`, `To see a list with all roles use ${config.prefix}server roles`);

            msg.channel.send(embed);
            return;
        }

        if(args[0].toLowerCase() === "roles"){
            let roles = msg.guild.roles;
            let embed = new discord.RichEmbed()
            .setColor(config.color)
            .setDescription(roles.map(role => `${role.name}`).join(" "));
            msg.channel.send(embed);
            return;
        }

    }
}