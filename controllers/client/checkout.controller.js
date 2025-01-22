const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productsHelper = require("../../helpers/product");

//[GET] /checkout
module.exports.index = async(req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    for(const item of cart.products) {
        const productInfo = await Product.findOne({
            _id: item.product_id
        })

        productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

        item.productInfo = productInfo;

        item.totalPrice = item.quantity * productInfo.priceNew;
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    });
};

//[POST] /checkout/order
module.exports.order = async(req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const cart = await Cart.findOne({
        _id: cartId
    })

    let products = []

    for(const product of cart.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        });

        const objectProduct = {
            product_id: product.product_id,
            price: productInfo.price,
            discountPercentage: productInfo.discountPercentage,
            quantity: product.quantity
        }

        products.push(objectProduct);

        const productRemain = productInfo.stock - product.quantity;
        await Product.updateOne({_id: product.product_id}, {stock: productRemain});
    };

    const objectOrder = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    }

    const order = new Order(objectOrder);
    await order.save();

    await Cart.updateOne({_id: cartId}, {products: []});

    res.redirect(`/checkout/success/${order.id}`);
};

//[GET] /checkout/success/:orderId
module.exports.success = async(req, res) => {
    const order = await Order.findOne({
        _id: req.params.orderId
    });

    for(const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail");

        product.productInfo = productInfo;

        product.priceNew = productsHelper.priceNewProduct(product);

        product.totalPrice = product.priceNew * product.quantity;
    }

    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order: order
    })
}