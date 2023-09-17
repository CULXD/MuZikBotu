const { QueryType } = require('discord-player');


module.exports = {
    name: 'oynat',
    aliases: ['o'],
    description: 'Oynamak için şarkı bağlantınızı veya şarkı adınızı girin',
    voiceChannel: true,
    options: [
        {
            name: "search",
            description: "Şarkı bağlantısı veya şarkı adı",
            type: 3,
            required: true
        }
    ],

    async execute(client, message, args) {
        if (!args[0])
            return message.reply({ content: `❌ | Aramak istediğiniz müziğin adını yazın.`, allowedMentions: { repliedUser: false } });

        const res = await client.player.search(args.join(' '), {
            requestedBy: message.member,
            searchEngine: QueryType.AUTO
        })
            .catch((error) => {
                console.log(error);
                return message.reply({ content: `❌ | Hizmet bazı sorunlar yaşıyor, lütfen tekrar deneyin.`, allowedMentions: { repliedUser: false } });
            });

        if (!res || !res?.tracks?.length)
            return message.reply({ content: `❌ | Sonuç bulunamadı.`, allowedMentions: { repliedUser: false } });


        const queue = await client.player.createQueue(message.guild, {
            metadata: message.channel,
            leaveOnEnd: client.config.autoLeave,
            leaveOnEndCooldown: client.config.autoLeaveCooldown,
            leaveOnStop: client.config.autoLeave,
            leaveOnEmpty: client.config.autoLeave,
            leaveOnEmptyCooldown: client.config.autoLeaveCooldown,
            initialVolume: client.config.defaultVolume,
            ytdlOptions: client.config.ytdlOptions
        });

        try {
            if (!queue.connection)
                await queue.connect(message.member.voice.channel);
        } catch {
            await client.player.deleteQueue(message.guild.id);
            return message.reply({ content: `❌ | Ses kanalına katılamıyorum.`, allowedMentions: { repliedUser: false } });
        }

        await message.react('✅');

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing)
            await queue.play();
    },

    async slashExecute(client, interaction) {

        const res = await client.player.search(interaction.options.getString("search"), {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        })
            .catch((error) => {
                console.log(error);
                return message.reply({ content: `❌ | Hizmet bazı sorunlar yaşıyor, lütfen tekrar deneyin.`, allowedMentions: { repliedUser: false } });
            });

        if (!res || !res.tracks.length)
            return interaction.reply({ content: `❌ | Sonuç bulunamadı.`, allowedMentions: { repliedUser: false } });


        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel,
            leaveOnEnd: client.config.autoLeave,
            leaveOnEndCooldown: client.config.autoLeaveCooldown,
            leaveOnStop: client.config.autoLeave,
            leaveOnEmpty: client.config.autoLeave,
            leaveOnEmptyCooldown: client.config.autoLeaveCooldown,
            initialVolume: client.config.defaultVolume,
            ytdlOptions: client.config.ytdlOptions
        });

        try {
            if (!queue.connection)
                await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return interaction.reply({ content: `❌ | Ses kanalına katılamıyorum.`, allowedMentions: { repliedUser: false } });
        }

        await interaction.reply("✅ | Müzik eklendi.");

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing)
            await queue.play();
    },
};