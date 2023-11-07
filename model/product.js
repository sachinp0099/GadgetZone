let { Product } = require('../schema/product_schema')

let joi = require('joi')
async function create(params) {
    let valid = await check(params).catch((err) => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let productData = {
        name: params.productName,
        price: params.productPrice,
        description: params.desc
    }
    let data = await Product.create(productData).catch((err) => {
        return { error: err }
    })
    if (!data || (data && data.error)) {
        return { error: 'internal server error' }
    }
    return { data: data }
}

async function check(data) {
    let schema = joi.object({
        productName: joi.string().required(),
        productPrice: joi.number().required(),
        desc: joi.string().required()
    })
    let valid = await schema.validateAsync(data).catch((err) => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

async function viewAll(params,permissions) {

    let limit = (params.limit) ? parseInt(params.limit) : 5;
    let page = (params.page) ? parseInt (params.page ): 1;
    let offset = (page - 1) * limit;

    let where = {}
    if(!permissions.product_restore){
        where = {is_deleted:false}
    }

    let counter = await Product.count({where}).catch((err) => {
        return { error: err }
    })
    console.log("count", counter)
    if (!counter || (counter && counter.error)) {
        return { error: 'internal server error' }
    }
    if (counter <= 0) {
        return { error: 'product not found' }
    }

    let data = await Product.findAll({ limit, offset,raw:true,where }).catch((err) => {
        return { error: err }
    })
    if (!data || (data & data.error)) {
        return { error: 'internal server error', status: 500 }
    }
    return { data: data, total: counter, page:page, limit:limit }
}

async function viewdetails(id){
    let data = await Product.findOne({where:{id}}).catch((err)=>{
        return {error:err}
    })
    if(!data || (data && data.error)){
        return {error:"INTERNAL SERVER ERROR",status : 500}
    }
    return {data};
}

async function checkUpdate(data){
    let schema = joi.object({
        id:joi.number().required(),
        productName:joi.string(),
        productPrice:joi.string(),
        desc:joi.string()
    })

    let valid = await schema.validateAsync(data).catch((err)=>{
        return {error:err}
    })

    if(!valid || (valid && valid.error)){
        let msg = []
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error:msg}
    }
    return {data:valid}
}

async function update(id,params){
    params.id = id;

    let valid = await checkUpdate(params).catch((err)=>{
        return {error:err}
    })
    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }

    let data = await Product.findOne({where:{id},raw:true}).catch((err)=>{
        return {error:err}
    })
    if(!data || (data && data.error)){
        return {error: "internal server error1"}
    }

    data.name = params.productName,
    data.price = params.productPrice,
    data.description = params.desc;

    let updateProduct = await Product.update(data,{where:{id}}).catch((err)=>{
        return {error:err}
    })
    if(!updateProduct || (updateProduct && updateProduct.error)){
        return {error: "internal server error2"}
    }
    return {data:data}
}

async function checkDelete(data){
    let schema = joi.object({
        id:joi.number().required()
    })
    let valid = await schema.validateAsync(data).catch((err)=>{
        return {error:err}
    })
    if(!valid || (valid && valid.error)){
        let msg = []
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error:msg}
    }
    return {data:valid}
}

async function pDelete(id){
    //user data validation

    let valid = await checkDelete({id}).catch((err)=>{
        return {error:err}
    })
    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }

    //check if product exist
    let data = await Product.findOne({where:{id},raw:true}).catch((err)=>{
        return {error:err}
    })
    if(!data || (data && data.error)){
        return {error:"Internal server error"}
    }

    //check if product is already deleted
    if(data.is_deleted == true){
        return {error:"Product is already deleted"}
    }

    //update product table
    let updateProduct = await Product.update({is_deleted:true},{where:{id}}).catch((err)=>{
        return {error:err}
    })
    if(!updateProduct || (updateProduct && updateProduct.error)){
        return {error:"Internal server error"}
    }
    if(updateProduct <= 0){
        return {error:"record not deleted"}
    }
    //return data
    return {data:"record successfully deleted"}
}



module.exports = { create, viewAll,viewdetails,update, pDelete }