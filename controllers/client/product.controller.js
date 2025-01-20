const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/product");

//[GET] /products
module.exports.index = async(req, res) => {
    const find = {
        deleted: false, 
        status: "active"
    }

    const products = await Product.find(find).sort({position: "desc"});

    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    })

}

//[GEt] /products/:slug
module.exports.detail = async(req, res) => {
    try {
        const find = {
            deleted: false,
            status: "active",
            slug: req.params.slug
        }
    
        const product = await Product.findOne(find);
    
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch(error){
        res.redirect(`/products`);
    }
}