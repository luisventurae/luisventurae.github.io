/** Distance or velocity needed to change project (see emil-design-eng › momentum dismissal). */
export const SWIPE_DISTANCE_PX = 90
export const SWIPE_VELOCITY = 450

export interface SwipeInput {
  index: number
  count: number
  offset_x: number
  velocity_x: number
}

/** Returns the project index after a horizontal swipe. Never wraps around. */
export function resolveSwipe({ index, count, offset_x, velocity_x }: SwipeInput): number {
  const is_flick = Math.abs(velocity_x) > SWIPE_VELOCITY
  const is_far = Math.abs(offset_x) > SWIPE_DISTANCE_PX
  if (!is_flick && !is_far) return index

  const direction = (is_far ? offset_x : velocity_x) < 0 ? 1 : -1
  return Math.min(count - 1, Math.max(0, index + direction))
}
