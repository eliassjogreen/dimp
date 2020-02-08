export type Imports = { [name: string]: string };

export type Scopes = { [scope: string]: Imports };

export interface ImportMap {
    imports?: Imports;
    scopes?: Scopes;
}

export class ImportMap implements ImportMap {
    public imports?: Imports;
    public scopes?: Scopes;

    constructor({
        imports,
        scopes
    }: { imports?: Imports; scopes?: Scopes } = {}) {
        if (imports) this.imports = imports;
        if (scopes) this.scopes = scopes;
    }

    public hasImport(name: string): boolean {
        if (this.imports) return !!this.imports[name];
    }

    public addImport(name: string, url: string): void {
        if (!this.imports) {
            this.imports = {};
        }

        this.imports[name] = url;
    }

    public removeImport(name: string): void {
        if (!this.imports) return;
        if (this.hasImport(name)) {
            delete this.imports[name];
        }
    }

    public hasScope(scope: string): boolean {
        if (this.scopes) return !!this.scopes[scope];
    }

    public addScope(scope: string, imports: Imports = {}): void {
        if (!this.scopes) {
            this.scopes = {};
        }

        this.scopes[scope] = imports;
    }

    public removeScope(scope: string): void {
        if (!this.scopes) return;
        if (this.hasScope(scope)) {
            delete this.scopes[scope];
        }
    }

    public toString(): string {
        return JSON.stringify(this);
    }

    static parse(source: object | string, strict: boolean = false): ImportMap {
        const parsed = typeof source === "string" ? JSON.parse(source) : source;

        let imports: Imports | undefined = undefined;
        let scopes: Scopes | undefined = undefined;

        if (!valid(parsed)) {
            throw new TypeError("Import map JSON must be of type object.");
        }

        if ("imports" in parsed) {
            if (!valid(parsed.imports)) {
                throw new TypeError(
                    "Import map's imports must be of type object."
                );
            }

            imports = {};

            for (const [name, url] of Object.entries(parsed.imports)) {
                if (typeof url !== "string") {
                    throw new TypeError(
                        `Invalid imports key-value pair "${name}: ${url}". Element must be of type string.`
                    );
                }

                imports[name] = url;
            }
        }

        if ("scopes" in parsed) {
            if (!valid(parsed.scopes)) {
                throw new TypeError(
                    "Import map's scopes must be of type object."
                );
            }

            scopes = {};

            for (const [scope, imports] of Object.entries(parsed.scopes)) {
                if (!valid(imports)) {
                    throw new TypeError(
                        `Invalid scope imports in scope "${scope}". Scope imports must be of type object.`
                    );
                }

                scopes[scope] = {};

                for (const [name, url] of Object.entries(imports)) {
                    if (typeof url !== "string") {
                        throw new TypeError(
                            `Invalid scope imports key-value pair "${name}: ${url}" in scope "${scope}". Element must be of type string.`
                        );
                    }

                    scopes[scope][name] = url;
                }
            }
        }

        if (strict) {
            const badKeys = new Set(Object.keys(parsed));

            if (badKeys.has("imports")) {
                badKeys.delete("imports");
            }

            if (badKeys.has("scopes")) {
                badKeys.delete("scopes");
            }

            for (const badKey of badKeys) {
                throw new TypeError(
                    `Invalid top-level key "${badKey}". Only "imports" and "scopes" can be present.`
                );
            }
        }

        if (imports) {
            if (scopes) {
                return new ImportMap({
                    imports: imports,
                    scopes: scopes
                });
            }
            return new ImportMap({
                imports: imports
            });
        }

        if (scopes) {
            return new ImportMap({
                scopes: scopes
            });
        }

        return new ImportMap();
    }
}

function valid(value): boolean {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
