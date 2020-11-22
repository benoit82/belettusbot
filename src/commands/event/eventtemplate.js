const { MESSAGES } = require('../../utils/constants')
const { REGEX } = require('../../config')
const { MessageCollector } = require('discord.js')

module.exports.run = async (client, message, args) => {
  const manegeTemplate = async function (settings, action, lang) {
    const name = args[1]
    const title = settings.split(/"/gi)[1]
    const description = settings.split(/"/gi)[3] || ''
    const image = args.find(url => url.match(REGEX.URL_IMG)) || ''
    if (!name || !title) {
      return message.reply(
        'Il faut respecter la syntaxe de la commande.\nVérifies si le nom du pattern est en un seul mot et si le titre est bien entre 2 doubles quotes `""`.\nL\'URL de l\'illustration est optionnel.'
      )
    } else {
      const tmplFromDB = await client.getTemplateByName(name, message.guild.id)
      if (action === 'create' && tmplFromDB !== null) {
        return message.reply(
          'Un modèle porte déjà ce nom, consultes la liste avec la commande `list`, puis recommances.'
        )
      }
      if (action === 'update' && tmplFromDB === null) {
        return message.reply("Erreur : aucun modèle n'a ce nom.")
      }
      message.reply(
        `Résumons les informations ensemble :
            nom du modèle : ${name}
            Titre évènement : ${title}
            Description : ${description}
            URL de l'illustration : ${image}
            Réponds \`oui\` pour valider, ou réponds par autre chose pour annuler. (30 secondes d'attente avant annulation de la commande)`
      )
      const msgCollector = new MessageCollector(
        message.channel,
        m => m.author.id === message.author.id,
        { max: 1, time: 30000 }
      )
      msgCollector.on('collect', async usermsg => {
        if (
          usermsg.content
            .trim()
            .toLowerCase()
            .startsWith('oui')
        ) {
          const newTmpl = {
            name,
            title,
            image,
            description,
            creator: message.author.id,
            guildID: message.guild.id
          }
          switch (action) {
            case 'create':
              await client.createTemplate(
                newTmpl,
                message.channel,
                message.guild.id
              )
              break
            case 'update':
              await client.updateTemplate(tmplFromDB, newTmpl)
              message.reply('Modèle mis à jour !')
              break
            default:
              break
          }
        }
        msgCollector.stop()
      })

      msgCollector.on('end', (collected, reason) => {
        if (reason === 'time') {
          return message.reply(
            'Le temps de réponse est écoulé. Commande stoppée.'
          )
        }
      })
    }
  }
  const displayList = async function (lang) {
    const templates = await client.getTemplates(message.guild.id, lang)
    if (templates.length === 0) {
      message.reply("il n'y a aucun modèle actuellement")
    } else {
      message.reply("la liste des modèles d'évènements :")
      templates.sort((t1, t2) => (t1.name > t2.name ? 1 : -1))
      templates.forEach(tmpl => {
        message.channel.send(`\`${tmpl.name}\` : ${tmpl.title}`)
      })
    }
  }

  if (args[0]) {
    const settings = args.slice(1).join(' ')
    switch (args[0]) {
      case 'create':
        manegeTemplate(settings, args[0])
        break
      case 'update':
        manegeTemplate(settings, args[0])
        break
      case 'delete':
        if (args[1]) {
          const templToDelete = await client.getTemplateByName(
            args[1],
            message.guild.id
          )
          if (
            templToDelete !== null &&
            templToDelete.creator === message.author.id
          ) {
            await client.deleteTemplate(args[1], 'fr')
            message.reply('modèle supprimé')
          } else {
            message.reply("tu n'es pas l'auteur du modèle")
          }
        } else {
          message.reply('Argument de commande manquante.')
        }
        break
      case 'list':
        displayList('fr')
        break
      default:
        return message.reply('Commande non reconnu.')
    }
  }
}

module.exports.help = MESSAGES.COMMANDS.EVENT.EVENTTEMPLATE
