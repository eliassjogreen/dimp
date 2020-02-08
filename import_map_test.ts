import { test, assertEquals, assertThrows } from "https://deno.land/std/testing/mod.ts";
import { ImportMap } from "./import_map.ts";

test(function parsesEmpty(): void {
  const parsed = ImportMap.parse(`{}`);

  assertEquals(parsed, {});
});

test(function parsesEmptyStrict(): void {
  const parsed = ImportMap.parse(`{}`, true);

  assertEquals(parsed, {});
});

test(function parsesImports(): void {
  const parsed = ImportMap.parse(`{
        "imports": {
            "a": "/a.ts",
            "b": "/b.ts",
            "c": "/c.ts"
        }
    }`);

  assertEquals(parsed, {
    imports: {
      a: "/a.ts",
      b: "/b.ts",
      c: "/c.ts"
    }
  });
});

test(function parsesScopes(): void {
  const parsed = ImportMap.parse(`{
        "scopes": {
            "/scope1/": {
                "a": "/a.ts"
            },
            "/scope2/": {
                "b": "/b.ts"
            }
        }
    }`);

  assertEquals(parsed, {
    scopes: {
      "/scope1/": {
        a: "/a.ts"
      },
      "/scope2/": {
        b: "/b.ts"
      }
    }
  });
});

test(function parsesImportsAndScopes(): void {
  const parsed = ImportMap.parse(`{
        "imports": {
            "a": "/a.ts",
            "b": "/b.ts",
            "c": "/c.ts"
        },
        "scopes": {
            "/scope1/": {
                "a": "/a.ts"
            },
            "/scope2/": {
                "b": "/b.ts"
            }
        }
    }`);

  assertEquals(parsed, {
    imports: {
      a: "/a.ts",
      b: "/b.ts",
      c: "/c.ts"
    },
    scopes: {
      "/scope1/": {
        a: "/a.ts"
      },
      "/scope2/": {
        b: "/b.ts"
      }
    }
  });
});

test(function throwsWhenStrict(): void {
  assertThrows(() => ImportMap.parse(`{ "incorrect": { } }`, true));
});
