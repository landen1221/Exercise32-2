process.env.NODE_ENV = "test";

const request = require("supertest")

const app = require("../app");
const { captureStackTrace } = require("../expressError");
const shoppingList = require("../fakeDB");

let items = [{ name: "eggs", price: 3.5 },{ name: "peanuts", price: 7.0 }]

// Generic items to test funcitonality
beforeEach(function() {
    for (let i=0;i<items.length; i++) {
        shoppingList.push(items[i]);    
    }
    
});

afterEach(function() {
    shoppingList.length = 0
});

describe("Testing initial route '/items'", () => {
    test("Get all items at /items", async() => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body.shoppingList).toContainEqual({"name": "eggs", "price": 3.5})
    })
    
    test("Post a new item at /items", async() => {
        const newItem = { name: "milk", price: 2.75}
        const res = await request(app).post("/items").send(newItem);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({added: newItem});
    })
})

describe("Testing functionality for the route '/items/:name'", () => {
    test("If name not found at /items/:name", async() => {
        const res = await request(app).get(`/items/notFound`);
        expect(res.statusCode).toBe(404)
    })
    
    test("Get - Find name at /items/:name", async() => {
        const res = await request(app).get(`/items/${shoppingList[0].name}`);
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({foundItem: shoppingList[0]})
    })

    test("Patch - New name if name found at /items/:name", async() => {
        const editedItem = shoppingList[0].name
        const newName = {name: 'organic-eggs'}
        
        const res1 = await request(app).patch(`/items/${editedItem}`).send(newName);
        expect(res1.statusCode).toBe(200);
        expect(res1.body).toEqual({updated: {"name": newName.name, price: shoppingList[0].price}});

        
    })

    test("Patch - New Price if name found at /items/:name", async() => {
        const editedItem = shoppingList[0].name
        const newPrice = { price: 5.50 }
        
        const res2 = await request(app).patch(`/items/${editedItem}`).send(newPrice)
        expect(res2.statusCode).toBe(200);
        console.log(res2.body)
        expect(res2.body).toEqual({updated: {"name": editedItem, price: newPrice.price }});

    })

   
    test("Delete - If name found at /items/:name", async() => {
        const res = await request(app).delete(`/items/${shoppingList[0].name}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: "Deleted"})
    })
})



