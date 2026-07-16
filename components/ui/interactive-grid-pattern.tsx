"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number]; // [horizontalCount, verticalCount]
  squaresClassName?: string;
}

export const InteractiveGridPattern = React.forwardRef<
  SVGSVGElement,
  InteractiveGridPatternProps
>(
  (
    {
      width = 40,
      height = 40,
      squares = [24, 24],
      className,
      squaresClassName,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const [horizontalCount, verticalCount] = squares;
    const [hoveredSquare, setHoveredSquare] = React.useState<{ x: number; y: number } | null>(null);

    return (
      <svg
        ref={ref}
        width="100%"
        height="100%"
        className={cn("absolute inset-0 h-full w-full", className)}
        {...props}
      >
        <defs>
          <pattern
            id={id}
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
            x="-1"
            y="-1"
          >
            <path
              d={`M ${width} 0 L 0 0 0 ${height}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
        <svg x="-1" y="-1" className="overflow-visible">
          {Array.from({ length: horizontalCount * verticalCount }).map((_, index) => {
            const x = index % horizontalCount;
            const y = Math.floor(index / horizontalCount);

            return (
              <rect
                key={index}
                x={x * width}
                y={y * height}
                width={width}
                height={height}
                className={cn(
                  "stroke-none fill-transparent transition-all duration-150 ease-out",
                  hoveredSquare?.x === x && hoveredSquare?.y === y
                    ? "fill-current"
                    : "hover:fill-current",
                  squaresClassName
                )}
                onMouseEnter={() => setHoveredSquare({ x, y })}
                onMouseLeave={() => setHoveredSquare(null)}
              />
            );
          })}
        </svg>
      </svg>
    );
  }
);

InteractiveGridPattern.displayName = "InteractiveGridPattern";
