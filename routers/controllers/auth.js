const usersModel = require('./../../db/models/users');

const login = (req, res) => {
	const { email, password } = req.body;

	usersModel
		.authenticateBasic(email, password)
		.then((result) => {
			console.log("result:", result)
			if (result[0]){
				return res.status(200).json({ token: result[0] });
			}

			res.status(200).json(result[0]);
		})
		.catch((err) => {
			res.send(err);
		});
};

module.exports = {
	login,
};
