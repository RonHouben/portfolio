/// <reference types="@sveltejs/kit" />

type Modify<T, R> = Omit<T, keyof R> & R;

