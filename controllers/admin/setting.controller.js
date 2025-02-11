const SettingGeneral = require("../../models/settings-general.model");

//[GET] settings/general
module.exports.general = async(req, res) => {
    const settingGeneral = await SettingGeneral.findOne({}) // viết như này là trả ra bản ghi đầu tiên

    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    })
}

//[PATCH] settings/general
module.exports.generalPatch = async(req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    if(settingGeneral) {
        await SettingGeneral.updateOne({
            _id: settingGeneral.id
        }, req.body);
    } else {
        const record = new SettingGeneral(req.body);
        await record.save();
    }

    req.flash("success", "Cập nhật thành công!");

    res.redirect("back");
}