const User = require("../users/model")
const Question = require("./model")

const helpers = require("../helpers")

module.exports = {
  destroy: (req, res, next) => {
    console.log("DESTROYING")
    mongoose.connection.db.dropCollection("questions", (err, result) => {
      if (err) res.send(err)
      else res.send("Collection questions dropped")
    })
  },

  get: (req, res, next) => {
    Question.find({})
      .populate("createdBy", "-password")
      .populate("answers.createdBy", "-password")
      .exec((err, questions) => {
        if (err) res.send(err)
        else res.send(questions)
      })
  },

  getOne: (req, res, next) => {
    Question.findOne({ id: req.params.id })
      .populate("createdBy", "-password")
      .populate("answers.createdBy", "-password")
      .exec((err, question) => {
        if (err) res.send(err)
        else res.send(question)
      })
  },

  post: (req, res, next) => {
    const token = req.headers.authorization || req.body.token
    const user = helpers.decodeToken(token)

    if (user) {
      // PREPARE NEW QUESTION
      const newQuestion = new Question({
        title: req.body.title,
        createdBy: user._id
      })

      console.log(newQuestion)

      // SAVE THAT NEW QUESTION
      newQuestion.save(err => {
        err
          ? res.send(err)
          : res.send({
              message: "New question saved",
              data: newQuestion
            })
      })
    } else {
      // NOTIFY IF USER TOKEN IS INVALID
      res.send({ message: "User token is invalid" })
    }
  },

  delete: (req, res, next) => {},

  deleteOne: (req, res, next) => {},

  putOne: (req, res, next) => {}
}
