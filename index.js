'use strict';

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    Events
} = require('discord.js');
const {
    Player
} = require('discord-player');
const express = require('express');
require('console-stamp')(console, {
    format: ':date(yyyy/mm/dd HH:MM:ss.l)'
});

const ENV = dotenv.config({
    path: path.resolve(__dirname, './config.env')
}).parsed;
const embed = require('./src/embeds/embeds');

let client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel],
    disableMentions: 'everyone',
});


client.config = {
    name: 'Müzik diski',
    prefix: '-',
    playing: '.Yardım | müzik',
    defaultVolume: 50,
    maxVolume: 100,
    autoLeave: true,
    autoLeaveCooldown: 5000,
    displayVoiceState: true,
    port: 33333
};

client.config.ytdlOptions = {
    filter: 'audioonly',
    quality: 'highestaudio',
    highWaterMark: 1 << 27 // about 134 mins
}


client.commands = new Collection();
client.player = new Player(client, {
    ytdlOptions: client.config.ytdlOptions
});
const player = client.player;


const setEnvironment = () => {

    client.config.name = typeof (ENV.NAME) === 'undefined' ?
        client.config.name :
        ENV.NAME;

    client.config.prefix = typeof (ENV.PREFIX) === 'undefined' ?
        client.config.prefix :
        ENV.PREFIX;

    client.config.playing = typeof (ENV.PLAYING) === 'undefined' ?
        client.config.playing :
        ENV.PLAYING;

    client.config.defaultVolume = typeof (ENV.DEFAULT_VOLUME) === 'undefined' ?
        client.config.defaultVolume :
        Number(ENV.DEFAULT_VOLUME);

    client.config.maxVolume = typeof (ENV.MAX_VOLUME) === 'undefined' ?
        client.config.maxVolume :
        Number(ENV.MAX_VOLUME);

    client.config.autoLeave = typeof (ENV.AUTO_LEAVE) === 'undefined' ?
        client.config.autoLeave :
        (String(ENV.AUTO_LEAVE) === 'true' ? true : false);

    client.config.autoLeaveCooldown = typeof (ENV.AUTO_LEAVE_COOLDOWN) === 'undefined' ?
        client.config.autoLeaveCooldown :
        Number(ENV.AUTO_LEAVE_COOLDOWN);

    client.config.displayVoiceState = typeof (ENV.DISPLAY_VOICE_STATE) === 'undefined' ?
        client.config.displayVoiceState :
        (String(ENV.DISPLAY_VOICE_STATE) === 'true' ? true : false);

    client.config.port = typeof (ENV.PORT) === 'undefined' ?
        client.config.port :
        Number(ENV.PORT);

    return console.log('setEnvironment: ', client.config);
}


const loadEvents = () => {
    return new Promise((resolve, reject) => {
        const events = fs.readdirSync('./src/events/').filter(file => file.endsWith('.js'));
        for (const file of events) {
            try {
                const event = require(`./src/events/${file}`);
                console.log(`-> Event yüklendi ✅ ${file.split('.')[0]}`);

                client.on(file.split('.')[0], event.bind(null, client));
                delete require.cache[require.resolve(`./src/events/${file}`)];
            } catch (error) {
                reject(error);
            }
        };

        resolve();
    })
}


const loadFramework = () => {
    console.log(`-> Web Çerçevesi Yükleme ......`);
    return new Promise((resolve, reject) => {
        const app = express();
        const port = client.config.port || 33333;

        app.listen(port, function () {
            console.log(`Sunucu Dinlemeyi Başlatmaya Başlayın ${port}`);
        })

        app.get('/', function (req, res) {
            res.send('200 Tamam.')
        })

        resolve();
    })
}


const loadCommands = () => {
    console.log(`-> loading commands ......`);
    return new Promise((resolve, reject) => {
        fs.readdir('./src/commands/', (err, files) => {
            console.log(`+-----------------------------+`);
            if (err)
                return console.log('Herhangi bir komut bulamadım!');

            const jsFiles = files.filter(file => file.endsWith('.js'));

            if (jsFiles.length <= 0)
                return console.log('Herhangi bir komut bulamadım!');

            for (const file of jsFiles) {
                try {
                    const command = require(`./src/commands/${file}`);

                    console.log(`|  ${command.name.toLowerCase()} Adlı komut yüklendi ✅  \t|`);

                    client.commands.set(command.name.toLowerCase(), command);
                    delete require.cache[require.resolve(`./src/commands/${file}`)];
                } catch (error) {
                    reject(error);
                }
            };
            console.log(`+-----------------------------+`);
            console.log('-- Komut yükleme sonlandı --');

            resolve();
        });
    })
}


Promise.all([setEnvironment(), loadEvents(), loadFramework(), loadCommands()])
    .then(function () {
        console.log('\x1B[32m*** Yüklenmesi gereken  herşey yüklendi hazırım ✅ ***\x1B[0m');
        client.login(ENV.TOKEN);
    });




const settings = (queue, song) =>
    `**Ses**: \`${queue.volume}%\` | **Döngü**: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Hepsi' : 'Teki') : 'kapalı'}\``;


player.on('error', (queue, error) => {
    console.log(`Şarkı kuyruğunda bir sorun vardı => ${error.message}`);
});

player.on('connectionError', (queue, error) => {
    console.log(`Bağlanmada sorun yaşıyorum => ${error.message}`);
});

player.on('trackStart', (queue, track) => {
    if (queue.repeatMode !== 0) return;
    let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'Hepsi' : 'Teki') : 'kapalı';
    queue.metadata.send({
        embeds: [embed.Embed_play("Oynama", track.title, track.url, track.duration, track.thumbnail, settings(queue), loopStatus)]
    });
});

player.on('trackAdd', (queue, track) => {
    if (queue.previousTracks.length > 0)
        queue.metadata.send({
            embeds: [embed.Embed_play("Eklendi", track.title, track.url, track.duration, track.thumbnail, settings(queue))]
        });
});

player.on('channelEmpty', (queue) => {
    if (!client.config.autoLeave)
        queue.stop();
});