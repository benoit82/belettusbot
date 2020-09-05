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
    DISCORD_ID_FORMAT: /^([0-9]*)$/,
    CHANNELS: /(logChannel|eventChannel)/,
  },
  RDV_FORMAT: "JJMMAAAA HH mm",
  JOB_LIST: {
    TANK: [
      "750772954949746761", // a retirer
      "672884974210383872",
      "672886790578765846",
      "722467707420672000",
      "672885047283417090",
    ],
    HEAL: [
      "751453838766243841", // a retirer
      "672885145346375691",
      "672885175767531558",
      "672885209913491497",
    ],
    DPS: [
      "672885358823735300",
      "672885434484785162",
      "672885472955203604",
      "672885553469063176",
      "672885302507077657",
      "672886833893343293",
      "672885395163316255",
      "672885329925111808",
      "672885524025049168",
      "672885582388658236",
    ],
  },
  URL_IMG_EVENT_DEFAULT:
    "https://www.fffury.com/FF9/Images/Chocobos/Chocobos-1.png",
  DEFAULTSETTINGS: {
    prefix: "bb!",
    logChannel: "",
    eventChannel: "",
  },
};
