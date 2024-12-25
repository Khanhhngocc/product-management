const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

//[GET] /admin/products
module.exports.index = async(req, res) => { 

    let find = {
        deleted: false,
    }

    //filter Status
    const filterStatus = filterStatusHelper(req.query);
    if(req.query.status){
        find.status = req.query.status;
    }

    // Search
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }

    //Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
        currentPage: 1,
        limitItem: 5
        },
        req.query,
        countProducts
    );

    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    }); 
}

//[PATCH] /admin/change-status/:status/:id
module.exports.changeStatus = async(req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    
    await Product.updateOne({_id: id}, {status: status});

    res.redirect("back");
}

//[DELETE] /admin/delete/:id
module.exports.deleteItem = async(req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({_id:id});
    await Product.updateOne({_id: id}, {
        deleted: true,
        deleteAt: new Date()
    });

    res.redirect("back");


}