const bodyParser = require("body-parser");
const models = require("./models");
const bc = require("bcrypt");

const jsonParser = bodyParser.json();

module.exports = app => {
  //OPERACIONES USUARIOS

  //ingresar usuarios
  app.post("/users", jsonParser, async (req, res) => {
    const hashed = await bc.hash(req.body.password, 10);
    const us = { name: req.body.name, email: req.body.email, password: hashed };
    const u = await new models.User(us).save();

    res.json({ name: u.name, email: u.email });
  });

  //obtener usuarios, ordenados por nombre
  app.get("/users", async (req, res) => {
    const u = await models.User.find({}, null, { sort: { name: 1 } });
    res.json(u);
  });

  //obtener un usuario por nombre, pero no el password. y ademas obtener sus seguidores
  app.get("/users/:name", async (req, res) => {
    const u = await models.User.findOne({ name: req.params.name }, "-password").populate('followers');
    res.json(u);
  });

  //borrar un usuario con tal id
  app.delete("/users/:id", async (req, res) => {
    const u = await models.User.findByIdAndRemove(req.params.id);
    res.json("se borro el usuario: " + req.params.id);
  });

  //agregar un seguidor a un usuario,la id del que es seguido va por query y el seguidor por params
  app.post("/users/:id", jsonParser, async (req, res) => {
    const u = await models.User.findByIdAndUpdate(
      req.query.id,
      { $push: { followers: req.params.id } },
      { new: true }
    );
    res.json(u);
  });

  //OPERACIONES TWEETS

  //ingresar tweets
  app.post("/tweets", jsonParser, async (req, res) => {
    const u = await new models.Tweet(req.body).save();
    res.json(u);
  });

  //obtener los tweets
  app.get("/tweets", async (req, res) => {
    const u = await models.Tweet.find({}).populate("user");
    res.json(u);
  });

  //obtener un tweet con su id y sus responses
  app.get("/tweets/:id",async(req,res)=>{
      const u=await models.Tweet.findById(req.params.id).populate('responses');
      res.json(u);

  });

  /*porque sino los endpoints serian muy parecidos
  
  //obtener los tweets con tal id de usuario
  app.get("/tweets/:id", async (req, res) => {
    const u = await models.Tweet.find(
      { user: req.params.id },
      "-_id -__v"
    ).populate("user");
    res.json(u);
  });*/

  //borrar un tweet con tal id (id del tweet)
  app.delete("/tweets/:id", async (req, res) => {
    const u = await models.Tweet.findByIdAndRemove(req.params.id);
    res.json("se borro el tweet " + req.params.id);
  });

  //le da un like a un tweet con tal id de tweet
  app.patch("/tweets/:id", async (req, res) => {
    const u = await models.Tweet.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(u);
  });

  //agrega una respuesta a un tweet, la id del que es respondido va por query y la respuesta por params
  app.post("/tweets/:id", jsonParser, async (req, res) => {
    const u = await models.Tweet.findByIdAndUpdate(
      req.query.id,
      { $push: { responses: req.params.id } },
      { new: true }
    );
    res.json(u);
  });  
};
