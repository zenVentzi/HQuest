type RequireSome<T, K extends keyof T> = Required<Pick<T, K>> & T;
type Diff<T, U> = T extends U ? never : T; // Remove types from T that are assignable to U

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>; // not needed in ts 3.5

type RequiredAndNotNull<T> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined>
};

type RequireAndNotNullSome<T, K extends keyof T> = RequiredAndNotNull<
  Pick<T, K>
> &
  Omit<T, K>;
