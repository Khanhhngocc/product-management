const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/product");

//[GET] /products
module.exports.index = async(req, res) => {

    //Lấy ra danh sách sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    })
    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

    
    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
    })
}