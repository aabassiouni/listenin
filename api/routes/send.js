const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../server.js");
const router = require("express").Router();

router.put("/", function (req, res) {
	console.log("//////////////// send called //////////////////////");
	console.log("req.body is ", req.body);
	console.log("req.body.sender_id is ", req.body.sender_id);
	console.log("req.body.receiver_id is ", req.body.receiver_id);
	console.log("req.body.song_id is ", req.body.song_id);
	console.log("req.body.note is ", req.body.note);

	async function addMessage() {
		let message = {
			sender_id: req.body.sender_id,
			song_id: req.body.song_id,
			note: req.body.note,
		};

		try {
			const docRef = await db.collection("messages").doc(req.body.receiver_id);

			const doc = await docRef.get();
			console.log("doc is ", doc);
			if (!doc.exists) {
				console.log("No such document!");
				docRef = await db
					.collection("messages")
					.doc(req.body.receiver_id)
					.set({
						messages: [message],
					});
			} else {
				// console.log("Document data:", doc.data());
				const unionRes = await docRef.update({
					messages: FieldValue.arrayUnion(message),
				});
			}
		} catch (error) {
			console.log("Error getting document:", error);
		}
	}

	addMessage();

	res.status(200).json("success");
});

module.exports = router;