import { useState } from "react";

type Props<T> = {
  items: T[];
  render: (item: T) => React.ReactNode;
  empty?: React.ReactNode;
};

export default function Carousel<T>({
  items,
  render,
  empty = <div className="panel">No Tasks</div>,
}: Props<T>) {
  const [index, setIndex] = useState(0);

  if (!items.length) return <>{empty}</>;

  function next() {
    setIndex(i => (i+1) % items.length);
  }

  function prev() {
    setIndex(i => (i-1+items.length)% items.length);
  }

  return (
    <div className="carousel panel">
      <div>{render(items[index])}</div>
      <div className="row" style={{ marginTop: 8, justifyContent: "space-between" }}>
        <button className="btn" onClick={prev}>Previous</button>
        <span>{index + 1} / {items.length}</span>
        <button className="btn" onClick={next}>Next</button>
      </div>
    </div>
  );

}
