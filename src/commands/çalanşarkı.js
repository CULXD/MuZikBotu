const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const embed = require('../embeds/embeds');


module.exports = {
    name: 'çalanşarkı',
    aliases: ['çş'],
    description: 'Şuanda çalan şarkıyı görüntülersin',
    voiceChannel: true,
    options: [],

    execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing)
            return message.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        const track = queue.current;

        const timestamp = queue.getPlayerTimestamp();

        const progress = queue.createProgressBar();
        if (timestamp.progress == 'Infinity')
            return message.reply({ content: `❌ | Bu şarkı canlı akış, görüntülenecek süre verisi yok.`, allowedMentions: { repliedUser: false } });
        let description = `Yapımcı : **${track.author}**\n${progress} (**${timestamp.progress}**%)`;
        let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'All' : 'One') : 'Off';

        let saveButton = new ButtonBuilder();
        saveButton.setCustomId('Save Song');
        saveButton.setLabel('Şarkıyı Kaydet');
        saveButton.setStyle(ButtonStyle.Success);
        const row = new ActionRowBuilder().addComponents(saveButton);

        return message.channel.send({ embeds: [embed.Embed_save(track.title, track.url, track.thumbnail, description, loopStatus)], components: [row] });
    },

    async slashExecute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing)
            return await interaction.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        const track = queue.current;

        const timestamp = queue.getPlayerTimestamp();

        const progress = queue.createProgressBar();
        if (timestamp.progress == 'Infinity')
            return message.reply({ content: `❌ | Bu şarkı canlı akış, görüntülenecek süre verisi yok.`, allowedMentions: { repliedUser: false } });
        let description = `Yazar : **${track.author}**\n${progress} (**${timestamp.progress}**%)`;
        let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'All' : 'One') : 'Off';

        let saveButton = new ButtonBuilder();
        saveButton.setCustomId('Save Song');
        saveButton.setLabel('Şarkıyı Kaydet');
        saveButton.setStyle(ButtonStyle.Success);
        const row = new ActionRowBuilder().addComponents(saveButton);
        return await interaction.reply({ embeds: [embed.Embed_save(track.title, track.url, track.thumbnail, description, loopStatus)], components: [row]});
    },
};