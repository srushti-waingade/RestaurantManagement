
const router = require("express").Router();
const { authenticateToken, generateAccessToken } = require("./auth");


const {getDishes,getOneDish, createDish , updateDish, deleteDish ,purchaseDishes, getPurchaseTotalAmount } = require("./controllers/Dish");


router.get("/", (req, res) => {res.send("Let's build a Restaurant Management System");});
router.get("/dishes",authenticateToken, getDishes);
router.get("/dishes/:dishName",authenticateToken, getOneDish);
router.post("/login", generateAccessToken);
router.post("/dishes", authenticateToken,createDish);
router.post('/purchase', authenticateToken,purchaseDishes);
router.put("/dishes/:dishName",authenticateToken, updateDish);
router.delete("/dishes/:dishName",authenticateToken, deleteDish);


    



module.exports = router;
