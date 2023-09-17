module.exports = {
    name: 'çık',
    aliases: ['cık'],
    description: 'Mevcut ses kanalından ayrılır',
    voiceChannel: true,
    options: [],

    execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing)
            return message.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        queue.destroy();
        return message.react('✅');
    },

    slashExecute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing)
            return interaction.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        queue.destroy();
        return interaction.reply('✅ | Bot başarı ile çıktı.');
    },
};