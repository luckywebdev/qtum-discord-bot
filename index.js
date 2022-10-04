const {
    Client,
    GatewayIntentBits,
    Partials,
    PermissionsBitField
} = require('discord.js');
const { isAddress, isQtumAddress, getHexAddressFromQtum } = require('./utils/web3Helper')
const { checkRegisteredUser, registerUser } = require('./utils/dbConnection')
const dotenv = require("dotenv");
dotenv.config();

const channelId = process.env.CHANNEL_ID

const bot = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

bot.on('ready', () => {
    console.log(`Bot ${bot.user.tag} is logged in!`);
});

bot.login(process.env.DISCORD_BOT_TOKEN);

// bot.on('guildMemberAdd', (member) => {
//     const channelId = '1019915261169631343'; // The Channel ID you just copied
//     const welcomeMessage = `Hey <@${member.id}>! Welcome to my server!\nPlease put your wallet address.`;
//     member.guild.channels.fetch(channelId).then(channel => {
//         channel.send(welcomeMessage);
//         channel.permissionOverwrites.set([{
//             id: member.id,
//             allow: [PermissionsBitField.Flags.SendMessages]
//         }])
//     });
// });

bot.on('messageCreate', (message) => {
    if (message.channelId !== channelId) return;
    console.log('[message check]', message)
    if (message.author.bot) {
		return;
	}
    message.fetch()
    .then(async (fullmessage) => {
        try {
            if (fullmessage.content === '') {
                return;
            }
            console.log('[address check]', isAddress(fullmessage.content))
            let userAddress = fullmessage.content;
            if (isQtumAddress(userAddress)) {
                    userAddress = getHexAddressFromQtum(userAddress)
            }
            if (!!isAddress(userAddress)) {
                const rawdata = await checkRegisteredUser(userAddress)
                if (rawdata && rawdata.length > 0) {
                    console.log('[old user]')
                    // const role = fullmessage.guild.roles.cache.get(memberRoleId)
                    // const member = fullmessage.guild.members.cache.find((m) => m.id === fullmessage.author.id)
                    // member.roles.add(role);
                    const oldRegistered = 'You are joined on game already.\nPlease enjoy your game!'
                    fullmessage.guild.channels.cache.forEach((channel) => {
                        if (channel.id === channelId) {
                            channel.send(oldRegistered);
                        }
                        // channel.permissionOverwrites.set([{
                        //     id: fullmessage.author.id,
                        //     allow: [PermissionsBitField.Flags.SendMessages]
                        // }])
                    })
                    return;
                } else {
                    console.log('[new user]')
                    const newRow = await registerUser({name: fullmessage.author.username, address: userAddress})
                    if (newRow && newRow.length > 0) {
                        // const role = fullmessage.guild.roles.cache.get(memberRoleId)
                        // const member = fullmessage.guild.members.cache.find((m) => m.id === fullmessage.author.id)
                        // member.roles.add(role);
                        const newRegister = 'Thanks for entering address.\nPlease enjoy your game!'
                        fullmessage.guild.channels.cache.forEach((channel) => {
                            if (channel.id === channelId) {
                                channel.send(newRegister);
                            }
                                // channel.permissionOverwrites.set([{
                            //     id: fullmessage.author.id,
                            //     allow: [PermissionsBitField.Flags.SendMessages]
                            // }])
                        })
                        return;
                    }
                }
            }
        } catch (err) {
            console.log('[channel error]', err)
            // fullmessage.channel.send(`Please put your wallet address.`)
            return;
        }
    })
    .catch(err=> {
        console.log('Something went wrong when fetching the message: ', err);
    })
});

//397284698176