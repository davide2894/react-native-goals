import { devModeLog } from "dev-mode-log";
import { ReactNode, SyntheticEvent, useEffect } from "react";
import { Button, View } from "react-native";

function Modal(props: { onClose: any; children?: ReactNode; mode?: string }) {
  const { mode, onClose, children } = props;

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.code === "Escape") {
        onClose();
        devModeLog("escape pressed");
      }
    }
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  function onCloseClick() {
    props.onClose();
  }

  function closeModalOnClickOutside(evt: SyntheticEvent) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.currentTarget.classList.contains("modalOverlay") && props.onClose();
  }

  return (
    <View
    // className="modalOverlay absolute top-0 bottom-0 left-0 right-0 bg-transparent backdrop-blur-md z-10 flex flex-col items-center"
    >
      <Button title="close modal" onPress={onCloseClick}></Button>
      <View
      // className="p-5 m-14  bg-gray-700 rounded max-w-[960px]"
      // onClick={(evt) => {
      //   evt.stopPropagation();
      // }}
      >
        <View>
          <h2>{mode === "add" ? "Add Goal" : "Edit Goal"}</h2>
          {children}
        </View>
      </View>
    </View>
  );
}

export default Modal;
