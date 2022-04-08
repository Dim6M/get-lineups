const mongoose = require("mongoose");

const clubSchema = mongoose.Schema({
	name: { type: String, required: true },
	stade: { type: String, required: false },
	championship: { type: String, required: false },
	trigram: { type: String, required: false },
	twitterAccount: { type: String, required: true },
	searchTerms: { type: Array, required: false },
});

module.exports = mongoose.model('Club', clubSchema);