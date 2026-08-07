// ============================================================
// StarRating — Star Character Renderer
// ============================================================
//
// 📚 REACT CONCEPT: Pure Component
// StarRating is a "pure" component — given the same rating prop,
// it always returns the same output. No side effects, no state.
// These are the simplest and most predictable React components.
// ============================================================

/**
 * Renders star characters for a numeric rating.
 * @param {number} rating - e.g. 4.7 renders ★★★★½☆
 */
export function StarRating({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = '';

  for (let i = 0; i < full; i++) stars += '★';
  if (half) stars += '½';
  for (let i = Math.ceil(rating); i < 5; i++) stars += '☆';

  return <span className="stars">{stars}</span>;
}
