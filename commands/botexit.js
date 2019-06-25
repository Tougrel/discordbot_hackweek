module.exports = {
    name        : "exit",
    aliases     : ["botexit"],
    guildOnly   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        bot.destroy().then(() => console.log("Logged off."));

    }
}