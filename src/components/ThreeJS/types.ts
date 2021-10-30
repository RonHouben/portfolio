export interface PositionProps {
	y?: number
	x?: number
	z?: number
}

export interface AnimationProps {
	rotateY?: number
	rotateX?: number
	rotateZ?: number
	translateX?: Translate
	translateY?: Translate
	translateZ?: Translate
}

interface Translate {
	distance: number
	limit?: number
}
