type Props = { code: string; size?: number };

export default function Flag({ code, size = 20 }: Props) {
  if (!/^[a-z]{2}$/i.test(code)) {
    return (
      <span aria-hidden="true" style={{ fontSize: size * 0.9, lineHeight: 1 }}>
        {code}
      </span>
    );
  }
  return (
    <span
      className={`fi fi-${code.toLowerCase()}`}
      role="img"
      aria-label={code.toUpperCase()}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundSize: "cover",
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
    />
  );
}