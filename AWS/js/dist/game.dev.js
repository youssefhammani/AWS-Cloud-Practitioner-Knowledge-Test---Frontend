"use strict";

var question = document.getElementById("question");
var choices = Array.from(document.getElementsByClassName("choice-text"));
var progressText = document.getElementById("progressText");
var scoreText = document.getElementById("score");
var progressBarFull = document.getElementById("progressBarFull");
var resultQuiz = JSON.parse(localStorage.getItem('resultQuiz')) || [];
var currentQuestion = {};
var acceptingAnswers = false;
var score = 0;
var questionCounter = 0;
var availableQuesions = [];
var descriptionIncorrect = [];
var stockIndex = [];
var arryStr = []; //let resultQuiz = [];

var questions = [{
  question: "Why is AWS more economical than traditional data centers for applications with varying compute workloads?",
  choice1: "Amazon EC2 costs are billed on a monthly basis.",
  choice2: "Users retain full administrative access to their Amazon EC2 instances.",
  choice3: "Amazon EC2 instances can be launched on demand when needed.",
  choice4: "Users can permanently run enough instances to handle peak workloads.",
  answer: 3,
  description: "The ability to launch instances on demand when needed allows users to launch and terminate instances in response to a varying workload. This is a more economical practice than purchasing enough on-premises servers to handle the peak load."
}, {
  question: "Which AWS service would simplify the migration of a database to AWS?",
  choice1: "AWS Storage Gateway",
  choice2: "AWS Database Migration Service (AWS DMS)",
  choice3: "Amazon EC2",
  choice4: "Amazon AppStream 2.0",
  answer: 2,
  description: "AWS DMS helps users migrate databases to AWS quickly and securely. The source database remains fully operational during the migration, minimizing downtime to applications that rely on the database. AWS DMS can migrate data to and from most widely used commercial and open-source databases."
}, {
  question: "Which AWS offering enables users to find, buy, and immediately start using software solutions in their AWS environment?",
  choice1: "AWS Config",
  choice2: "AWS OpsWorks",
  choice3: "AWS SDK",
  choice4: "AWS Marketplace",
  answer: 4,
  description: "AWS Marketplace is a digital catalog with thousands of software listings from independent software vendors that makes it easy to find, test, buy, and deploy software that runs on AWS."
}, {
  question: "Which AWS networking service enables a company to create a virtual network within AWS?",
  choice1: "AWS Config",
  choice2: "Amazon Route 53",
  choice3: "AWS Direct Connect",
  choice4: "Amazon Virtual Private Cloud (Amazon VPC)",
  answer: 4,
  description: "Amazon VPC lets users provision a logically isolated section of the AWS Cloud where users can launch AWS resources in a virtual network that they define."
}, {
  question: "Which of the following is an AWS responsibility under the AWS shared responsibility model?",
  choice1: "Configuring third-party applications",
  choice2: "Maintaining physical hardware ",
  choice3: "Securing application access and data",
  choice4: "Managing guest operating systems",
  answer: 2,
  description: "Maintaining physical hardware is an AWS responsibility under the AWS shared responsibility model."
}, {
  question: " Which component of the AWS global infrastructure does Amazon CloudFront use to ensure low-latency delivery?",
  choice1: "AWS Regions",
  choice2: "Edge locations",
  choice3: "Availability Zones",
  choice4: "Virtual Private Cloud (VPC)",
  answer: 2,
  description: "To deliver content to users with lower latency, Amazon CloudFront uses a global network of points of presence (edge locations and regional edge caches) worldwide."
}, {
  question: "How would a system administrator add an additional layer of login security to a user's AWS Management Console?",
  choice1: "Use Amazon Cloud Directory",
  choice2: "Audit AWS Identity and Access Management (IAM) roles",
  choice3: "Enable multi-factor authentication",
  choice4: "Enable AWS CloudTrail",
  answer: 3,
  description: "Multi-factor authentication (MFA) is a simple best practice that adds an extra layer of protection on top of a username and password. With MFA enabled, when a user signs in to an AWS Management Console, they will be prompted for their username and password (the first factor—what they know), as well as for an authentication code from their MFA device (the second factor—what they have). Taken together, these multiple factors provide increased security for AWS account settings and resources."
}, {
  question: "Which service can identify the user that made the API call when an Amazon EC2 instance is terminated?",
  choice1: "AWS Trusted Advisor",
  choice2: "AWS CloudTrail",
  choice3: "AWS X-Ray",
  choice4: "AWS Identity and Access Management (AWS IAM)",
  answer: 2,
  description: "AWS CloudTrail helps users enable governance, compliance, and operational and risk auditing of their AWS accounts. Actions taken by a user, role, or an AWS service are recorded as events in CloudTrail. Events include actions taken in the AWS Management Console, AWS Command Line Interface (CLI), and AWS SDKs and APIs."
}, {
  question: "Which service would be used to send alerts based on Amazon CloudWatch alarms?",
  choice1: "Amazon Simple Notification Service (Amazon SNS)",
  choice2: "AWS CloudTrail",
  choice3: "AWS Trusted Advisor",
  choice4: "Amazon Route 53",
  answer: 1,
  description: "Amazon SNS and Amazon CloudWatch are integrated so users can collect, view, and analyze metrics for every active SNS. Once users have configured CloudWatch for Amazon SNS, they can gain better insight into the performance of their Amazon SNS topics, push notifications, and SMS deliveries."
}, {
  question: "Where can a user find information about prohibited actions on the AWS infrastructure?",
  choice1: "AWS Trusted Advisor",
  choice2: "AWS Identity and Access Management (IAM)",
  choice3: "Amazon ECAWS Billing Console",
  choice4: "AWS Acceptable Use Policy",
  answer: 4,
  description: "The AWS Acceptable Use Policy provides information regarding prohibited actions on the AWS infrastructure."
}]; //CONSTANTS

var CORRECT_BONUS = 10;
var MAX_QUESTIONS = 10;

startGame = function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuesions = [].concat(questions);
  getNewQuestion();
};

getNewQuestion = function getNewQuestion() {
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("end.html");
  }

  questionCounter++;
  progressText.innerText = "Question ".concat(questionCounter, "/").concat(MAX_QUESTIONS); //Update the progress bar

  progressBarFull.style.width = "".concat(questionCounter / MAX_QUESTIONS * 100, "%");
  var questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerText = currentQuestion.question;
  arryStr.push(availableQuesions[questionIndex]);
  choices.forEach(function (choice) {
    var number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });
  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach(function (choice) {
  choice.addEventListener("click", function (e) {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    var selectedChoice = e.target;
    var selectedAnswer = selectedChoice.dataset["number"];
    var classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    } else {
      var stockDescription = {
        question: currentQuestion.question,
        answerCorrect: currentQuestion["choice" + currentQuestion.answer],
        answerIncorrect: currentQuestion["choice" + selectedAnswer],
        description: currentQuestion.description
      };
      resultQuiz.push(stockDescription);
      localStorage.setItem('resultQuiz', JSON.stringify(resultQuiz));
    }

    selectedChoice.parentElement.classList.add(classToApply);
    setTimeout(function () {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = function incrementScore(num) {
  score += num;
  scoreText.innerText = score;
};

startGame();