import React from "react";
import { Plus } from "lucide-react";
import { ActionButton } from "../../Common/Button";

const StationHeaderActions = ({ onCreateClick }) => (
  <ActionButton onClick={onCreateClick}>
    <Plus size={16} />
    New Station
  </ActionButton>
);

export default StationHeaderActions;
