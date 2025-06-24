import { Lobby } from "../../../models/Lobby";
import { Player } from "../../../models/Player";
import { Question } from "../../../models/Question";
import { Database, ref, set } from "firebase/database";

export interface IGamePageProps {
  db: Database;
  player: Player;
  lobby: Lobby;
  currentQuestion?: Question;
  playerArray: Player[];
}

const GamePage: React.FunctionComponent<IGamePageProps> = (props) => {
  const buzzerRef = ref(props.db, `lobbies/${props.lobby.id}/buzzer`);
  return (
    <>
      {props.currentQuestion?.submittedBy === props.player.id ? (
        <div className="gamePage">
          <h1>You are the questioner this round!</h1>
          <p>
            Read out your question, stopping when someone has buzzed in. If
            their answer needs further clarification, you can ask them to
            elaborate. If they answer correctly, you can award them the point by
            tapping their name. Otherwise, continue down the list.
          </p>
          <p>
            <strong>Question:</strong> {props.currentQuestion.question}
          </p>
          <p>
            <strong>Answer:</strong> {props.currentQuestion.answer}
          </p>
          <h2>Buzzed in</h2>
          <ul style={{ listStyleType: "none" }}>
            {props.lobby.buzzer?.map((p) => {
              const buzzedPlayer = props.playerArray.find(
                (player) => player.id === p
              );
              if (!buzzedPlayer) return null;
              return (
                <li key={buzzedPlayer.id}>
                  <button
                    onClick={() => {
                      set(buzzerRef, {});
                      const winnerRef = ref(
                        props.db,
                        `lobbies/${props.lobby.id}/players/${buzzedPlayer.id}`
                      );
                      set(winnerRef, {
                        ...props.lobby.players[buzzedPlayer.id],
                        score:
                          (props.lobby.players[buzzedPlayer.id].points ?? 0) +
                          1,
                        question: {},
                      });
                    }}
                  >
                    {buzzedPlayer.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="gamePage">
          <h1>Waiting for the questioner...</h1>
          <p>
            The questioner will read out the question when they are ready. You
            can buzz in if you think you know the answer.
          </p>
          {!props.lobby.buzzer?.includes(props.player.id) && (
            <button
              onClick={() => {
                const buzzerRef = ref(
                  props.db,
                  `lobbies/${props.lobby.id}/buzzer`
                );
                set(buzzerRef, [
                  ...(props.lobby.buzzer || []),
                  props.player.id,
                ]);
              }}
            >
              Buzz In
            </button>
          )}
        </div>
      )}
    </>
  );
};
export default GamePage;
