import Modal from "./Modal";
import { ActionButton, GhostButton, DangerButton } from "../Button";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText = "Confirm",
  confirmColor = "red",
  message,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <p className="text-sm font-bold text-slate-500 mb-8 px-2">{message}</p>

    <div className="flex gap-4">
      {confirmColor === "red" ? (
        <DangerButton
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex-1 h-14"
        >
          {confirmText}
        </DangerButton>
      ) : (
        <ActionButton
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex-1 h-14"
        >
          {confirmText}
        </ActionButton>
      )}
      <GhostButton onClick={onClose} className="flex-1 h-14">
        Cancel
      </GhostButton>
    </div>
  </Modal>
);

export default ConfirmModal;