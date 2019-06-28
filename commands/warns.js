module.exports = {
    name        : "warns",
    aliases     : ["userwarns"],
    guildOnly   : true,
    blacklist   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){
        
        const config = require("../configs/config.json");
        const times = require("../configs/times.json");

        let text = args.join(" ").split(" ");
        if(!text[0]){
            return msg.channel.send(`You didn't specify enough arguments! If you believe this is an error, contact a system administrator.\nCommand Usage » *${config.prefix}warns (user)*`);
        }

        let user = msg.mentions.users.first();
        if(!user){
            return msg.channel.send(`${msg.author}, you didn't specify an user!`);
        }

        if(times[msg.guild.id].warns[user.id]){
            if(user.id === msg.author.id){
                return msg.channel.send(`You have ${times[msg.guild.id].warns[user.id].number - 1} warnings at this time.`);
            }
            return msg.channel.send(`This user has ${times[msg.guild.id].warns[user.id].number - 1} warnings at this time.`);
        }
        else {
            if(user.id === msg.author.id){
                return msg.channel.send("You have no warnings at this time.");
            }
            return msg.channel.send("This user has no warnings at this time.");
        }

    }
}