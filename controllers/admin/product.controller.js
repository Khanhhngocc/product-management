const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

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

    // Sort
    let sort = {}

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc"
    }

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    }); 
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async(req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    
    await Product.updateOne({_id: id}, {status: status});

    req.flash("success", "Change status successfully!");

    res.redirect("back");
}

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async(req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({_id:id});
    await Product.updateOne({_id: id}, {
        deleted: true,
        deleteAt: new Date()
    });

    req.flash("success", "Delete product successfully!");

    res.redirect("back");
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async(req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({_id: { $in: ids }}, { status: "active"});
            req.flash("success", `Change ${ids.length} products successfully!`);
            break;

        case "inactive":
            await Product.updateMany({_id: { $in: ids}}, { status: "inactive"});
            req.flash("success", `Change ${ids.length} products successfully!`);
            break;

        case "delete-all":
            await Product.updateMany(
                {   _id: { $in: ids}}, 
                {
                    deleted: true,
                    deletedAt: new Date
                }
            );
            req.flash("success", `Delete ${ids.length} products successfully!`);
            break;

        case "change-position":
            for(const item of ids){
                let [id, position] = item.split("-");
                position = parseInt(position);

                await Product.updateOne({_id: id}, {
                    position: position
                });

                req.flash("success", `Change position of ${ids.length} products successfully!`);
            }
            break;
    
        default:
            break;
    }

    res.redirect("back");
}

//[GET] /admin/products/create
module.exports.create = async(req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm"
    });
}

module.exports.createPost = async(req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    };

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`)
};

//[GET] /admin/products/edit/:id
module.exports.edit = async(req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        });
    } catch(error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}

//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async(req, res) => {
    console.log("start")
    console.log(req.body)
    console.log(req.file);
    const id = req.params.id;
    console.log(id);
    req.body.price = parseInt(req.body.price);
    req.body.discount = parseInt(req.body.discount);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try{
        await Product.updateOne({ _id: id }, req.body);
        req.flash("success", "Edit successfully!");
    } catch(error){
        req.flash("error", "Edit error!");
        console.log(error);
    }

    res.redirect("back");
};

//[GET] /admin/products/detail/:id
module.exports.detail = async(req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find);
        
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })
    } catch(error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}