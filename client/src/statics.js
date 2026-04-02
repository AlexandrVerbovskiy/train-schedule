export const TRAIN_TYPE_LABELS = {
  passenger: "Passenger",
  express: "Express",
  intercity: "Intercity+",
};

export const TRAIN_TYPE_OPTIONS = Object.entries(TRAIN_TYPE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);
