import { Question } from "../../../models/Question";
import {
  getDatabase,
  onDisconnect,
  onValue,
  onChildAdded,
  onChildRemoved,
  ref,
  set,
} from "firebase/database";

export interface IEnterQuestionPageProps {}

const EnterQuestionPage: React.FunctionComponent<IEnterQuestionPageProps> = (
  props
) => {
  function onsubmitQuestion(question: Question) {
    const db = getDatabase();
    const questionsRef = ref(db, `questions/${question.id}`);

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
            submittedBy: "Anonymous", // Replace with actual user ID if available
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
