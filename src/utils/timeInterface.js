const dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
const LocalizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(LocalizedFormat);
require("dayjs/locale/fr");
dayjs.locale("fr");

module.exports = dayjs;
