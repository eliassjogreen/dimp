import { parse } from "https://deno.land/std/flags/mod.ts";
import { exists, readJson, writeJson } from "https://deno.land/std/fs/mod.ts";

import { ImportMap } from "./import_map.ts";

const args = parse(Deno.args, {
    boolean: ["fetch", "strict", "adddirectory", "removedirectory", "format"],
    alias: {
        fetch: "f",
        importmap: ["i", "import-map", "import_map"],
        strict: "s",
        adddirectory: "a",
        removedirectory: "r"
    },
    default: {
        fetch: false,
        importmap: "import_map.json",
        strict: false,
        adddirectory: true,
        removedirectory: true,
        format: true
    }
});

async function Main(): Promise<void> {
    if (!(await exists(args.importmap))) {
        await writeJson(args.importmap, {});
    }

    const importMap = ImportMap.parse((await readJson(args.importmap)) as object, args.strict);

    if (!args._[0]) {
        return;
    }

    switch (args._[0]) {
        case "add":
            if (!args._[1]) {
                return;
            }

            const url = args._[1];

            if (
                url
                    .split("/")
                    .pop()
                    .includes(".")
            ) {
                // File
                const file = url.split("/").pop();
                const directory = url.split("/").splice(-2, 2)[0];

                if (!importMap.hasImport(file)) {
                    importMap.addImport(
                        file.startsWith("mod.") ? directory : file.split(".")[0],
                        url
                    );
                }

                if (args.adddirectory && !importMap.hasImport(`${directory}/`)) {
                    importMap.addImport(
                        `${directory}/`,
                        url
                            .split("/")
                            .slice(0, -1)
                            .join("/") + "/"
                    );
                }
            } else {
                // Directory
                const directory = url.endsWith("/")
                    ? url.split("/").splice(-2, 2)[0]
                    : url.split("/").pop();

                if (!importMap.hasImport(`${directory}/`)) {
                    importMap.addImport(`${directory}/`, url);
                }
            }

            await writeJson(args.importmap, importMap, args.format ? { spaces: 4 } : undefined);
            break;
        case "remove":
            if (!args._[1]) {
                return;
            }

            const name = args._[1];

            if (importMap.hasImport(name)) {
                importMap.removeImport(name);
            }

            if (args.removedirectory && importMap.hasImport(`${name}/`)) {
                importMap.removeImport(`${name}/`);
            }

            await writeJson(args.importmap, importMap, args.format ? { spaces: 4 } : undefined);
            break;
    }
}

Main();
