module.exports = {
  DBCONNECTION: `mongodb+srv://belettusbot:BV6kEVYSnAHGeCkj@bbotdb.xhqrs.mongodb.net/belettusDB`,
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
  LIST_ROLE: ["Tanks", "Healers", "DPS", "Flex"],
  URL_IMG_EVENT_DEFAULT:
    "https://www.fffury.com/FF9/Images/Chocobos/Chocobos-1.png",
  DEFAULTSETTINGS: {
    prefix: "bb!",
    logChannel: "",
    eventChannel: "",
  },
  CREATOR_ID: "71723455359229952",
  DISCORD_BOT_CLIENT_ID: "748585400083152966",
  DISCORD_BOT_TOKEN:
    "NzQ4NTg1NDAwMDgzMTUyOTY2.X0fkew.4XTA7HZ6Zv1hdOmH04-BT3Ylb-U",
};
