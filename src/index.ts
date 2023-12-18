const {execSync, spawnSync} = require('child_process');
const os = require('os');
const colors = require('colors');
const { Command } = require('commander');
const figlet = require("figlet");

class OsCommand {
    cmd: string;
    opts: string[];

    constructor(cmd: string, opts: string[]) {
        this.cmd = cmd;
        this.opts = opts;
    }
}

const getOsCommand = (command: string, opts: string[], requiresSudo: boolean, isInteractive: boolean) => {
    let cmd = requiresSudo ? 'sudo' : command;
    if (requiresSudo) opts = [command].concat(opts);
    return new OsCommand(cmd, opts);
}

const getAptCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : [command, '-y'];
    return getOsCommand('apt', opts, requiresSudo, isInteractive);
}

const getDnfCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : [command, '-y'];
    return getOsCommand('dnf', opts, requiresSudo, isInteractive);
}

const getYumCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : [command, '-y'];
    return getOsCommand('yum', opts, requiresSudo, isInteractive);
}

const getPacmanCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : [command, '--noconfirm'];
    return getOsCommand('pacman', opts, requiresSudo, isInteractive);
}

const getYaourtCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : [command, '--noconfirm'];
    return getOsCommand('yaourt', opts, requiresSudo, isInteractive);
}

const getZypperCommand = (command: string, requiresSudo: boolean, isInteractive: boolean) => {
    let opts = isInteractive ? [command] : ['--non-interactive', command];
    return getOsCommand('zypper', opts, requiresSudo, isInteractive);
}

const checkCommandExists = (cmd: string) => {
    try {
        const output = execSync('command -v ' + cmd);
        return output.toString() !== '';
    } catch (error) {
        return false;
    }
}

const runCommand = (cmd: string, args: string[]) => {
    spawnSync(cmd, args, { stdio: 'inherit'}); // will print as it's processing
}

// CLI options
const program = new Command();

program
    .name('LKT System Update')
    .description('CLI to update Linux distros')
    .version('1.0.0');

program.option('-ns, --nosnap', 'prevent snap packages update');
program.option('-i, --interactive', 'enables interaction');
program.parse();

const options = program.opts(),
    limit = options.first ? 1 : undefined;

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

    const hasAPT = checkCommandExists('apt-get');
    const hasDNF = checkCommandExists('dnf');
    const hasYUM = checkCommandExists('yum');
    const hasPACMAN = checkCommandExists('pacman');
    const hasYAOURT = checkCommandExists('yaourt');
    const hasFLATPAK = checkCommandExists('flatpak');
    const hasSNAP = checkCommandExists('snap');
    const hasZYPPER = checkCommandExists('zypper');

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
        runCommand(cmd.cmd, cmd.opts)

        cmd = getAptCommand('upgrade', requiredSudo, interactive);
        runCommand(cmd.cmd, cmd.opts)

        console.log('');
        console.log('Cleaning apt...'.blue);
        console.log('');

        cmd = getAptCommand('autoremove', requiredSudo, interactive);
        runCommand(cmd.cmd, cmd.opts)
        cmd = getAptCommand('clean', requiredSudo, interactive);
        runCommand(cmd.cmd, cmd.opts)
        cmd = getAptCommand('autoclean', requiredSudo, interactive);
        runCommand(cmd.cmd, cmd.opts)
        console.log('');
    }

    if (hasDNF) {
        console.log('Updating dnf...'.blue);
        console.log('');

        cmd = getDnfCommand('update', requiredSudo, interactive);
        runCommand(cmd.cmd, cmd.opts)
        console.log('');

    } else if (hasYUM) {
        console.log('Updating yum...'.blue);
        console.log('');

        cmd = getYumCommand('update', requiredSudo, interactive);
        runCommand(cmd.cmd, cmd.opts)
        console.log('');
    }

    if (hasPACMAN) {
        console.log('Updating pacman...'.blue);
        console.log('');

        cmd = getPacmanCommand('-Syu', requiredSudo, interactive);
        runCommand(cmd.cmd, cmd.opts)
        console.log('');
    }

    if (hasYAOURT) {
        console.log('Updating yaourt...'.blue);
        console.log('');

        cmd = getYaourtCommand('-Syu', requiredSudo, interactive);
        runCommand(cmd.cmd, cmd.opts)
        console.log('');
    }

    if (hasZYPPER) {
        console.log('Updating zypper...'.blue);
        console.log('');

        cmd = getZypperCommand('refresh', requiredSudo, interactive);
        runCommand(cmd.cmd, cmd.opts)

        cmd = getZypperCommand('up', requiredSudo, interactive);
        runCommand(cmd.cmd, cmd.opts)
        console.log('');
    }

    if (hasFLATPAK) {
        console.log('Updating flatpak...'.blue);
        console.log('');
        runCommand('flatpak', ['update', '-y'])
        console.log('');
    }

    if (hasSNAP && !noSnap) {
        console.log('Updating snap...'.blue);
        console.log('');
        runCommand('snap', ['refresh'])
        console.log('');
    }

    console.log('System updated!'.underline.green);
    console.log('');
}

exports.doSystemUpdate = doSystemUpdate;
