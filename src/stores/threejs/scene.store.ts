import { writable } from "svelte/store";
import type { Scene } from "three";

export const scene = writable<Scene>()