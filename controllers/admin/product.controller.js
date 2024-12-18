const Product = require("../../models/product.model");

//[GET] /admin/products
module.exports.index = async(req, res) => {
    const find = {
        deleted: false
    }
    const products = await Product.find(find);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products
    })
}