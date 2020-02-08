# DIMP

> **D**ENO **IMP**ORT MAP

`dimp` is a helper for adding and removing imports from [import maps](https://github.com/WICG/import-maps) made for deno.

## Install

To install `dimp` simply enter the following into the terminal:
`deno install dimp https://denolib.com/eliassjogreen/dimp/dimp.ts --allow-read --allow-write`

## Usage

### Add

The add command adds files or directories or both to the import map.

Examples:

#### Adding a file
```
dimp add https://deno.land/x/denon/watcher.ts -a false
```
```
{
    "imports": {
        "watcher": "https://deno.land/x/denon/watcher.ts"
    }
}
```

#### Adding a file and directory
```
dimp add https://deno.land/x/denon/watcher.ts
```
```
{
    "imports": {
        "watcher": "https://deno.land/x/denon/watcher.ts",
        "denon/": "https://deno.land/x/denon/"
    }
}
```

#### Adding a directory
```
dimp add https://deno.land/x/denon/
```
```
{
    "imports": {
        "denon/": "https://deno.land/x/denon/"
    }
}
```

### Remove

#### Removing a file
``` 
{
    "imports": {
        "watcher": "https://deno.land/x/denon/watcher.ts",
        "denon/": "https://deno.land/x/denon/"
    }
}
```
```
dimp remove watcher
```
``` 
{
    "imports": {
        "denon/": "https://deno.land/x/denon/"
    }
}
```

#### Removing a directory
``` 
{
    "imports": {
        "watcher": "https://deno.land/x/denon/watcher.ts",
        "denon/": "https://deno.land/x/denon/"
    }
}
```
```
dimp remove denon
```
``` 
{
    "imports": {
        "watcher": "https://deno.land/x/denon/watcher.ts"
    }
}
```

## Todo

- [ ] Help dialog
- [ ] Built in run and fetch command?
- [ ] Scope commands
- [ ] Remove directory and all subdirectories/files
