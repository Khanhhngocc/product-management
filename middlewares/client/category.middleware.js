const ProductsCategory = require("../../models/product-category.model");

const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async(req, res, next) => {
    let find = {
        deleted: false
    }

    const productsCategory = await ProductsCategory.find(find);

    const newProductsCategory = createTreeHelper.tree(productsCategory);

    res.locals.layoutProductsCategory = newProductsCategory;

    next();
}