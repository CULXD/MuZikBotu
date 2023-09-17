module.exports = {
    name: 'ses',
    aliases: ['s'],
    description: `Bot hacmini yapılandırın`,
    voiceChannel: true,
    options: [
        {
            name: "sess",
            description: "Ayarlanacak hacim",
            type: 4,
            required: true,
            min_value: 1
        }
    ],

    async execute(client, message, args) {
        const maxVolume = client.config.maxVolume;
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing)
            return message.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        await message.react('✅');
        const vol = parseInt(args[0]);

        if (!vol)
            return message.reply({ content: `Mevcut ses: **${queue.volume}** 🔊\n**Sesi ayarlamak için \`1\` ile \`${maxVolume}\` arasındabir sayı yazın.**`, allowedMentions: { repliedUser: false } });

        if (queue.volume === vol)
            return message.reply({ content: `❌ | Değiştirmek istediğiniz hacim zaten geçerli cilttir.`, allowedMentions: { repliedUser: false } });

        if (vol < 0 || vol > maxVolume)
            return message.reply({ content: `❌ | **Sesi ayarlamak için \`1\` ile \`${maxVolume}\` arasında bir sayı yazın.**`, allowedMentions: { repliedUser: false } });


        const success = queue.setVolume(vol);
        const replymsg = success ? `🔊 **${vol}**/**${maxVolume}**%` : `❌ | Bir şeyler yanlış gitti.`;
        return message.reply({ content: replymsg, allowedMentions: { repliedUser: false } });
    },

    async slashExecute(client, interaction) {
        const maxVolume = client.config.maxVolume;
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing)
            return interaction.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        const vol = interaction.options.getInteger("volume");

        if (queue.volume === vol)
            return interaction.reply({ content: `❌ | Değiştirmek istediğiniz hacim zaten geçerli hacimdir.`, allowedMentions: { repliedUser: false } });

        if (vol < 0 || vol > maxVolume)
            return interaction.reply({ content: `❌ | **Sesi ayarlamak için \`1\` ile \`${maxVolume}\` arasında bir sayı yazın.**`, allowedMentions: { repliedUser: false } });


        const success = queue.setVolume(vol);
        const replymsg = success ? `🔊 **${vol}**/**${maxVolume}**%` : `❌ | Bir şeyler yanlış gitti.`;
        return interaction.reply({ content: replymsg, allowedMentions: { repliedUser: false } });
    },
};