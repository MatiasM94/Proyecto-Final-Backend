import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;

const requester = supertest("http://localhost:3000");

describe("Testing Ecommerce", () => {
  const cookie = {};
  describe("Test de Session", () => {
    it("El usuario debe loguear correctamente y devolver una cookie", async () => {
      const mockUser = {
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
      };

      const result = await requester.post("/api/auth/login").send(mockUser);
      const cookieResult = result.headers["set-cookie"][0];
      expect(cookieResult).to.be.ok;

      cookie.name = cookieResult.split("=")[0];
      cookie.value = cookieResult.split("=")[1];
      expect(cookie.name).to.be.ok.and.eql("authToken");
      expect(cookie.value).to.be.ok;
    });

    it("Verificar que la cookie contiene al usuario correcto", async () => {
      const { _body } = await requester
        .get("/api/auth/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(_body.payload.email).to.be.eql("adminCoder@coder.com");
    });
  });

  describe("Test de Products", () => {
    it("Se debe obtener correctamente los products con el metodo GET", async () => {
      const { _body } = await requester
        .get("/api/products")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(_body.payload).to.be.ok;
    });

    it("No se deben obtener los products sin el token de autorización", async () => {
      const { _body } = await requester.get("/api/products");

      expect(_body.error).to.be.eql("No auth token");
    });

    it("Se debe poder filtar los products por paginas", async () => {
      const page = 2;
      const { _body } = await requester
        .get(`/api/products?page=${page}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(_body.payload.page).to.be.eql(page);
    });

    it("Se debe poder obtener un producto especifico por su _id", async () => {
      const _id = "63e913a1bd9707fce84a424a";
      const { _body } = await requester
        .get(`/api/products/${_id}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(_body._id).to.be.eql(_id);
    });
  });

  describe("Test de Carts", () => {
    let cid;
    it("se debe poder crear un cart con un product", async () => {
      const mockProduct = { pid: "63e913a1bd9707fce84a4240" };
      const { _body, statusCode } = await requester
        .post("/api/carts")
        .send(mockProduct)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      cid = _body.cartAdded._id;

      expect(statusCode).to.equal(201);
      expect(_body).to.have.property("cartAdded");
      expect(_body.cartAdded).to.have.property("products");
      expect(_body.cartAdded.products[0].product).to.equal(mockProduct.pid);
    });

    it("Se debe poder agregar un product a un cart existente", async () => {
      const mockProduct = { pid: "63e913a1bd9707fce84a4242" };
      const { _body, statusCode } = await requester
        .patch(`/api/carts/${cid}`)
        .send(mockProduct)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(statusCode).to.equal(200);
      expect(_body).to.deep.equal({
        message: `the product with id ${mockProduct.pid} was added successfully`,
      });
    });

    it("Se debe poder eliminar un cart completo", async () => {
      const { _body, statusCode } = await requester
        .delete(`/api/carts/${cid}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(statusCode).to.equal(200);
      expect(_body).to.deep.equal({
        message: `the cart with id ${cid} was deleted`,
      });
    });
  });
});
