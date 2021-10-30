export interface PositionProps {
	y?: number
	x?: number
	z?: number
}

export interface AnimationProps {
	rotateY?: number
	rotateX?: number
	rotateZ?: number
	translateX?: {
		distance: number
		limit?: number
	}
}
