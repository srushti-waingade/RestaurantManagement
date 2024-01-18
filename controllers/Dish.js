const { default: mongoose } = require("mongoose");
const Dish = require("../model/Dish");
const redisClient = require("../redis")
const util = require('util');

const getAsync = util.promisify(redisClient.get).bind(redisClient);
const setAsync = util.promisify(redisClient.set).bind(redisClient);


//create
const createDish = (req, res) => {
  const dish = new Dish({ 
    dishName: req.body.dishName.toLowerCase(), 
    dishPrice: req.body.dishPrice,
    availableQuantity: req.body.availableQuantity,
    dishType: req.body.dishType,
    servesPeople: req.body.servesPeople,
  });

  dish.save( err => {
   if (err) {

    if (err.code === 11000) {
        console.log("Dish already exists");
        return res.status(412).json({message:"dish already exists" });
    } else {
      console.log(err);
      return res.json({err})
    }
  } else { 
    console.log("Dish inserted successfully");
    return res.status(200).json({message:"dish added"})
    
    }
  });
};


//get
const getDishes = async (err, res) => {

     Dish.find((err, dishes) => {
    if (err) {
      console.log(err);
    return res.send({err});
    }
    else{
      return res.json({dishes});
    }
   
  });
  
};

//get one dish
const getOneDish = async (req, res) => {

  Dish.findOne({ dishName: req.params.dishName.toLowerCase() }, (err, dish) => {
    if(!dish){
      console.log("dish doesnot exist in database");
      return res.status(412).json({message:"dish doesnot exist in database"});
    }
  if (err) {
    console.log(err);
    return res.json({err});
  }
  else{
   return res.status(200).json({dish});
  }

});

};

//update
const updateDish = (req, res) => {
  const dishname=req.body.dishName.toLowerCase();
  if (req.params.dishName.toLowerCase()==dishname){
    
    Dish.findOne({ dishName: dishname }, (err, existingDish) => {
    if (err) {
      return res.send({err});
    }
    if (!existingDish) {
      return res.status(412).json({ error: "Dish does not exist" });
    }

    const updatedQuantity = parseInt(existingDish.availableQuantity) + parseInt(req.body.availableQuantity);
    console.log(updatedQuantity);

    Dish.findOneAndUpdate(
      { dishName: dishname },
      {
        $set: {
          availableQuantity: updatedQuantity,
          dishPrice: req.body.dishPrice,
          dishType: req.body.dishType,
          servesPeople: req.body.servesPeople,
        },
      },
      { new: true },
      (err, updatedDish) => {
        if (err) {
          return res.send({err});
        }

        console.log("Dish Updated");
        return res.status(200).json({updatedDish});
      }
    );
  });
  } else{
    console.log("dishnames donot match")
    return res.status(412).json({message : "dishnames donot match"})
  }
};


//delete
const deleteDish = (req, res) => {
  const dishname= req.params.dishName.toLowerCase();
  //check if the dish exists in the database
  Dish.findOne({ dishName: dishname }, (err, existingDish) => {
    if (err) {
      return res.send({err});
    }
    if (!existingDish) {
      return res.status(412).json({ error: "Dish does not exist" });
    }
    else{
  Dish.deleteOne({ dishName: dishname })
    .then(() => {
      console.log("Dish Deleted");
      res.status(200).json({ message: "Dish Deleted" });
    })
    .catch((err) => res.status(412).json({err}));
    }
})
};


//purchase
const purchaseDishes =  async (req, res,) =>{

  let totalAmount = 0;
  var bar = new Promise(  async (resolve, reject) => {
    for(const dish of req.body.item){
      const dishname=dish.dish.toLowerCase();
      await Dish.findOne({dishName:dishname}).then((existingdish)=>{
        if(!existingdish){
          return res.status(412).json({message:"dish doesnot exist in db"})
        }else{
          if(dish.qty<1){
            console.log("quantity should be atleast one for purchase");
            return reject({message:"quantity should be atleast one for purchase"});
          }
          else if(existingdish.availableQuantity<dish.qty){
            console.log("enough quanity not available");
            return reject({message:"enough quantity not available"});
          }
          else{
            let dishprice = parseInt((dish.qty)*(existingdish.dishPrice));
            totalAmount += dishprice;
          }

        }
      console.log({totalAmount});
      }).catch((err)=>{
       
        return  reject({err})
        });
    }
    return resolve();
});

bar.then(async () => {
  console.log("RUNNING");

  if(totalAmount>req.body.givenAmount){
    return res.status(412).json({message:"Insuffcient balance, please pay: "+totalAmount});
  }
  
  if(totalAmount==req.body.givenAmount){

    for(const dish of req.body.item){

      const dishname=dish.dish.toLowerCase();
      const nDish = await Dish.findOne({dishName: dishname}).exec();
      let newQty = parseInt(nDish.availableQuantity)-parseInt(dish.qty);
      await Dish.findOneAndUpdate({dishName:dishname},{availableQuantity:newQty});
    }

    const totalAmountCollected = await redisClient.get('totalAmountCollected');

    // If totalAmountCollected is null or undefined, set it to 0
    const currentTotal = totalAmountCollected ? parseFloat(totalAmountCollected) : 0;
    await redisClient.set('totalAmountCollected', (currentTotal + totalAmount));

    return res.status(200).json({message:"No change to be given"});
  }
  
  if(totalAmount<req.body.givenAmount){
    for(const dish of req.body.item){
      const dishname=dish.dish.toLowerCase();
     const nDish = await Dish.findOne({dishName: dishname}).exec();
    
     let newQty = nDish.availableQuantity;
     console.log(dish.qty)
     console.log(newQty)
     let finalQty  = newQty-dish.qty
     await Dish.findOneAndUpdate({dishName:dishname},{availableQuantity:finalQty},{new:true}).catch((err)=>console.log(err)).then((e)=>{
      console.log(e)
     });
    }
    const totalAmountCollected = await redisClient.get('totalAmountCollected');
    const currentTotal = totalAmountCollected ? parseFloat(totalAmountCollected) : 0;
    await redisClient.set('totalAmountCollected', (currentTotal + totalAmount));

    const change=req.body.givenAmount-totalAmount;
    return res.status(200).send({message:"change to be given :"+change})
  }
 
  }).catch((err)=>{
  return res.status(412);
  });

}


module.exports = {
  getDishes,
  getOneDish,
  createDish,
  updateDish,
  deleteDish,
  purchaseDishes,
};
