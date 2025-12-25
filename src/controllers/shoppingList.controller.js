const ShoppingList = require("../models/ShoppingList");
const Category = require("../models/Category");
const Item = require("../models/Item");

exports.createList = async (req, res) => {
  const { title, shoppingDate } = req.body;

  const list = await ShoppingList.create({
    title,
    shopping_date: shoppingDate
  });

  res.json(list);
};

exports.getAll = async (req, res) => {
  const lists = await ShoppingList.findAll({
    order: [["id", "DESC"]]
  });
  res.json(lists);
};

exports.getDetail = async (req, res) => {
  const listId = req.params.id;

  const list = await ShoppingList.findByPk(listId);
  if (!list) {
    return res.status(404).json({ message: "List tidak ditemukan" });
  }

  const categories = await Category.findAll({
    where: { shopping_list_id: listId }
  });

  
  for (let cat of categories) {
    const items = await Item.findAll({
      where: { category_id: cat.id }
    });
    cat.dataValues.items = items;
  }

  res.json({
    id: list.id,
    title: list.title,
    shopping_date: list.shopping_date,
    categories
  });
};

exports.createCategory = async (req, res) => {
  try {
    const { shopping_list_id, name } = req.body;
    const category = await Category.create({ shopping_list_id, name });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { category_id, name } = req.body;
    const item = await Item.create({ category_id, name });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { checked } = req.body;
    await Item.update({ checked }, { where: { id } });
    const item = await Item.findByPk(id);
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};