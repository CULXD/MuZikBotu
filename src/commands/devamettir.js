module.exports = {
    name: 'devamet',
    aliases: ['dt'],
    description: 'Özgeçmiş duraklatılmış şarkı',
    voiceChannel: true,
    options: [],

    execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue)
            return message.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        const success = queue.setPaused(false);
        return success ? message.react('▶️') : message.reply({ content: `❌ | Bir şeyler yanlış gitti.`, allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue)
            return interaction.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        const success = queue.setPaused(false);
        return success ? interaction.reply("▶️ | Müzik Devam Edildi.") : interaction.reply({ content: `❌ | Bir şeyler yanlış gitti.`, allowedMentions: { repliedUser: false } });
    },
};