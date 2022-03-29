export const AspectRatio = (props) => {
  const { ref, innerRef, children, className = "", ratio, style = {} } = props;

  const r = ratio.split(":");
  const val = 100 / parseFloat(r[0]) * parseFloat(r[1]);
  return (
    <div ref={ref} className={className} style={{ position: 'relative', width: "100%", paddingTop: `${val}%`, ...style }}>
      <div ref={innerRef} style={{ position: 'absolute', top: 0, left: 0, height: "100%", width: "100%" }}>{children}</div>
    </div>
  )
};