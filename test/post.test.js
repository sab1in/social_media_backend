const supertest = require("supertest");
const app = require("../app");

const path = require("path");
const fs = require("fs");

describe("create post", () => {
  test("should return with status 200 when correct data is provided", async () => {
    const response = await supertest(app)
      .post("/post/61e059f9650e3e03a041fae8")
      .send({
        userId: "61e059f9650e3e03a041fae8",
        desc: "somthing in description.",
      });
    expect(response.status).toBe(200);
  });
});
