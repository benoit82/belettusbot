const { readdirSync } = require('fs')

const loadCommands = (client, dir = 'src/commands') => {
  readdirSync(dir).forEach(fold => {
    const commands = readdirSync(`${dir}/${fold}`).filter(file =>
      file.endsWith('.js')
    )

    for (const file of commands) {
      const getFileName = require(`../commands/${fold}/${file}`)
      client.commands.set(getFileName.help.name, getFileName)
      console.log(`Commande chargée : ${getFileName.help.name}`)
    }
  })
}

const loadEvents = (client, dir = 'src/events') => {
  readdirSync(dir).forEach(fold => {
    const events = readdirSync(`${dir}/${fold}`).filter(file =>
      file.endsWith('.js')
    )

    for (const event of events) {
      const evt = require(`../events/${fold}/${event}`)
      const evtName = event.split('.')[0]
      client.on(evtName, evt.bind(null, client))
      console.log(`Evenement chargé : ${evtName}`)
    }
  })
}

const loadMongoose = async client => {
  client.mongoose = require('./mongoose')
  client.mongoose.init()
}

const loadGuildsInfo = async client => {
  require('./functionsDB')(client)
  client.setGuildsConfig()
}

module.exports = {
  loadCommands,
  loadEvents,
  loadMongoose,
  loadGuildsInfo
}
