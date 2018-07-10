exports.commands = [
/*	"create",
	"voice",
	"delete",
	"servers",
	"topic"
*/
]

exports.servers = {
	description: "Tells you what servers the bot is in",
	process: function(bot,msg) {
		msg.channel.send(`__**${bot.user.username} is currently on the following servers:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`, {split: true});
	}
};
