import { useState } from "react";

export const State = ({ initialValue = null, children }) => {
  const state = useState(initialValue);
  return children(state);
}