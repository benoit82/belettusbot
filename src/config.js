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
  URL_IMG_EVENT_DEFAULT:
    "https://www.fffury.com/FF9/Images/Chocobos/Chocobos-1.png",
  DEFAULTSETTINGS: {
    prefix: "bb!",
    logChannel: "",
    eventChannel: "",
  },
};
