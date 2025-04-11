import {execSync, spawnSync} from 'child_process';
import os from 'os';
import colors from 'colors';
import figlet from "figlet";
import {program} from "./config/program-config";

class OsCommand {
    cmd: string;
    opts: string[];

    constructor(cmd: string, opts: string[]) {
        this.cmd = cmd;
        this.opts = opts;
    }

    static getCommand(command: string, opts: string[], requiresSudo: boolean) {
        let cmd = requiresSudo ? 'sudo' : command;
        if (requiresSudo) opts = [command].concat(opts);
        return new OsCommand(cmd, opts);
    }

    static existsInOs(cmd: string) {
        try {
            const output = execSync('command -v ' + cmd);
            return output.toString() !== '';
        } catch (error) {
            return false;
        }
    }

    static run (command: OsCommand) {
        spawnSync(command.cmd, command.opts, {stdio: 'inherit'}); // will print as it's processing
    }
}

const getAptCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : [command, '-y'];
    return OsCommand.getCommand('apt', opts, requiresSudo);
}

const getDnfCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : [command, '-y'];
    return OsCommand.getCommand('dnf', opts, requiresSudo);
}

const getYumCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : [command, '-y'];
    return OsCommand.getCommand('yum', opts, requiresSudo);
}

const getPacmanCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : [command, '--noconfirm'];
    return OsCommand.getCommand('pacman', opts, requiresSudo);
}

const getYaourtCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : [command, '--noconfirm'];
    return OsCommand.getCommand('yaourt', opts, requiresSudo);
}

const getZypperCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : ['--non-interactive', command];
    return OsCommand.getCommand('zypper', opts, requiresSudo);
}

// CLI options
const options = program.opts();

const doSystemUpdate = () => {

    // Check CLI arguments
    const noSnap = options.nosnap === true,
        interactive = options.interactive === true;

    // Enable colors
    colors.enable()

    // invoke userInfo() method
    const userInfo = os.userInfo();

    // get uid property from the userInfo object
    const uid = userInfo.uid;

    const requiredSudo = uid !== 0;

    const hasAPT = OsCommand.existsInOs('apt-get'),
        hasDNF = OsCommand.existsInOs('dnf'),
        hasYUM = OsCommand.existsInOs('yum'),
        hasPACMAN = OsCommand.existsInOs('pacman'),
        hasYAOURT = OsCommand.existsInOs('yaourt'),
        hasFLATPAK = OsCommand.existsInOs('flatpak'),
        hasSNAP = OsCommand.existsInOs('snap'),
        hasZYPPER = OsCommand.existsInOs('zypper'),
        hasNPM = OsCommand.existsInOs('npm');

    console.log('');
    console.log(
        figlet.textSync('LKT System Update', {
            font: 'Small',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true,
        }).green
    )
    console.log('');

    if (!requiredSudo) { // sudoer
        console.log('[!]'.red + ' Running as root/sudo user'.yellow);
        console.log('');
    } else {
        console.log('[!]'.red + ' Running as regular user'.yellow);
        console.log('');
    }

    let cmd = new OsCommand('', []);

    if (hasAPT) {
        console.log('Updating apt...'.blue);
        console.log('');

        cmd = getAptCommand('update', requiredSudo, interactive);
        OsCommand.run(cmd);

        cmd = getAptCommand('upgrade', requiredSudo, interactive);
        OsCommand.run(cmd);

        console.log('');
        console.log('Cleaning apt...'.blue);
        console.log('');

        cmd = getAptCommand('autoremove', requiredSudo, interactive);
        OsCommand.run(cmd);
        cmd = getAptCommand('clean', requiredSudo, interactive);
        OsCommand.run(cmd);
        cmd = getAptCommand('autoclean', requiredSudo, interactive);
        OsCommand.run(cmd);
        console.log('');
    }

    if (hasDNF) {
        console.log('Updating dnf...'.blue);
        console.log('');

        cmd = getDnfCommand('update', requiredSudo, interactive);
        OsCommand.run(cmd);
        console.log('');

    } else if (hasYUM) {
        console.log('Updating yum...'.blue);
        console.log('');

        cmd = getYumCommand('update', requiredSudo, interactive);
        OsCommand.run(cmd);
        console.log('');
    }

    if (hasPACMAN) {
        console.log('Updating pacman...'.blue);
        console.log('');

        cmd = getPacmanCommand('-Syu', requiredSudo, interactive);
        OsCommand.run(cmd);
        console.log('');
    }

    if (hasYAOURT) {
        console.log('Updating yaourt...'.blue);
        console.log('');

        cmd = getYaourtCommand('-Syu', requiredSudo, interactive);
        OsCommand.run(cmd);
        console.log('');
    }

    if (hasZYPPER) {
        console.log('Updating zypper...'.blue);
        console.log('');

        cmd = getZypperCommand('refresh', requiredSudo, interactive);
        OsCommand.run(cmd);

        cmd = getZypperCommand('up', requiredSudo, interactive);
        OsCommand.run(cmd);
        console.log('');
    }

    if (hasFLATPAK) {
        console.log('Updating flatpak...'.blue);
        console.log('');
        OsCommand.run(OsCommand.getCommand('flatpak', ['update', '-y'], false));
        console.log('');
    }

    if (hasNPM) {
        console.log('Updating NPM...'.blue);
        console.log('');
        OsCommand.run(OsCommand.getCommand('npm', ['update', '-g'], requiredSudo));
        console.log('');
    }

    if (hasSNAP && !noSnap) {
        console.log('Updating snap...'.blue);
        console.log('');
        OsCommand.run(OsCommand.getCommand('snap', ['refresh'], false));
        console.log('');
    }

    console.log('System updated!'.underline.green);
    console.log('');
}

export {doSystemUpdate}
