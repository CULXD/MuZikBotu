module.exports = {
    name: 'döngü',
    aliases: ['d'],
    description: 'Müzik Döngüsü Modunu Aç veya Kapatma',
    voiceChannel: true,
    options: [
        {
            name: "mod",
            description: "Döngü modu",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Hiçbiri",
                    value: "hiçbiri"
                },
                {
                    name: "Hepsi",
                    value: "hepsi"
                },
                {
                    name: "Teki",
                    value: "teki"
                }
            ]
        }
    ],

    execute(client, message, args) {
        const queue = client.player.getQueue(message.guild.id);
        const prefix = client.config.prefix;

        if (!queue || !queue.playing)
            return message.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });

        let mode = null;
        const methods = ['hiçbiri', 'teki', 'hepsi'];

        if (!args[0])
            return message.reply({ content: `❌ | ${prefix}döngü [hepsi/teki/hiçbiri]`, allowedMentions: { repliedUser: false } });

        switch (args[0].toLowerCase()) {
            case 'hiçbiri':
                mode = 0;
                break;
            case 'teki' || 'Tek':
                mode = 1;
                break;
            case 'hepsi' || 'sıra':
                mode = 2;
                break;
            default:
                return message.reply({ content: `❌ | ${prefix}döngü [hepsi/teki/hiçbiri]`, allowedMentions: { repliedUser: false } });
        }
        queue.setRepeatMode(mode);

        message.react('✅');
        return message.reply({ content: `Döngü ayarlandı \`${methods[mode]}\``, allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing)
            return interaction.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });


        const methods = {
            hiçbiri: 0,
            teki: 1,
            hepsi: 2
        }
        const names = {
            hiçbiri: "Hiçbiri",
            teki: "Teki",
            hepsi: "Hepsi"
        }

        queue.setRepeatMode(methods[interaction.options.getString("mod")]);

        return interaction.reply({ content: `Döngü ayarlandı \`${names[interaction.options.getString("mod")]}\``, allowedMentions: { repliedUser: false } });
    },
};
