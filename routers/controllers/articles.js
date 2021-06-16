const { connect } = require('./../../db/db');
const connection = require('./../../db/db');

const getAllArticles = (req, res) => {
	const query = "SELECT * FROM articles WHERE is_deleted = 0"

	connection.query(query,(err,result)=>{
		if (err) {
			res.send(err);
			return
		}
		res.status(200).json(result);
	})
	
};

const getArticlesByAuthor = (req, res) => {
	const author = req.query.author;

	if (!author) return res.status(404).json('not found');

	const query = "SELECT * FROM articles WHERE is_deleted = 0 AND author_id = ?"
	const authorId = [author]

	connection.query(query,authorId,(err,result)=>{
		if (err) {
			res.send(err);
			return
		}
		res.status(200).json(result);
	})
};

const getAnArticleById = (req, res) => {
	const _id = req.params.id;

	if (!_id) return res.status(404).json('not found');

	articlesModel
		.findOne({ _id })
		.populate('author', 'firstName -_id')
		.exec()
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.send(err);
		});
};

const createNewArticle = (req, res) => {
	const { title, description, author } = req.body;

	const article = new articlesModel({
		title,
		description,
		author,
	});

	article
		.save()
		.then((result) => {
			res.status(201).json(result);
		})
		.catch((err) => {
			res.send(err);
		});
};

const updateAnArticleById = (req, res) => {
	const id = req.params.id;

	articlesModel
		.findByIdAndUpdate(id, req.body, { new: true })
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.send(err);
		});
};

const deleteArticleById = (req, res) => {
	const id = req.params.id;

	articlesModel
		.findByIdAndDelete(id)
		.then((result) => {
			res.status(200).json({
				success: true,
				message: `Success Delete atricle with id => ${id}`,
			});
		})
		.catch((err) => {
			res.send(err);
		});
};

const deleteArticlesByAuthor = (req, res) => {
	const author = req.body.author;

	articlesModel
		.deleteMany({ author })
		.then((result) => {
			res.status(200).json({
				success: true,
				message: `Success Delete atricle with id => ${author}`,
			});
		})
		.catch((err) => {
			res.send(err);
		});
};

module.exports = {
	getAllArticles,
	getArticlesByAuthor,
	getAnArticleById,
	createNewArticle,
	updateAnArticleById,
	deleteArticleById,
	deleteArticlesByAuthor,
};
