const embed = require('../embeds/embeds');


module.exports = {
    name: 'kuyruk',
    aliases: ['k'],
    description: 'Çalma Listesini Göster',
    voiceChannel: true,
    options: [],

    execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);


        if (!queue || !queue.playing)
            return message.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        if (!queue.tracks[0])
            return message.reply({ content: `❌ | Geçerliden sonra kuyrukta müzik yok.`, allowedMentions: { repliedUser: false } });


        let nowplay = `Şimdi oynuyor : ${queue.current.title}\n\n`;
        let queueMsg = '';
        if (queue.tracks.length > 9) {
            for (var i = 0; i <= 9; i++) {
                queueMsg += `${i + 1}. ${queue.tracks[i].title}\n`;
            }
            queueMsg += `and ${queue.tracks.length - 10} Diğer Şarkılar`;
        }
        else {
            for (var i = 0; i < queue.tracks.length; i++) {
                queueMsg += `${i + 1}. ${queue.tracks[i].title}\n`;
            }
        }

        let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'Hepsi' : 'Teki') : 'Hiçbiri';
        return message.reply({ embeds: [embed.Embed_queue("Kuyruk listesi", nowplay, queueMsg, loopStatus)], allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);


        if (!queue || !queue.playing)
            return interaction.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        if (!queue.tracks[0])
            return interaction.reply({ content: `❌ | Geçerliden sonra kuyrukta müzik yok.`, allowedMentions: { repliedUser: false } });


        let nowplay = `Şimdi oynuyor : ${queue.current.title}\n\n`;
        let queueMsg = '';
        if (queue.tracks.length > 9) {
            for (var i = 0; i <= 9; i++) {
                queueMsg += `${i + 1}. ${queue.tracks[i].title}\n`;
            }
            queueMsg += `Ve ${queue.tracks.length - 9} Diğer Şarkılar`;
        }
        else {
            for (var i = 0; i < queue.tracks.length; i++) {
                queueMsg += `${i + 1}. ${queue.tracks[i].title}\n`;
            }
        }

        let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'Hepsi' : 'Teki') : 'Hiçbiri';
        return interaction.reply({ embeds: [embed.Embed_queue("Kuyruk listesi", nowplay, queueMsg, loopStatus)] });
    },
};