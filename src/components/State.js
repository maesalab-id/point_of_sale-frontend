import { useState } from "react";

export const State = ({ children }) => {
  const state = useState(null);
  return children(state);
}