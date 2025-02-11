const mongoose = require("mongoose");

const settingGeneralModel = new mongoose.Schema(
    {
        websiteName: String,
        logo: String,
        phone: String,
        email: String, 
        address: String,
        copyright: String,
        map: String
    }, 
    {timestamps: true}
);

const SettingGeneral = mongoose.model("SettingGeneral", settingGeneralModel, "settings-general");

module.exports = SettingGeneral;