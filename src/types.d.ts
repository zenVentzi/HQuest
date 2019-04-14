type RequireSome<T, K extends keyof T> = Required<Pick<T, K>> & T;
type Diff<T, U> = T extends U ? never : T; // Remove types from T that are assignable to U

type RequireSome1<T, K extends keyof T> = NonNullable<Pick<T, K>> & T;
