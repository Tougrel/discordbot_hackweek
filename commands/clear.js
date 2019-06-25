module.exports = {
    name        : "clear",
    aliases     : ["purge"],
    guildOnly   : true,
    permissions : true,
    maintenance : false,
    cooldown    : 2,
    execute(bot, msg, args){

        const deleteCount = parseInt(args[0], 10);
        if(!deleteCount || deleteCount <= 2 || deleteCount >= 101) return msg.channel.send(`Please provide a number between 3 and 100`);

        msg.channel.bulkDelete(deleteCount).catch(err => msg.channel.send(`An unexpected error occurred! Please contact an administrator. Error details: ${err}`));
        msg.channel.send(`${deleteCount} messages deleted!`).then(msg => msg.delete(3000));

    }
}