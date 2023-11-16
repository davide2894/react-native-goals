import { Button } from "react-native";

function SubmitButton(props: { text: string }) {
  return (
    <Button
      title={props.text}
      // className="bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    ></Button>
  );
}

export default SubmitButton;
