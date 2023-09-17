module.exports = {
    name: 'atlat',
    aliases: ['a'],
    description: 'Mevcut şarkıyı atla',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing)
            return message.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });


        if (queue.repeatMode === 1) {
            queue.setRepeatMode(0);
            queue.skip();
            await wait(500);
            queue.setRepeatMode(1);
        }
        else
            queue.skip();

        return message.react('✅');
    },

    async slashExecute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing)
            return interaction.reply({ content: `❌ | Şu anda çalan müzik yok.`, allowedMentions: { repliedUser: false } });


        if (queue.repeatMode === 1) {
            queue.setRepeatMode(0);
            queue.skip();
            await wait(500);
            queue.setRepeatMode(1);
        }
        else
            queue.skip();

        return interaction.reply('✅ | Müzik atladı.');
    },
};




function wait(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
};