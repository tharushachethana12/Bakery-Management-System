const User = require("../Model/UserModel");

//data display

const getAllUsers = async (req, res, next)=> {
    let Users;

    //get all users
    try{
        Users = await User.find();
    }catch (err) {
        console.log(err);
    }

    //not found
    if(!Users){
        return res.status(404).json({message: "User not found"});
    }
    //display all users
    return res.status(200).json({Users});
};

const addUsers = async (req, res, next) => {
    const{name, email, password} = req.body;
    let users;

    try{
        const newUser = new User(req.body); 
        await newUser.save();
        res.status(200).json(newUser);
    }catch (err){
        console.error(err);
        res.status(500).send('Server Error');
    }
    
    if(!users){
        return res.status(404).send({message:"unable to add users"});
    }
    return res.status(404).json({users});

};

const getById = async(req,res, next)=>{
    const id = req.params.id;

    let users;

    try{
        users = await User.findById(id);
    }catch (err){
        console.log(err);
    }
    
    if(!users){
        return res.status(404).send({message:"unable to add users"});
    }
    return res.status(200).json({users});

};


const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { name, email, password} = req.body;

    let users;

    try {
        users = await User.findByIdAndUpdate(id,
            { name: name, email: email, password: password });
            users = await users.save();
    } catch (err) {
        console.log(err);
    }

    if (!users) {
        return res.status(404).json({ message: "Unable to update user" });
    }

    return res.status(200).json({users});
};



const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    let Users;

    try {
        Users = await User.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }

    if (!Users) {
        return res.status(404).json({ message: "Unable to delete user" });
    }

    return res.status(200).json({Users});
};




exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById; 
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;


