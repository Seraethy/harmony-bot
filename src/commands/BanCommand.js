let BaseCommand = require(__dirname + '/BaseCommand');
let config = require('../config/config');
let Discord = require('discord.js');

class BanCommand extends BaseCommand {
    run() {

        if(!this.hasPermission(Discord.Permissions.FLAGS.BAN_MEMBERS))
        {
            console.log('Invalid permissions');
            return;
        }

        let userToBan = null;

        // If no user is tagged then fall back to the second parameter
        if(this.mentions.users.array().length === 0)
        {
            let findUser = this.findGuildUserByUsername(this.args[1]);

            if(findUser !== null)
            {
                userToBan = findUser.user;
                console.log("Trying to find a user with name as there is no tag", userToBan);
            }
            else
            {
                console.log('Failed to ban, invalid user', findUser, this.args[1]);
            }

        }
        else
        {
            userToBan = this.mentions.users.first();
            console.log("Banning user via @tag", userToBan);
        }

        if(userToBan !== null)
        {
            console.log(`Banning ${userToBan.username}`);

            this.guild.ban(userToBan.id, 0, this.message.split(' ').slice(1).join(' '))
                .catch(() => {
                    console.error(`Failed to ban ${userToBan.username}`)
                });

            let embed = new Discord.RichEmbed();

            embed
                .setAuthor("Harmony Bot")
                .addField("Action", "/ban")
                .addField("Content", this.message)
                .setColor(0xff2020)
                .setTimestamp()
                .setFooter(this.author.username + "#" + this.author.discriminator);

            this.getChannel(config.staffGeneralLogChannel).send({
                embed: embed
            })
        }
    }
}

module.exports = BanCommand;