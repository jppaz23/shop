import { Star } from "lucide-react";

export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= Math.round(rating)
              ? "fill-lime-500 text-lime-500"
              : "fill-stone-200 text-stone-200"
          }`}
        />
      ))}
    </div>
  );
}
