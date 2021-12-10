import type { Object3D } from 'three'

interface Neighbours<T extends Object3D<Event>> {
	top?: T
	topRight?: T
	right?: T
	bottomRight?: T
	bottom?: T
	bottomLeft?: T
	left?: T
	topLeft?: T
}

export class GridHelper {
	public static getNeighboursOfTarget<T extends Object3D<Event>>(
		group: Object3D,
		target: Object3D,
		cellDistance: number,
		cellSize: number
	): Neighbours<T> {
		const left = group.children.find(
			(c) =>
				c.position.x === target.position.x - (cellDistance + cellSize) &&
				c.position.y === target.position.y &&
				c.position.z === target.position.z
		) as T | undefined

		const right = group.children.find(
			(c) =>
				c.position.x === target.position.x + (cellDistance + cellSize) &&
				c.position.y === target.position.y &&
				c.position.z === target.position.z
		) as T | undefined

		const top = group.children.find(
			(c) =>
				c.position.x === target.position.x &&
				c.position.y === target.position.y + (cellDistance + cellSize) &&
				c.position.z === target.position.z
		) as T | undefined

		const topLeft = group.children.find(
			(c) =>
				c.position.x === target.position.x - (cellDistance + cellSize) &&
				c.position.y === target.position.y + (cellDistance + cellSize) &&
				c.position.z === target.position.z
		) as T | undefined

		const topRight = group.children.find(
			(c) =>
				c.position.x === target.position.x + (cellDistance + cellSize) &&
				c.position.y === target.position.y + (cellDistance + cellSize) &&
				c.position.z === target.position.z
		) as T | undefined

		const bottom = group.children.find(
			(c) =>
				c.position.x === target.position.x &&
				c.position.y === target.position.y - (cellDistance + cellSize) &&
				c.position.z === target.position.z
		) as T | undefined

		const bottomLeft = group.children.find(
			(c) =>
				c.position.x === target.position.x - (cellDistance + cellSize) &&
				c.position.y === target.position.y - (cellDistance + cellSize) &&
				c.position.z === target.position.z
		) as T | undefined

		const bottomRight = group.children.find(
			(c) =>
				c.position.x === target.position.x + (cellDistance + cellSize) &&
				c.position.y === target.position.y - (cellDistance + cellSize) &&
				c.position.z === target.position.z
		) as T | undefined

		return {
			bottom,
			bottomLeft,
			bottomRight,
			left,
			right,
			top,
			topLeft,
			topRight
		}
	}
}
