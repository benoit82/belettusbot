const { MessageEmbed } = require('discord.js')
const { MESSAGES } = require('../../utils/constants')
const { TYPE, CD_COMMAND_DEFAULT } = require('../../config')
const { readdirSync } = require('fs')
const categoryList = readdirSync('src/commands')

module.exports.run = (client, message, args) => {
  const guildConfig = client.guildsConfig.get(message.guild.id)
  if (!args.length) {
    const embed = new MessageEmbed().setColor(TYPE.default.color).addField(
      'Liste des commandes',
      `Une liste de toutes les sous-catégories disponibles et leurs commandes.
Pour plus d'informations sur une commande, tapes \`${guildConfig.prefix}help <command_name>\``
    )

    for (const category of categoryList) {
      embed.addField(
        category.toUpperCase(),
        client.commands
          .filter((cat) => cat.help.category === category)
          .map((cmd) => cmd.help.name)
          .join(', ')
      )
    }

    return message.channel.send(embed)
  } else {
    const command =
      client.commands.get(args[0]) ||
      client.commands.find(
        (cmd) => cmd.help.aliases && cmd.help.aliases.includes(args[0])
      )
    const cd = command.help.cooldown || CD_COMMAND_DEFAULT

    let usage = ''
    if (command.help.usage) {
      command.help.usage.forEach((u) => {
        usage += `${guildConfig.prefix + command.help.name} ${u}\n`
      })
    } else {
      usage = guildConfig.prefix + command.help.name
    }

    const embed = new MessageEmbed()
      .setColor(TYPE.default.color)
      .setTitle(`\`${command.help.name}\``)
      .addField(
        'Description',
        `${command.help.description} (cd: ${cd / 1000} secs)`
      )
      .addField('Utilisation', usage, true)

    if (command.help.aliases.length > 1) { embed.addField('Alias', command.help.aliases.join(', '), true) }

    return message.channel.send(embed)
  }
}

module.exports.help = MESSAGES.COMMANDS.MISC.HELP
