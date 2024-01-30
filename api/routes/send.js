const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const router = require("express").Router();

const db = getFirestore();
router.put("/:conversationID", function (req, res) {
	console.log("//////////////// send called //////////////////////");
	console.log("req.body is ", req.body);
	console.log("req.body.sender_id is ", req.body.sender_id);
	console.log("req.body.receiver_id is ", req.body.receiver_id);
	console.log("req.body.song_id is ", req.body.song_id);
	console.log("req.body.note is ", req.body.note);

	try {
		console.log("req.params.conversationID is", req.params.conversationID);
		const conversationID = req.params.conversationID;
		let message = {
			sender_id: req.body.sender_id,
			song_id: req.body.song_id,
			note: req.body.note,
			timestamp: FieldValue.serverTimestamp(),
		};

		console.log("adding message to firebase");
		const docRef = db.collection("messages").doc(conversationID).collection("messages").add(message);
		console.log("message added to firebase");

		res.status(200).json("success");
	}
	catch (err) {
		console.log("error in send route", err);
		res.status(500).json(err);
	}
});



module.exports = router;