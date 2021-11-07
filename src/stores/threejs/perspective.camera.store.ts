import { writable } from "svelte/store";
import type { PerspectiveCamera } from "three";

export const camera = writable<PerspectiveCamera>()