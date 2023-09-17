module.exports = {
    name: 'durdur',
    aliases: ['dr'],
    description: 'Çalan şarkıyı duraklatır',
    voiceChannel: true,
    options: [],

    execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing)
            return message.reply({ content: `❌ | Şu anda çalan müzik yok!.`, allowedMentions: { repliedUser: false } });

        const success = queue.setPaused(true);
        return success ? message.react('⏸️') : message.reply({ content: `❌ | Bir şeyler yanlış gitti.`, allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing)
            return interaction.reply({ content: `❌ | Şu anda çalan müzik yok!.`, allowedMentions: { repliedUser: false } });

        const success = queue.setPaused(true);
        return success ? interaction.reply("⏸️ | Müzik durakladı.") : interaction.reply({ content: `❌ | Bir şeyler yanlış gitti.`, allowedMentions: { repliedUser: false } });
    },
};