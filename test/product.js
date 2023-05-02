const { chai, server, should } = require("./testConfig");
const ProductModel = require("../models/ProductModel");

/**
 * Test cases to test all the book APIs
 * Covered Routes:
 * (1) Login
 * (2) Store book
 * (3) Get all books
 * (4) Get single book
 * (5) Update book
 * (6) Delete book
 */

describe("Product", () => {
	//Before each test we empty the database
	before((done) => {
		ProductModel.deleteMany({}, (err) => {
			done();
		});
	});

	// Prepare data for testing
	// const userTestData = {
	// 	"password":"Test@123",
	// 	"email":"maitraysuthar@test12345.com"
	// };

	// Prepare data for testing
	const testData = {
		"code": "spec-4",
		"description": "Spec 4 desc",
		"type": "BEDROOM",
		"price": 23000
	};

	// 	/*
	//   * Test the /POST route
	//   */
	// 	describe("/POST Login", () => {
	// 		it("it should do user Login for book", (done) => {
	// 			chai.request(server)
	// 				.post("/api/auth/login")
	// 				.send({"email": userTestData.email,"password": userTestData.password})
	// 				.end((err, res) => {
	// 					res.should.have.status(200);
	// 					res.body.should.have.property("message").eql("Login Success.");
	// 					userTestData.token = res.body.data.token;
	// 					done();
	// 				});
	// 		});
	// 	});

	/*
  * Test the /POST route
  */
	describe("/POST Product Store", () => {
		it("It should send validation error for store product", (done) => {
			chai.request(server)
				.post("/api/product")
				.send()
				//.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});

	/*
  * Test the /POST route
  */
	describe("/POST Product Store", () => {
		it("It should store book", (done) => {
			chai.request(server)
				.post("/api/product")
				.send(testData)
				//.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Product added successfully.");
					done();
				});
		});
	});

	/*
  * Test the /GET route
  */
	describe("/GET All Product", () => {
		it("it should GET all the products", (done) => {
			chai.request(server)
				.get("/api/product")
				//.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation success");
					testData._id = res.body.data[0]._id;
					done();
				});
		});
	});

	/*
  * Test the /GET/:code route
  */
	describe("/GET/:code product", () => {
		it("it should GET the product", (done) => {
			chai.request(server)
				.get("/api/product/" + testData.code)
				//.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation success");
					done();
				});
		});
	});

	/*
  * Test the /PUT/:code route
  */
	describe("/PUT/:code product", () => {
		it("it should PUT the product", (done) => {
			chai.request(server)
				.put("/api/product/" + testData.code)
				.send(testData)
				//.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Product updated successfully.");
					done();
				});
		});
	});

	/*
  * Test the /DELETE/:code route
  */
	describe("/DELETE/:code product", () => {
		it("it should DELETE the product", (done) => {
			chai.request(server)
				.delete("/api/product/" + testData.code)
				//.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Product deleted successfully.");
					done();
				});
		});
	});
});