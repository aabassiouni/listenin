const router = require("express").Router();
const User = require("../models/User");

router.get("/", function (req, res) {
	console.log("//////////////// search called //////////////////////");
	const query = req.query.query;

	if (!query) {
		console.log("query is null");
		res.send({});
	}

	console.log("query is ", query);
	try {
		const agg = [
			{
				$search: {
					autocomplete: {
						query: query,
						path: "username",
						fuzzy: {
							maxEdits: 2,
						},
					},
				},
			},
			{
				$limit: 10,
			},
		];

		User.aggregate(agg).then((results) => {
			console.log(
				"results are ",
				results.map((result) => result.email)
			);
			res.status(200).json(results);
		});
	} catch (err) {
		console.log(err);
		res.status(403).json("somethings weird");
	}
});

module.exports = router;
