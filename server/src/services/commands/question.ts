import { broadcast } from "../../utils/ws";
import type { Game } from "../../types";
import { BASE_POINTS } from "../../const/base-points";

export function startQuestion(game: Game): void {
  game.playerAnswers.clear();
  game.questionStartTime = Date.now();
  const question = game.questions[game.currentQuestion];
  if (!question) {
    return;
  }

  broadcast(
    game.players,
    "question",
    {
      questionNumber: game.currentQuestion + 1,
      totalQuestions: game.questions.length,
      text: question.text,
      options: question.options,
      timeLimitSec: question.timeLimitSec,
    },
    game.hostWs,
  );

  game.questionTimer = setTimeout(() => {
    finishQuestion(game);
  }, question.timeLimitSec * 1000);
}

export function finishQuestion(game: Game): void {
  if (game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = undefined;
  }

  const question = game.questions[game.currentQuestion];
  if (!question) {
    return;
  }
  const correctAnswerIndex = question.correctIndex;

  const playerResults = game.players.map((player) => {
    const answer = game.playerAnswers.get(player.index);
    const correct = answer?.answerIndex === correctAnswerIndex;

    const pointsEarned =
      answer && correct && game.questionStartTime !== undefined ?
        Math.floor(
          BASE_POINTS *
            Math.max(
              0,
              (question.timeLimitSec * 1000 -
                (answer.timestamp - game.questionStartTime)) /
                (question.timeLimitSec * 1000),
            ),
        )
      : 0;

    player.score += pointsEarned;

    return {
      name: player.name,
      answered: answer !== undefined,
      correct,
      pointsEarned,
      totalScore: player.score,
    };
  });

  broadcast(
    game.players,
    "question_result",
    {
      questionIndex: game.currentQuestion,
      correctIndex: correctAnswerIndex,
      playerResults,
    },
    game.hostWs,
  );

  game.currentQuestion += 1;

  if (game.currentQuestion < game.questions.length) {
    setTimeout(() => {
      startQuestion(game);
    }, 2000);
  } else {
    const scoreboard = [...game.players]
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        name: player.name,
        score: player.score,
        rank: index + 1,
      }));
    game.status = "finished";
    broadcast(game.players, "game_finished", { scoreboard }, game.hostWs);
  }
}
