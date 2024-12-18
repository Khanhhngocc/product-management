const Product = require("../../models/product.model");

//[GET] /products
module.exports.index = async(req, res) => {
    const find = {
        deleted: false, 
        status: "active"
    }

    const products = await Product.find(find);

    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
        return item;
    });

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    })

}