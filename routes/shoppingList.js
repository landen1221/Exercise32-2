// Create shoppingList specific routes

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const shoppingList = require("../fakeDb");

// shoppingList.push({ name: "eggs", price: 3.5 },{ name: "peanuts", price: 7.0 })

router.get("/", function (req, res) {
  res.json({ shoppingList });
});

router.post("/", function (req, res, next) {
  try {
    const name = req.body.name;
    const price = req.body.price;

    if (!name || !price) {
      throw new ExpressError("Both name and price required to add item");
    }

    const newItem = { name, price };
    shoppingList.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (e) {
    next(e);
  }
});

router.get("/:name", function (req, res) {
  const foundItem = shoppingList.find((item) => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  res.json({ foundItem });
});

router.patch("/:name", function (req, res, next) {
  const foundItem = shoppingList.find((item) => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }

  const name = req.body.name;
  const price = req.body.price;

  if (!name && !price) {
    throw new ExpressError("Body missing. Price and/or name required");
  } else if (!name) {
    foundItem.price = price;
    return res.json({ updated: foundItem });
  } else if (!price) {
    foundItem.name = name;
    return res.json({ updated: foundItem });
  }

  foundItem.price = price;
  foundItem.name = name;
  return res.json({ updated: foundItem });
});

router.delete("/:name", (req, res, next) => {
  const foundItem = shoppingList.findIndex(
    (item) => item.name === req.params.name
  );
  if (foundItem === -1) throw new ExpressError("Item not found", 404);

  shoppingList.splice(foundItem, 1);
  return res.json({ message: "Deleted" });
});

module.exports = router;
