let productModel = require('../model/product')

async function addUI(req, res) {
    return res.render('product/add',{});
}

async function createProduct(req, res) {
    let modelData = await productModel.create(req.body).catch((err) => {
        return { error: err }
    })
    console.log("data",modelData);
    if (!modelData || (modelData && modelData.error)) {
        let error = (modelData && modelData.error) ? modelData.error : 'internal server error'
        return res.render({ error })
    }
    return res.redirect("/product")
}


// async function registerLogin(req, res) {
//     return res.render('reglog', {});
// }

async function viewAll(req,res){
    let product = await productModel.viewAll(req.query,req.userData.permissions).catch((err)=>{
        return {error:err}
    })
    if(!product || (product && product.error)){
        return res.render('product/view',{error:product.error})
    }
    return res.render('product/view',{product : product.data, total : product.total, page : product.page, limit : product.limit, permissions : req.userData.permissions})
}

async function viewDetails(req,res){
    let product = await productModel.viewdetails(req.params.id).catch((err)=>{
        return {error:err}
    })
    console.log("product",product);
    if(!product || (product && product.error)){
        return res.render("product/view",{error:product.error})
    }
    return res.render("product/details",{product: product.data})

}

async function updateUI(req,res){
    let product = await productModel.viewdetails(req.params.id).catch((err)=>{
        return {error:err}
    })
    if(!product || (product && product.error)){
        let url = (product && product.data && product.data.id) ? '/product/'+product.data.id:'/product';
        return res.redirect(url)
    }
    return res.render('product/update',{product:product.data})
}

async function update(req,res){
    let product = await productModel.update(req.params.id,req.body).catch((err)=>{
        return {error:err}
    })
    if(!product || (product && product.error)){
        let url = (product && product.data && product.data.id) ? '/product/'+product.data.id:'/product';
        return res.redirect(url)
    }
    let url = (product && product.data && product.data.id) ? '/product/'+product.data.id:'/product';
    return res.redirect(url)
}

async function productDelete(req,res){
    let product = await productModel.pDelete(req.params.id).catch((err)=>{
        return {error:err}
    })
    console.log('product',product);
    if(!product || (product && product.error)){
        let url = (req.params && req.params.id) ? '/product/'+req.params.id:'/product';
        return res.redirect(url)
    }
    return res.redirect('/product')
}



module.exports={createProduct,viewAll,viewDetails,addUI,updateUI,update,productDelete}















// module.exports = { createProduct, registerLogin, viewAll }