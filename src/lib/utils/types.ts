export type Modify<T, R> = Omit<T, keyof R> & R

export enum RendererType {
  webGL,
  webGL1
}
