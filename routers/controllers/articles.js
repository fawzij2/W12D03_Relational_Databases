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
	const query = "INSERT INTO articles (title, description, author_id) VALUES (?,?,?)"
	const articleData = [title, description, author];

	connection.query(query,articleData,(err,result)=>{
		if (err) {
			res.send(err);
			return
		}
		res.status(200).json(result);
	})
};

const updateAnArticleById = (req, res) => {
	const id = req.params.id;
	const {title,author,description} = req.body;
	const query = "UPDATE articles SET title =?, author_id=?, description=? WHERE id= ?"
	const updateData = [title, author, description, id];

	connection.query(query,updateData,(err,result)=>{
		if (err) {
			res.send(err);
			return
		}
		res.status(200).json(result);
	})
	
};

const deleteArticleById = (req, res) => {
	const id = req.params.id;
	const query = "UPDATE articles SET is_deleted=1";
	const article_id = [id];

	connection.query(query,article_id,(err,result)=>{
		if (err) {
			res.send(err);
			return
		}
		res.status(200).json(result);
	})
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
