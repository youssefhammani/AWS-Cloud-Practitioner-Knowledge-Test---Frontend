const resultList = document.getElementById("resultList");
const resultQuiz = JSON.parse(localStorage.getItem("resultQuiz")) || [];

resultList.innerHTML = resultQuiz
  .map(resultQuiz => {
    return `<div class="result-question"> 
                <var> Question : ${resultQuiz.question} </var>
                <p class="answerIncorrect"> ${resultQuiz.answerIncorrect} </p>
                <p class="answerCorrect"> ${resultQuiz.answerCorrect} </p>
                <p class="description"> Description <br> <br> ${resultQuiz.description} </p>
            </div>`;
  })
  .join("");
  