import IMask from "imask";
import { useCallback, useEffect, useRef } from "react";
import { createSyntheticEvent } from "./utils/createSyntheticEvent";

export const InputMask = (props) => {
  const { children, onChange, value, onAccept, onComplete, ...rest } = props;

  const ref = useRef(null);
  const maskRef = useRef(null);

  const _destroyMask = useCallback(() => {
    maskRef.current.destroy();
    maskRef.current = null;
  }, []);

  const _onAccept = useCallback(
    (event) => {
      if (!maskRef.current) return;
      onAccept?.(maskRef.current.value, maskRef.current, event);
      if (!event) return;
      const e = createSyntheticEvent(event);
      onChange(e);
    },
    [onAccept, onChange]
  );

  const _onComplete = useCallback(
    () =>
      maskRef.current && onComplete?.(maskRef.current.value, maskRef.current),
    [onComplete]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || !rest.mask) return _destroyMask();
    const mask = maskRef.current;
    if (!mask) {
      if (el && rest.mask) {
        maskRef.current = IMask(ref.current, rest);
        if (el.defaultValue !== maskRef.current.value) {
          _onAccept();
        }
      }
    } else {
      mask?.updateOptions(rest);
    }
  }, [rest, _destroyMask, _onAccept]);

  useEffect(() => {
    if (!maskRef.current) return;
    maskRef.current.updateOptions(rest);
  }, [rest]);

  useEffect(() => {
    const mask = maskRef.current;
    if (mask && mask.value !== value) {
      mask.value = value || "";
    }
  }, [value]);

  useEffect(() => {
    if (!maskRef.current) return;
    maskRef.current.on("accept", _onAccept);
    maskRef.current.on("complete", _onComplete);
    return () => {
      maskRef.current.off("accept", _onAccept);
      maskRef.current.off("complete", _onComplete);
    };
  }, [_onAccept, _onComplete]);

  return children({ ref });
};
