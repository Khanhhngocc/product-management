const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helpers/product");
const productsCategoryHelper = require("../../helpers/products-category");

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
};

//[GET] /products/:slugCategory
module.exports.category = async(req, res) => {
    try {
        const category = await ProductCategory.findOne({
            slug: req.params.slugCategory,
            status: "active",
            deleted: false
        });

        const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);

        const listSubCategoryId = listSubCategory.map(item => item.id);

        const products = await Product.find({
            product_category_id: { $in: [category.id, ...listSubCategoryId] },
            deleted: false,
            status: "active"
        }).sort({ position: "desc"});

        const newProducts = productsHelper.priceNewProducts(products);

        res.render("client/pages/products/index", {
            pageTitle: category.title,
            products: newProducts
        });    
        
    } catch (error) {
        res.send("404")
    }
}