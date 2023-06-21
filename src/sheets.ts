import { Config } from "./config";

export function initConfig() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("config");
  if (sheet === null) {
    return null;
  }
  const values = sheet.getDataRange().getValues();

  const config: Config = {
    typetalkToken: values[0][1],
    typetalkUrl: values[1][1],
  };
  return config;
}
