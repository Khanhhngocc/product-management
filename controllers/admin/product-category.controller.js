const ProductCategory = require("../../models/product-category.model");

const systemConfig = require("../../config/system");

//[GET] /admin/products-category
module.exports.index = async(req, res) => {
    let find = {
        deleted: false,
    }

    const records = await ProductCategory.find(find);

    res.render("admin/pages/products-category/index.pug", {
        pageTitle: "Danh mục sản phẩm",
        records: records
    });
};

//[GET] /admin/products-category/create
module.exports.create = (req, res) => {
    res.render("admin/pages/products-category/create.pug", {
        pageTitle: "",
    });
};

//[POST] /admin/products-category/create
module.exports.createPost = async(req, res) => {
    if(req.body.position == ""){
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    };

    const records = new ProductCategory(req.body);
    await records.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};