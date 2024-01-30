const request = require("supertest");
// express app
const app = require("./index");

// db setup
const { sequelize, Dog } = require("./db");
const seed = require("./db/seedFn");
const { dogs } = require("./db/seedData");

describe("Endpoints", () => {
  // to be used in POST test
  const testDogData = {
    breed: "Poodle",
    name: "Sasha",
    color: "black",
    description:
      "Sasha is a beautiful black pooodle mix.  She is a great companion for her family.",
  };

  beforeAll(async () => {
    // rebuild db before the test suite runs
    await seed();
  });

  describe("GET /dogs", () => {
    it("should return list of dogs with correct data", async () => {
      // make a request
      const response = await request(app).get("/dogs");
      // assert a response code
      expect(response.status).toBe(200);
      // expect a response
      expect(response.body).toBeDefined();
      // toEqual checks deep equality in objects
      // console.log(response.body[0])
      // console.log(dogs[0])
      expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
    });

    // POST Test : post to db and compare response with db
    it("should POST correct data to db", async () => {
      // make request
      const response = await request(app).post("/dogs").send({
        name: "doggy",
        breed: "dog",
        color: "dog color",
        description: "prescious",
      });
      // expect response
      //   console.log(response.body.name)
      expect(response.body).toBeDefined();
      expect(response.status).toBe(200);
      // search db for posted dog's id
      const created = await Dog.findByPk(response.body.id);
      //   console.log(created.name)
      expect(created.name).toBe(response.body.name);
    });

    // DELETE Test : delete by id and expect null.
    it("should DELETE by id", async () => {
        // POST new 
      await request(app).post(
        "/dogs").send({
          name: "doggy",
          breed: "dog",
          color: "dog color",
          description: "prescious",
        });
      const found = await Dog.findOne({
        where: {name:"doggy"}
      });

      // DELETE new
      const response = await request(app).delete("/dogs/"+found.id);
      expect(response.status).toBe(200);

      // check if deleted
      const check = await Dog.findByPk(found.id);
      expect(check).toBeNull();
    });
  });
});
