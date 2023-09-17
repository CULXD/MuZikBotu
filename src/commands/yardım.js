// const embed = require('../embeds/embeds');
const Discord = require('discord.js');

module.exports = {
    name: 'yardım',
    aliases: ['y'],
    showHelp: false,
    description: 'Biraz komut yardımı alın',
    options: [],

    execute(client, message, args) {
        const prefix = client.config.prefix;
        const commands = client.commands.filter(x => x.showHelp !== false);
        const Embed_help = new Discord.EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('**Tüm komutlarımın listesi**')
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
        commands.forEach((cmd) => {
            Embed_help.addFields({name: `**${prefix}${cmd.name}**`, value: `${cmd.description} | Kısayollar: (${cmd.aliases ? `${cmd.aliases}` : ""})`, inline: true})
        })

        return message.reply({ embeds: [Embed_help], allowedMentions: { repliedUser: false } });
    },

    async slashExecute(client, interaction) {
        const prefix = client.config.prefix;
        const commands = client.commands.filter(x => x.showHelp !== false);
        const Embed_help = new Discord.EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('**Tüm komutlarımın listesi**')
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
        commands.forEach((cmd) => {
            Embed_help.addFields({name: `**${prefix}${cmd.name}**`, value: `${cmd.description} | Kısayollar: (${cmd.aliases ? `${cmd.aliases}` : ""})`, inline: true})
        })

        return interaction.reply({ embeds: [Embed_help], allowedMentions: { repliedUser: false }});
    },
};
