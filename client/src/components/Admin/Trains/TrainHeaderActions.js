import React from "react";
import { Plus } from "lucide-react";
import { ActionButton } from "../../Common/Button";

const TrainHeaderActions = ({ onCreateClick }) => (
  <ActionButton onClick={onCreateClick}>
    <Plus size={16} />
    New Train
  </ActionButton>
);

export default TrainHeaderActions;
