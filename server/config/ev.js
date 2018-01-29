module.exports = {
	MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost/todo',
  SECRET: 'fullStackTodo',
  PORT: process.env.PORT || 3001
}