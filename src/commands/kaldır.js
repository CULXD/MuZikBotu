const embed = require('../embeds/embeds');


module.exports = {
    name: 'kaldır',
    aliases: ['kld'],
    description: 'Oynatma listesinden kaldırılacak bir şarkı seçin',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);


        if (!queue || !queue.playing)
            return message.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        if (!queue.tracks[0])
            return message.reply({ content: `❌ | Geçerliden sonra kuyrukta müzik yok.`, allowedMentions: { repliedUser: false } });


        let nowplaying = `Şimdi oynuyor : ${queue.current.title}`;
        let queueMsg = '';
        if (queue.tracks.length > 9) {
            for (var i = 0; i <= 9; i++) {
                queueMsg += `${i + 1}. ${queue.tracks[i].title}\n`;
            }
            queueMsg += `Ve ${queue.tracks.length - 10} Diğer Şarkılar`;
        }
        else {
            for (var i = 0; i < queue.tracks.length; i++) {
                queueMsg += `${i + 1}. ${queue.tracks[i].title}\n`;
            }
        }
        const instruction = `Bir şarkı seçin **1** ile **${queue.tracks.length}** ile **kaldır** veya seçimi iptal etmek için başkalarını girin. ⬇️`
        let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'Hepsi' : 'TEKİ') : 'Hiçbiri';
        await message.reply({ content: instruction, embeds: [embed.Embed_queue("Listeyi Kaldır", nowplaying, queueMsg, loopStatus)], allowedMentions: { repliedUser: false } });


        const collector = message.channel.createMessageCollector({
            time: 10000, // 10s
            errors: ['time'],
            filter: m => m.author.id === message.author.id
        });

        collector.on('collect', async (query) => {

            const index = parseInt(query.content);

            if (!index || index <= 0 || index > queue.tracks.length)
                return message.reply({
                    content: `✅ | İptal edilmiş Kaldır.`,
                    allowedMentions: { repliedUser: false }
                }) && collector.stop();

            collector.stop();


            query.reply({
                embeds: [embed.Embed_remove("Kaldırıldı müzik", queue.tracks[index - 1].title)],
                allowedMentions: { repliedUser: false }
            });
            queue.remove(index - 1);
            return query.react('✅');
        });

        collector.on('end', (msg, reason) => {
            if (reason === 'time')
                return message.channel.send(`❌ | Şarkı Kaldır Süresi Süresi Doldu`);
        });
    },

    async slashExecute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);


        if (!queue || !queue.playing)
            return interaction.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        if (!queue.tracks[0])
            return interaction.reply({ content: `❌ | Geçerliden sonra kuyrukta müzik yok.`, allowedMentions: { repliedUser: false } });


        let nowplaying = `Şimdi oynuyor : ${queue.current.title}`;
        let queueMsg = '';
        if (queue.tracks.length > 9) {
            for (var i = 0; i <= 9; i++) {
                queueMsg += `${i + 1}. ${queue.tracks[i].title}\n`;
            }
            queueMsg += `Ve ${queue.tracks.length - 10} Diğer Şarkılar`;
        }
        else {
            for (var i = 0; i < queue.tracks.length; i++) {
                queueMsg += `${i + 1}. ${queue.tracks[i].title}\n`;
            }
        }
        const instruction = `Bir şarkı seçin **1** ile **${queue.tracks.length}** ile **kaldır** veya seçimi iptal etmek için başkalarını girin. ⬇️`
        let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'Hepsi' : 'TEKİ') : 'Hiçbiri';
        await interaction.reply({ content: instruction, embeds: [embed.Embed_queue("Listeyi Kaldır", nowplaying, queueMsg, loopStatus)], allowedMentions: { repliedUser: false } });


        const collector = interaction.channel.createMessageCollector({
            time: 10000, // 10s
            errors: ['time'],
            filter: m => m.author.id === interaction.user.id
        });

        collector.on('collect', async (query) => {

            const index = parseInt(query.content);

            if (!index || index <= 0 || index > queue.tracks.length)
                return query.reply({
                    content: `✅ | İptal edilmiş Kaldır.`,
                    allowedMentions: { repliedUser: false }
                }) && collector.stop();

            collector.stop();


            query.reply({
                embeds: [embed.Embed_remove("Kaldırıldı müzik", queue.tracks[index - 1].title)],
                allowedMentions: { repliedUser: false }
            });
            queue.remove(index - 1);
            return query.react('✅');
        });

        collector.on('end', (msg, reason) => {
            if (reason === 'time')
                return interaction.channel.send(`❌ | Şarkı Kaldır Süresi Süresi Doldu`);
        });
    },
};