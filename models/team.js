const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
	name: { type: String, required: true },
	trigram: { type: String, required: false },
	twitterName: { type: String, required: true },
});

module.exports = mongoose.model('Team', teamSchema);