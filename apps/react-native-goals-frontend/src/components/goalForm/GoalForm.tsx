import { useState, SyntheticEvent } from "react";
import { FormProps, GoalType } from "../../types";
import SubmitButton from "../submitButton/SubmitButton";
import { useAuthContext } from "../authProvider/AuthProvider";

function GoalForm(props: FormProps) {
  const [goalTitle, setGoalTitle] = useState(
    props.titleToEdit ? props.titleToEdit : ""
  );
  const [goalScore, setGoalScore] = useState(
    props.maxScoreToEdit ? props.maxScoreToEdit : ""
  );
  const auth = useAuthContext();
  //   const user = useAuthUser();

  function onFormSubmit(evt: SyntheticEvent) {
    evt.preventDefault();

    const goal: GoalType = {
      title: goalTitle,
      maxScore: parseInt(goalScore),
      minScore: 0,
      actualScore: 0,
      id: props.goalToEditId ? props.goalToEditId : uuidv4(),
      // userIdRef: auth.id, ???
      //TODO: logged user id info should be available on the frontend
      userIdRef: 1,
      timestamp: Date.now(),
    };

    if (props.mode) {
      if (props.mode === "add") {
        // dispatch(addGoal(goal));
        // toast.success("Goal added successfully!");
      } else if (props.mode === "edit") {
        // dispatch(updateGoal(goal));
      }
    }

    if (props.onGoalFormSubmit) {
      props.onGoalFormSubmit();
    }
  }

  const inputCssClasses =
    "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black";
  const labelCssClasses = "block mb-2";

  return (
    <form
      className="shadow-md rounded pt-6 pb-8 mb-4"
      onSubmit={(evt) => onFormSubmit(evt)}>
      <div className="mb-4">
        <label htmlFor="nameInput" className="goalForm__nameLabel block mb-2">
          Goal title:
          <input
            className={inputCssClasses}
            type="text"
            name="name"
            required
            id="nameInput"
            value={goalTitle}
            onChange={(evt) => {
              setGoalTitle(evt.target.value);
            }}
          />
        </label>
      </div>
      <div className="mb-5">
        <label htmlFor="scoreInput" className={labelCssClasses}>
          Times to meet per week:
          <input
            className={inputCssClasses}
            type="number"
            required
            name="score"
            min="0"
            id="scoreInput"
            value={goalScore}
            onChange={(evt) => {
              setGoalScore(evt.target.value);
            }}
          />
        </label>
      </div>
      <SubmitButton text="Submit" />
    </form>
  );
}

export default GoalForm;
function uuidv4(): number {
  throw new Error("Function not implemented.");
}
