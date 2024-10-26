const express = require("express");

const personController = require("./../controllers/personControlles");
const auth = require("../controllers/authController");

const router = express.Router();

// router.param("id",(req,res,next,val)=>{
//
//     next()
// })

// router.route("/top").get(personController.top,personController.getPersons)
// router.route("/stat").get(personController.getPersonStat)
// router.route("/monthly-plan/:year").get(personController.getMonthlyPlan)

router
  .route("/")
  .get(auth.protect, personController.getPersons)
  .post(personController.createPerson);

router
  .route("/:id")
  .get(personController.getPerson)
  .patch(personController.updatePerson)
  .delete(
    auth.restrictTo("admin"),
    auth.protect,
    personController.deletePerson
  );

// router.route('/question-gpt').get(personController.questionGpt)

module.exports = router;
