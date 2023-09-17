const color = { white: '\x1B[0m', grey: '\x1B[2m' };
let pool = [];

module.exports = async (client, oldState, newState) => {
    const display = client.config.displayVoiceState;

    if (newState.channelId === null) {
        if (display) console.log(`${color.grey}-- ${newState.member.user.username} Kanaldan çıktı ${color.white}`);
    }
    else if (oldState.channelId === null) {
        if (display) console.log(`${color.grey}-- ${newState.member.user.username} Kanala giriş yaptı ${newState.channel.name}${color.white}`);
    }
    else {
        if (display) console.log(`${color.grey}-- ${newState.member.user.username} Şu kanaldan ${oldState.channel.name} şu kanala geçiş yaptı ${newState.channel.name}${color.white}`);


        
        if (!oldState.member.user.bot) {
            const queue = await client.player.getQueue(oldState.guild.id);
            const botChannelId = queue?.connection?.channel?.id;
            const oldChannelId = oldState.channel.id;
            const newChannelId = newState.channel.id;

            if (botChannelId === oldChannelId) {

                
                if (oldState.channel.members.size <= 1) {

                    let timeoutID = setTimeout(() => {
                        client.player.deleteQueue(oldState.guild.id);
                    }, client.config.autoLeaveCooldown);

                    pool.push({
                        guildId: oldState.guild.id,
                        timeoutId: timeoutID
                    });
                    
                }
            }
            else if (botChannelId === newChannelId) {

                
                if (newState.channel.members.size > 1 && newState.channel.members.size <= 2) {

                    
                    for (var i = 0; i < pool.length; i++) {
                        
                        if (pool[i].guildId === newState.guild.id) {
                            clearTimeout(pool[i].timeoutId);
                            pool.splice(i, 1);
                        }
                    }
                }
            }
        }
    }
};