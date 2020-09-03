require("dotenv").config();

module.exports = {
  DBCONNECTION: `mongodb+srv://${process.env.MONGODB_ATLAS_USER}:${process.env.MONGODB_ATLAS_PWD}@bbotdb.xhqrs.mongodb.net/belettusDB`,
  TYPE: {
    info: { label: "info", color: "#00d921" },
    warning: { label: "warning", color: "#d5d900" },
    danger: { label: "danger", color: "#b50000" },
    default: { color: "#7a7a7a" },
  },
  CD_COMMAND_DEFAULT: 5_000,
  EVENT_STATUS: {
    open: "o",
    cancel: "c",
    close: "x",
  },
  REGEX: {
    URL_IMG: /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/,
    MESSAGE_ID: /^([0-9]*)$/,
    CHANNELS: /(logChannel|eventChannel)/,
  },
  JOB_EMOJI: {
    TANK: {
      DRK: "<:DRK:672884974210383872>",
      GNB: "<:GNB:672886790578765846>",
      PLD: "<:PLD:722467707420672000>",
      WAR: "<:WAR:672885047283417090>",
    },
    HEAL: {
      AST: "<:AST:672885145346375691>",
      SCH: "<:SCH:672885175767531558>",
      WHM: "<:WHM:672885209913491497>",
    },
    DPS_CAC: {
      DRG: "<:DRG:672885358823735300>",
      MNK: "<:MNK:672885434484785162>",
      NIN: "<:NIN:672885472955203604>",
      SAM: "<:SAM:672885553469063176>",
    },
    DPS_DIS: {
      BRD: "<:BRD:672885302507077657>",
      DNC: "<:DNC:672886833893343293>",
      MCH: "<:MCH:672885395163316255>",
    },
    DPS_MAG: {
      BLM: "<:BLM:672885329925111808>",
      RDM: "<:RDM:672885524025049168>",
      SMN: "<:SMN:672885582388658236>",
    },
    MISC: {
      FLEX: "<:dorito:674945986921234452>",
      FSH: "<:pecheur:672885691436236810>",
    },
  },
  URL_IMG_EVENT_DEFAULT:
    "https://www.fffury.com/FF9/Images/Chocobos/Chocobos-1.png",
  DEFAULTSETTINGS: {
    prefix: "bb!",
    logChannel: "",
    eventChannel: "",
  },
};
