const request=require( "supertest");
const app =require("../app.js")
const bearerToken ="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTcwNTU1MDY1MCwiZXhwIjoxNzA1NTY1MDUwfQ.Z0OPaEROmnhsJVzdeGlXqEWMIyPaWo5VuB9TtHPzXYE"

describe("post /dishes", ()=>{
    it('should return 200 when dish is added', async() => {
        const response = await request(app).post("/dishes").send({"dishName": "pizza",
        "dishPrice": 250,
        "availableQuantity": 300,
        "dishType": "maincourse",
        "servesPeople": 2}).set("Authorization",bearerToken)
        expect(response.statusCode).toBe(200);
    })
});

describe("get /dishes/dishName", ()=>{
    it('should return 200 when get dish', async() => {
        const response = await request(app).get("/dishes/pizza").set("Authorization",bearerToken);
        expect(response.statusCode).toBe(200);
    })
});

describe("get /dishes/dishName", ()=>{
    it('should return 412 when dish doesnot exist', async() => {
        const response = await request(app).get("/dishes/pizzas").set("Authorization",bearerToken);
        expect(response.statusCode).toBe(412);
    })
});

describe("get /dishes", ()=>{
    it('should return 200 when dish is fetched', async() => {
        const response = await request(app).get("/dishes").set("Authorization", bearerToken);
        expect(response.statusCode).toBe(200);
    })
});

describe("put /dishes", ()=>{
    it('should return 200 when dish is updated', async() => {
        const response = await request(app).put("/dishes/pizza").send({"dishName": "pizza",
        "dishPrice": 250,
        "availableQuantity": 50,
        "dishType": "maincourse",
        "servesPeople": 2}).set("Authorization",bearerToken);
        expect(response.statusCode).toBe(200);
    })
});

describe("put /dishes", ()=>{
    it('should return 200 when dish is updated', async() => {
        const response = await request(app).put("/dishes/pizza").send({"dishName": "pi",
        "dishPrice": 250,
        "availableQuantity": 50,
        "dishType": "maincourse",
        "servesPeople": 2}).set("Authorization",bearerToken);
        expect(response.statusCode).toBe(412);
    })
});

describe("put /dishes", ()=>{
    it('should return 200 when dish is updated', async() => {
        const response = await request(app).put("/dishes/pizza").send({"dishName": "pi",
        "dishPrice": 250,
        "availableQuantity": 50,
        "dishType": "maincourse",
        "servesPeople": 2}).set("Authorization",bearerToken)
        expect(response.statusCode).toBe(412);
    })
});

describe("delete /dishes", ()=>{
    it('should return 200 when dish is deleted', async() => {
        const response = await request(app).delete("/dishes/pizza").set("Authorization",bearerToken);
        expect(response.statusCode).toBe(200);
    })
});

describe("delete /dishes", ()=>{
    it('should return 412 when dish is not deleted', async() => {
        const response = await request(app).delete("/dishes/pizzasss").set("Authorization",bearerToken);
        expect(response.statusCode).toBe(412);
    })
});

describe("post /purchase", ()=>{
    it('should return 200 when dishes are purchased', async() => {
        const response = await request(app).post("/purchase").send({
            "givenAmount": 1500,
             "item":
                [
                 {"dish": "rice", "qty": 1},
                 {"dish": "ButtER cHicken", "qty": 1}
                ]
        }).set("Authorization",bearerToken);
        expect(response.statusCode).toBe(200);
    })
});

describe("post /purchase", ()=>{
    it('should return 200 when dishes are purchased', async() => {
        const response = await request(app).post("/purchase").send({
            "givenAmount": 500,
             "item":
                [
                 {"dish": "rice", "qty": 1},
                 {"dish": "ButtER cHicken", "qty": 1}
                ]
        }).set("Authorization",bearerToken);
        expect(response.statusCode).toBe(200);
    })
});

describe("post /purchase", ()=>{
    it('should return 412 when dishes are purchased', async() => {
        const response = await request(app).post("/purchase").send({
            "givenAmount": 1000,
             "item":
                [
                 {"dish": "rice", "qty": 1},
                 {"dish": "ButtER cHicken", "qty": 1}
                ]
        }).set("Authorization",bearerToken);
        expect(response.statusCode).toBe(200);
    })
});

//dish doesnot exist
describe("post /purchase", ()=>{
    it('should return 412 when dishes are not purchased', async() => {
        const response = await request(app).post("/purchase").send({
            "givenAmount": 1500,
             "item":
                [
                 {"dish": "ricess", "qty": 1},
                 {"dish": "ButtER cHicken", "qty": 1}
                ]
        }).set("Authorization",bearerToken)
        expect(response.statusCode).toBe(412);
    })
});

//quantity 0
describe("post /purchase", ()=>{
    it('should return 412 when dishes are not purchased', async() => {
        const response = await request(app).post("/purchase").send({
            "givenAmount": 1000,
             "item":
                [
                 {"dish": "ricess", "qty": 0},
                 {"dish": "ButtER cHicken", "qty": 1}
                ]
        }).set("Authorization",bearerToken)
        expect(response.statusCode).toBe(412);
    })
});

//quanity not enough
describe("post /purchase", ()=>{
    it('should return 412 when dishes are not purchased', async() => {
        const response = await request(app).post("/purchase").send({
            "givenAmount": 1000,
             "item":
                [
                 {"dish": "ricess", "qty": 5000},
                 {"dish": "ButtER cHicken", "qty": 1}
                ]
        }).set("Authorization",bearerToken)
        expect(response.statusCode).toBe(412);
    })
});

//given amount is not enough
describe("post /purchase", ()=>{
    it('should return 412 when dishes are not purchased', async() => {
        const response = await request(app).post("/purchase").send({
            "givenAmount": 10,
             "item":
                [
                 {"dish": "ricess", "qty": 5000},
                 {"dish": "ButtER cHicken", "qty": 1}
                ]
        }).set("Authorization",bearerToken)
        expect(response.statusCode).toBe(412);
    })
});


