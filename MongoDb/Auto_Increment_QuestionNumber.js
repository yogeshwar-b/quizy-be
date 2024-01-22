/**
 * Trigger Name : Auto_Increment_QuestionNumber
 * Enable : True
 * Event Ordering: True
 * Watch Against : Collection
 * Cluster Name : QuizyDB
 * Database Name : sample-collection
 * Collection Name : questions
 * Operation Type : Insert Document
 * Full Document : True
 * Document Preiamge : False
 * Event Type : Function
 */
exports = async function (changeEvent) {
  var docId = changeEvent.fullDocument._id
  const { updateDescription, fullDocument } = changeEvent
  const { roomname } = fullDocument

  const countercollection = context.services
    .get('quizydb')
    .db(changeEvent.ns.db)
    .collection('counters')
  const questioncollection = context.services
    .get('quizydb')
    .db(changeEvent.ns.db)
    .collection(changeEvent.ns.coll)

  var counter = await countercollection.findOneAndUpdate(
    { roomname: changeEvent.fullDocument.roomname },
    { $inc: { seq_value: 1 } },
    { returnOriginal: false, returnNewDocument: true, upsert: true }
  )
  var updateRes = await questioncollection.updateOne(
    { _id: docId },
    { $set: { QuestionNumber: counter.seq_value } }
  )

  console.log(
    `Updated ${JSON.stringify(changeEvent.ns)} with counter ${
      counter.seq_value
    } result : ${JSON.stringify(updateRes)}`
  )
}
