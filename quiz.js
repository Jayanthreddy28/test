'use strict';
const $ = (id) => document.getElementById(id);
let questions, index, score, answered;

function makeQuestions() {
  const pairs = [];
  for (let a = 1; a <= 10; a++) {
    for (let b = a; b <= 10; b++) pairs.push([a, b]);
  }
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.slice(0, 10);
}

function renderQuestion(focus = true) {
  const [a, b] = questions[index];
  answered = false;
  $('question-count').textContent = `QUESTION ${String(index + 1).padStart(2, '0')} OF 10`;
  $('question').innerHTML = `${a} <span>×</span> ${b} <span>=</span> <span class="mystery">?</span>`;
  $('answer').value = '';
  $('answer').disabled = false;
  $('check-button').disabled = false;
  $('next-button').hidden = true;
  $('next-button').textContent = index === 9 ? 'See my score →' : 'Next question →';
  $('feedback').className = '';
  $('feedback').textContent = 'A little thinking goes a long way. ✧';
  if (focus) $('answer').focus();
}

function start(focus = false) {
  questions = makeQuestions();
  index = 0;
  score = 0;
  $('score').textContent = '0';
  $('progress').style.width = '0%';
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', '0');
  $('play-screen').hidden = false;
  $('result-screen').hidden = true;
  renderQuestion(focus);
}

$('answer-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (answered || !$('answer').checkValidity() || $('answer').value.trim() === '') return;
  answered = true;
  const [a, b] = questions[index];
  const correct = Number($('answer').value) === a * b;
  if (correct) score += 10;
  $('score').textContent = String(score);
  $('feedback').className = correct ? 'correct' : 'incorrect';
  $('feedback').textContent = correct
    ? ['Brilliant thinking! You earned 10 points. ✦', 'You’ve got it! +10 points. ✦', 'Amazing work! Your brain is growing. +10 points. ✦'][index % 3]
    : `Good try! ${a} × ${b} = ${a * b}. Every try helps you learn!`;
  $('answer').disabled = true;
  $('check-button').disabled = true;
  $('progress').style.width = `${(index + 1) * 10}%`;
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', String(index + 1));
  $('next-button').hidden = false;
  $('next-button').focus();
});

$('next-button').addEventListener('click', () => {
  if (!answered) return;
  if (index < 9) { index++; renderQuestion(); return; }
  $('play-screen').hidden = true;
  $('result-screen').hidden = false;
  $('final-score').textContent = String(score);
  $('correct-count').textContent = `You answered ${score / 10} out of 10 questions correctly.`;
  $('result-message').textContent = score === 100 ? 'A perfect score! What a multiplication superstar.' : score >= 60 ? 'Wonderful work! Keep exploring those big possibilities.' : 'You kept going, and that’s what matters. Keep practicing!';
  $('restart-button').focus();
});
$('restart-button').addEventListener('click', () => start(true));
start();
