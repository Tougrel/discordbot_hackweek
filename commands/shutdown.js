module.exports = {
    name        : "shutdown",
    aliases     : ["exit"],
    guildOnly   : true,
    blacklist   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        bot.destroy().then(() => console.log("Logged off."));

    }
}