require("dotenv").config();

module.exports = {
  DBCONNECTION: `mongodb+srv://${process.env.MONGODB_ATLAS_USER}:${process.env.MONGODB_ATLAS_PWD}@${process.env.MONGODB_ATLAS_ADDRESS}`,
  TYPE: {
    info: { label: "info", color: "#00d921" },
    warning: { label: "warning", color: "#d5d900" },
    danger: { label: "danger", color: "#b50000" },
    default: { color: "#7a7a7a" },
  },
  CD_COMMAND_DEFAULT: 5000,
  EVENT_STATUS: {
    open: "o",
    cancel: "c",
    close: "x",
  },
  REGEX: {
    URL_IMG: /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/,
    DISCORD_ID_FORMAT: /^([0-9]*)$/,
    CHANNELS: /(logChannel|eventChannel)/,
    STRING_BETWEEN_DOUBLE_QUOTE: /(["'])(?:(?=(\\?))\2.)*?\1/,
  },
  RDV_FORMAT: "JJMMAAAA HH mm",
  LIST_ROLE: ["Tanks", "Healers", "DPS", "Flex"],
  URL_IMG_EVENT_DEFAULT:
    "https://www.fffury.com/FF9/Images/Chocobos/Chocobos-1.png",
  DEFAULTSETTINGS: {
    prefix: "bb!",
    logChannel: "",
    eventChannel: "",
  },
};
