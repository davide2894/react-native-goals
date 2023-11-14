function SubmitButton(props: { text: string }) {
  return (
    <button
      className="bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      type="submit"
      value="submit">
      {props.text}
    </button>
  );
}

export default SubmitButton;
