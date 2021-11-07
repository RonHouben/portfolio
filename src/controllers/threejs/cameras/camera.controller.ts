import type { Camera } from "three";
import { BaseController } from "../base.controller";

export class CameraController<T extends Camera> extends BaseController<T> {}