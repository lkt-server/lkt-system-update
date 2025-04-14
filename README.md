# LKT System Update

One command line, everything up to date

![node](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Flkt-server%2Flkt-system-update%2Fmaster%2Fpackage.json&query=%24.engines.node&style=for-the-badge&label=node&color=026e00)

## Features

- Automatic detects if it's a normal user or root/sudo
- Supported package managers:
  - APT (Debian, Ubuntu, LinuxMint, ...)
  - DNF/Yum (RHEL, Fedora, ..)
  - Pacman & Yaourt (ArchLinux, Manjaro, ...)
  - Zypper (SUSE & openSUSE)
  - Flatpak
  - NPM (Node Package Manager)
  - SNAP

## Installation

```bash
npm install -g lkt-system-update
```

## Usage

```bash
lkt-system-update
```

As soon as you press Enter, the command will prompt info about what's running out.

If required (not root), password will request.

### APT sample

![running-1.png](https://raw.githubusercontent.com/lkt-server/lkt-system-update/main/doc/img/running-1.png)

And will be noticed when finished:

![running-2.png](https://raw.githubusercontent.com/lkt-server/lkt-system-update/main/doc/img/running-2.png)

### Update order

1. OS package engine: apt, yum, pacman...
2. OS package cleaning (apt only)
3. flatpak (only if installed)
4. npm (only if installed)
5. snap (only if installed)

### CLI options

Options:

| Option                | Result                       |
|-----------------------|------------------------------|
| `-V`, `--version`     | output the version number    |
| `--no-snap`           | prevent snap packages update |
| `--no-npm`            | prevent npm packages update  |
| `-i`, `--interactive` | enables interaction          |
| `-h`, `--help`        | display help for command     |

The `no snap` option exists in case you want to use this command in scheduled scripts because snap API doesn't allow user to skip password authentication.

By default, this command updates the system without the need of user input, but you can be able to manually confirm the updates with the `interactive` option.

### Examples

```bash
# Common user usage
lkt-system-update

# Common user usage, but wants to confirm updates
lkt-system-update -i
 
# Run in an scheduled cronjob
lkt-system-update --no-snap

# Common user usage (without NPM)
lkt-system-update --no-npm
```

