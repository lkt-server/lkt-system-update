import os from 'os';
import colors from 'colors';
import figlet from "figlet";
import {program} from "./config/program-config";
import {OsCommand} from "lkt-server-kernel";

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

const getPamacCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : [command, '--noconfirm'];
    return OsCommand.getCommand('pamac', opts, requiresSudo);
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
    const noSnap = options.snap === false,
        noNpm = options.npm === false,
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
        hasPAMAC = OsCommand.existsInOs('pamac'),
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

    if (hasPAMAC) {
        console.log('Updating pamac...'.blue);
        console.log('');

        cmd = getPamacCommand('update', requiredSudo, interactive);
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

    if (hasNPM && !noNpm) {
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
