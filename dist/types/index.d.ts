declare const execSync: any, spawnSync: any;
declare const os: any;
declare const colors: any;
declare const Command: any;
declare const figlet: any;
declare class OsCommand {
    cmd: string;
    opts: string[];
    constructor(cmd: string, opts: string[]);
}
declare const getOsCommand: (command: string, opts: string[], requiresSudo: boolean, isInteractive: boolean) => OsCommand;
declare const getAptCommand: (command: string, requiresSudo: boolean, isInteractive: boolean) => OsCommand;
declare const getDnfCommand: (command: string, requiresSudo: boolean, isInteractive: boolean) => OsCommand;
declare const getYumCommand: (command: string, requiresSudo: boolean, isInteractive: boolean) => OsCommand;
declare const getPacmanCommand: (command: string, requiresSudo: boolean, isInteractive: boolean) => OsCommand;
declare const getYaourtCommand: (command: string, requiresSudo: boolean, isInteractive: boolean) => OsCommand;
declare const getZypperCommand: (command: string, requiresSudo: boolean, isInteractive: boolean) => OsCommand;
declare const checkCommandExists: (cmd: string) => boolean;
declare const runCommand: (cmd: string, args: string[]) => void;
declare const program: any;
declare const options: any, limit = 1;
declare const doSystemUpdate: () => void;
