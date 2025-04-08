import {Command} from "commander";

const program = new Command();

program
    .name('LKT System Update')
    .description('CLI to update Linux distros')
    .version('1.0.0');

program.option('-ns, --nosnap', 'prevent snap packages update');
program.option('-i, --interactive', 'enables interaction');
program.parse();

export {program};
