module.exports = {
    name: 'geri',
    aliases: ['g'],
    description: 'Önceki şarkıya geri dön',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing)
            return message.reply({ content: `❌ | Şu anda çalıyor müzik yok.`, allowedMentions: { repliedUser: false } });

        if (!queue.previousTracks[1])
            return message.reply({ content: `❌ | Daha önce çalan müzik yoktu.`, allowedMentions: { repliedUser: false } });

        await queue.back();
        return await message.react('✅');
    },

    async slashExecute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing)
            return interaction.reply({ content: `❌ | Şu anda çalıyor müzik yok.`, allowedMentions: { repliedUser: false } });

        if (!queue.previousTracks[1])
            return interaction.reply({ content: `❌ | Daha önce çalan müzik yoktu.`, allowedMentions: { repliedUser: false } });

        await queue.back();
        return await interaction.reply("✅ | Müzik geri sarma.");
    },
};