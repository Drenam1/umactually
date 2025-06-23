import { Lobby } from "../../../models/Lobby";
import { Player } from "../../../models/Player";
import { Question } from "../../../models/Question";
import { Database, ref, set } from "firebase/database";

export interface IEnterQuestionPageProps {
  db: Database;
  player: Player;
  lobby: Lobby;
}

const EnterQuestionPage: React.FunctionComponent<IEnterQuestionPageProps> = (
  props
) => {
  function onsubmitQuestion(question: Question) {
    const questionsRef = ref(
      props.db,
      `lobbies/${props.lobby.id}/players/${props.player.id}/question`
    );

    set(questionsRef, question)
      .then(() => {
        console.log("Question submitted successfully");
      })
      .catch((error) => {
        console.error("Error submitting question:", error);
      });
  }
  return (
    <div className="enterQuestionPage">
      <h1>Enter a Question</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const questionInput = (e.target as HTMLFormElement).question.value;
          const answerInput = (e.target as HTMLFormElement).answer.value;
          const question: Question = {
            id: Date.now().toString(),
            question: questionInput,
            answer: answerInput,
            submittedBy: props.player.id,
          };
          onsubmitQuestion(question);
        }}
      >
        <div>
          <label htmlFor="question">Question:</label>
          <input type="text" id="question" name="question" required />
        </div>
        <div>
          <label htmlFor="answer">Answer:</label>
          <input type="text" id="answer" name="answer" required />
        </div>
        <button type="submit">Submit Question</button>
      </form>
    </div>
  );
};
export default EnterQuestionPage;
