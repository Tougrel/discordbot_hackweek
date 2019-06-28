module.exports = {
    name        : "restart",
    aliases     : ["systemrestart"],
    guildOnly   : true,
    blacklist   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        const secret = require("../configs/secret.json");

        console.log("\x1b[33mWARNING \x1b[0m Restarting bot using restart command...");

        bot.destroy()
        .then(() => bot.login(secret.TOKEN))
        .catch(err => console.log(err))
        .then(() => {
            console.log(`\x1b[33mWARNING \x1b[0m Restart command was used by ${msg.author.username}`);
            msg.channel.send(":warning: Successfully restarted.");
        });

    }
}