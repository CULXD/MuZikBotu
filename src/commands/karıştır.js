module.exports = {
    name: 'karıştır',
    aliases: ['kşt'],
    description: 'Oynatma Listesini Karıştır',
    voiceChannel: true,
    options: [],

    execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing)
            return message.reply({ content: `❌ | Şu anda çalan müzik yok!.`, allowedMentions: { repliedUser: false } });


        const success = queue.shuffle();
        return success ? message.react('👍') : message.reply({ content: `❌ | Bir şeyler yanlış gitti.`, allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing)
            return interaction.reply({ content: `❌ | Şu anda çalan müzik yok!.`, allowedMentions: { repliedUser: false } });


        const success = queue.shuffle();
        return success ? interaction.reply('✅ | Müzik karışık.') : interaction.reply({ content: `❌ | Bir şeyler yanlış gitti.`, allowedMentions: { repliedUser: false } });
    },
};