const { server } = require("./app.js");

const { PORT } = process.env;

server.listen(PORT, () => console.log(`Server is running at port ${PORT}...`));
