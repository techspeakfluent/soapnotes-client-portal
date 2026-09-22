// Type-safe route definitions: `path` for React Router, `generate` to build a
// URL from its params (encoded, and required by the path's type).

type PathParam<Path extends string> =
  Path extends `${string}/:${infer Param}/${infer Rest}`
    ? Param | PathParam<`/${Rest}`>
    : Path extends `${string}/:${infer Param}`
      ? Param
      : never;

type Params<Path extends string> = {
  [Key in PathParam<Path>]: string | number;
};

interface Route<Path extends string> {
  path: Path;
  generate: (
    params: Params<Path>,
    query?: Record<string, string | number | boolean>,
  ) => string;
}

export function defineRoute<Path extends string>(path: Path): Route<Path> {
  return {
    path,
    generate: (params, query) => {
      let url = path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
        const value = params[key as keyof typeof params];
        if (value === undefined || value === null) {
          throw new Error(
            `Missing required path parameter: ${key} for path "${path}"`,
          );
        }
        return encodeURIComponent(value.toString());
      });

      if (query && Object.keys(query).length > 0) {
        const searchParams = new URLSearchParams();
        for (const [k, v] of Object.entries(query)) {
          if (v !== undefined && v !== null) {
            searchParams.append(k, v.toString());
          }
        }
        if (searchParams.toString()) url += `?${searchParams.toString()}`;
      }

      return url;
    },
  };
}
