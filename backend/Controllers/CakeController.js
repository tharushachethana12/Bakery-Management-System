const Cake = require('../Model/CakeModel');



const getAllCakes = async(request,response,next) => {
    let Cakes;

    try{
        Cakes = await Cake.find();
    }catch(err){
        console.log(err);
    }

    if(!Users){
        return response.status(404).json({message:"Item not found"})
    }

    return response.status(200).json({ Cake });
};


exports.getAllCakes = getAllCakes;