import React from "react";
import Navbar from "./Navbar";
import SimpleTextReveal from "./SimpleTextReveal";

const AboutMe: React.FC = () => {
  return (
    <div className="relative w-full">
      <Navbar isScrolled={true} />
      <div className="h-[96px]" />

      <SimpleTextReveal
        title="About Me"
        text={`I didn’t start out trying to build flashy interfaces or chase trends. I started by wanting to understand how things worked — why some products felt effortless while others felt heavy, confusing, or fragile. Over time, I found myself drawn to the intersection of frontend craft and full-stack problem solving. I value clean abstractions, readable code, and systems that remain understandable as they grow.`}
      />

    </div>
  );
};

export default AboutMe;
