const embed = require('../embeds/embeds');

module.exports = (client, int) => {

    if (int.isButton()) {
        const queue = client.player.getQueue(int.guildId);
        if (!queue || !queue.playing)
            return int.reply({ content: `❌ | Şu anda çalan müzik yok.`, ephemeral: true, components: [] });

        const track = queue.current;
        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == 'Sonsuza kadar' ? 'Sonsuz (Canlı)' : track.duration;
        let description = `Yapımcı : **${track.author}**\Süren **${trackDuration}**`;

        switch (int.customId) {
            case 'Save Song': {
                if (!queue || !queue.playing)
                    return int.reply({ content: `❌ | Şu anda çalıyor müzik yok.`, ephemeral: true, components: [] });
                int.member.send({ embeds: [embed.Embed_save(track.title, track.url, track.thumbnail, description)] })
                    .then(() => {
                        return int.reply({ content: `✅ | Sana müziğin adını özel bir mesajla gönderdim.`, ephemeral: true, components: [] });
                    })
                    .catch(error => {
                        console.log('error: ' + error);
                        return int.reply({ content: `❌ | Sana özel bir mesaj gönderemem.`, ephemeral: true, components: [] });
                    });
            } break;
        }
    }
    else {
        if (!int.isCommand() || !int.inGuild() || int.member.user.bot) return;
        const cmd = client.commands.get(int.commandName);
        if (cmd)
        cmd.slashExecute(client, int);
    }
};