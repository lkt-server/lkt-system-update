//#!/usr/bin/env node
const {execSync, spawnSync} = require('child_process');

const os = require("os");

// invoke userInfo() method
const userInfo = os.userInfo();

// get uid property
// from the userInfo object
const uid = userInfo.uid;

const checkCommandExists = (cmd) => {
    try {
        const output = execSync("command -v " + cmd);
        return output.toString() !== '';
    } catch (error) {
        return false;
    }
}

const runCommand = (cmd, args) => {
    spawnSync(cmd, args, { stdio: 'inherit'}); // will print as it's processing
}

const hasAPT = checkCommandExists('apt-get');
const hasDNF = checkCommandExists('dnf');
const hasYUM = checkCommandExists('yum');
const hasPACMAN = checkCommandExists('pacman');
const hasYAOURT = checkCommandExists('yaourt');
const hasFLATPAK = checkCommandExists('flatpak');
const hasSNAP = checkCommandExists('snap');
const hasZYPPER = checkCommandExists('zypper');


console.log('uid', uid);
if (uid === 0) { // sudoer
    if (hasAPT) {
        runCommand('apt-get', ['update'])
        runCommand('apt-get', ['upgrade', '-y'])
        runCommand('apt-get', ['autoremove'])
        runCommand('apt-get', ['clean'])
        runCommand('apt-get', ['autoclean'])
    }

    if (hasDNF) {
        runCommand('dnf', ['update'])
        runCommand('dnf', ['upgrade'])

    } else if (hasYUM) {
        runCommand('yum', ['update'])
        runCommand('yum', ['upgrade'])
    }

    if (hasPACMAN) {
        runCommand('pacman', ['-Syu'])
    }

    if (hasYAOURT) {
        runCommand('yaourt', ['-Syu'])
    }

    if (hasZYPPER) {
        runCommand('zypper', ['up'])
    }

} else {

    if (hasAPT) {
        runCommand('sudo', ['apt-get', 'update'])
        runCommand('sudo', ['apt-get', 'upgrade', '-y'])
        runCommand('sudo', ['apt-get', 'autoremove'])
        runCommand('sudo', ['apt-get', 'clean'])
        runCommand('sudo', ['apt-get', 'autoclean'])
    }

    if (hasDNF) {
        runCommand('sudo', ['dnf', 'update'])
        runCommand('sudo', ['dnf', 'upgrade'])

    } else if (hasYUM) {
        runCommand('sudo', ['yum', 'update'])
        runCommand('sudo', ['yum', 'upgrade'])
    }

    if (hasPACMAN) {
        runCommand('sudo', ['pacman', '-Syu'])
    }

    if (hasYAOURT) {
        runCommand('sudo', ['yaourt', '-Syu'])
    }

    if (hasZYPPER) {
        runCommand('sudo', ['zypper', 'up'])
    }
}


if (hasFLATPAK) {
    runCommand('flatpak', ['update', '-y'])
}

if (hasSNAP) {
    runCommand('snap', ['refresh'])
}
