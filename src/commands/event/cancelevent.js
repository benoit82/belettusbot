const { MESSAGES } = require('../../utils/constants')
const { embedCreateFromEvent } = require('../../utils/functions')
const timeInterface = require('../../utils/timeInterface')

module.exports.run = async (client, message, args) => {
  const { channels } = client
  const guildConfig = client.guildsConfig.get(message.guild.id)
  const helpCmd = `
  Pour plus d'information sur la commande, tapes la commande \`${guildConfig.prefix}help ${this.help.name}\``
  if (!args[0].match(client.config.REGEX.DISCORD_ID_FORMAT)) { return message.reply(`L'ID est mal saisie.${helpCmd}`) }
  let eventTarget = await client.getEvent({ messageID: args[0] })
  if (eventTarget) {
    // check if the user is the author or an admin or bot creator
    if (message.member.id !== eventTarget.creator) {
      return message.reply("Tu n'as pas les droits pour modifier cet évent.")
    }

    eventTarget = await client.updateEvent(eventTarget, {
      status: client.config.EVENT_STATUS.cancel
    })
    const evtChannel = await channels.fetch(guildConfig.eventChannel)
    const originalMsg = await evtChannel.messages.fetch(eventTarget.messageID)
    const embed = embedCreateFromEvent(client, originalMsg, eventTarget)
    originalMsg.edit(embed)
    if (originalMsg.pinned) originalMsg.unpin()
    message.reply(`Evènement \`${eventTarget.messageID}\` annulé.`)
    // warn all players registered => event is now canceled
    let { players } = eventTarget
    if (players.length > 0) {
      players = players.filter((player) => player.id !== message.author.id)
      if (players.length > 0) {
        message.channel.send(
          'Je préviens les autres inscrits de son annulation.😗'
        )
        players.forEach((player) => {
          client.users.cache
            .get(player.id)
            .send(
              `L'évènement **${
                eventTarget.title
              }** prévu pour le **${timeInterface(eventTarget.rdv).format(
                'LLLL'
              )}**, vient d'être annulé par <@${message.author.id}>.`
            )
        })
      }
    }
  } else {
    return message.reply(`ID invalide.${helpCmd}`)
  }
}

module.exports.help = MESSAGES.COMMANDS.EVENT.CANCELEVENT
