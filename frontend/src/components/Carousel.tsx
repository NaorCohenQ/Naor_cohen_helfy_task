import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";

type Props<T> = {
  items: T[];
  render: (item: T) => React.ReactNode;
  auto?: boolean;
  intervalMs?: number;
  empty?: React.ReactNode;
};

export default function Carousel<T>({
  items,
  render,
  auto = true,
  intervalMs = 3500,
  empty = <div className="panel">No Tasks</div>,
}: Props<T>) {
  if (!items.length) return <>{empty}</>;

  const slides = useMemo(() => [items[items.length - 1], ...items, items[0]], [items]);
  const [index, setIndex] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);
  const snapping = useRef(false);

  function snap(to: number) {
    const el = trackRef.current;
    snapping.current = true;
    if (el) el.classList.add("no-anim");
    setIndex(to);
  }

  useLayoutEffect(() => {
    if (!snapping.current) return;
    const el = trackRef.current;
    const id = requestAnimationFrame(() => {
      if (el) el.classList.remove("no-anim");
      snapping.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [index]);

  useEffect(() => { snap(1); }, [items.length]);

  useEffect(() => {
    if (!auto || items.length <= 1) return;
    const t = setInterval(() => setIndex(i => i + 1), intervalMs);
    return () => clearInterval(t);
  }, [auto, intervalMs, items.length]);

  function next() {
    setIndex(i => (i < slides.length - 1 ? i + 1 : i));
  }

  function prev() {
    setIndex(i => (i > 0 ? i - 1 : i)); 
  }

  function onEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (e.propertyName !== "transform") return;
    if (index === slides.length - 1) snap(1);
    else if (index === 0) snap(slides.length - 2);
  }

  const display = index === 0 ? items.length : index === slides.length - 1 ? 1 : index;

  return (
    <div className="carousel panel">
      <div
        ref={trackRef}
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTransitionEnd={onEnd}
      >
        {slides.map((it, i) => (
          <div className="carousel-slide" key={i}>
            <div className="slide-inner">{render(it)}</div>
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="row" style={{ marginTop: 8, justifyContent: "space-between" }}>
          <button className="btn" onClick={prev}>Previous</button>
          <span>{display} / {items.length}</span>
          <button className="btn" onClick={next}>Next</button>
        </div>
      )}
    </div>
  );
}
