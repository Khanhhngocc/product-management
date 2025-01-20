const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async(parentId) => {
    const getCategory = async(parentId) => {
        const subs = await ProductCategory.find({
            deleted: false,
            status: "active",
            parent_id: parentId
        });

        let allSub = [...subs];

        for (const sub of subs) {
            const child = await getCategory(sub.id);
            allSub = allSub.concat(child);
        }

        return allSub;
    }
    const result = await getCategory(parentId);
    return result;
}