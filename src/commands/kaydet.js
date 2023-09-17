const embed = require('../embeds/embeds');


module.exports = {
    name: 'kaydet',
    aliases: ['kd'],
    description: 'Mevcut Şarkıyı Kaydet',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing)
            return message.reply({ content: `❌ | Şu anda çalan müzik yok!. `, allowedMentions: { repliedUser: false } });


        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == 'Sonsuza kadar' ? 'Sonsuz (Canlı)' : queue.current.duration;
        let description = `Yapımcı : **${queue.current.author}**\nSüre **${trackDuration}**`;

        message.author.send({ embeds: [embed.Embed_save(queue.current.title, queue.current.url, queue.current.thumbnail, description)] })
            //message.author.send(`Registered track: **${queue.current.title}** | ${queue.current.author}, Saved server: **${message.guild.name}** ✅`)
            .then(() => {
                message.react('✅');
            })
            .catch(error => {
                console.log('error: ' + error);
                message.react('❌');
            });
    },

    async slashExecute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing)
            return interaction.reply({ content: `❌ | Şu anda çalan müzik yok!. `, allowedMentions: { repliedUser: false } });


        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == 'Sonsuza kadar' ? 'Sonsuz (Canlı)' : queue.current.duration;
        let description = `Author : **${queue.current.author}**\nSüre **${trackDuration}**`;

        interaction.user.send({ embeds: [embed.Embed_save(queue.current.title, queue.current.url, queue.current.thumbnail, description)] })
            .then(() => {
                interaction.reply("✅ | Müzik gönderildi.")
            })
            .catch(error => {
                console.log('error: ' + error);
                interaction.reply("❌ | Sana müziği gönderemem.")
            });
    },
};