var A = Object.defineProperty;
var L = (e, o, n) => o in e ? A(e, o, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[o] = n;
var P = (e, o) => () => (o || e((o = { exports: {} }).exports, o), o.exports);
var i = (e, o, n) => (L(e, typeof o != "symbol" ? o + "" : o, n), n);
var D = P((f) => {
  const { execSync: k, spawnSync: q } = require("child_process"), I = require("os"), T = require("colors"), { Command: Y } = require("commander"), x = require("figlet");
  class m {
    constructor(o, n) {
      i(this, "cmd");
      i(this, "opts");
      this.cmd = o, this.opts = n;
    }
  }
  const r = (e, o, n, a) => {
    let s = n ? "sudo" : e;
    return n && (o = [e].concat(o)), new m(s, o);
  }, p = (e, o, n) => r("apt", n ? [e] : [e, "-y"], o), z = (e, o, n) => r("dnf", n ? [e] : [e, "-y"], o), R = (e, o, n) => r("yum", n ? [e] : [e, "-y"], o), K = (e, o, n) => r("pacman", n ? [e] : [e, "--noconfirm"], o), N = (e, o, n) => r("yaourt", n ? [e] : [e, "--noconfirm"], o), g = (e, o, n) => r("zypper", n ? [e] : ["--non-interactive", e], o), c = (e) => {
    try {
      return k("command -v " + e).toString() !== "";
    } catch {
      return !1;
    }
  }, l = (e, o) => {
    q(e, o, { stdio: "inherit" });
  }, u = new Y();
  u.name("LKT System Update").description("CLI to update Linux distros").version("1.0.0");
  u.option("-ns, --nosnap", "prevent snap packages update");
  u.option("-i, --interactive", "enables interaction");
  u.parse();
  const d = u.opts();
  d.first;
  const O = () => {
    const e = d.nosnap === !0, o = d.interactive === !0;
    T.enable();
    const s = I.userInfo().uid !== 0, y = c("apt-get"), h = c("dnf"), C = c("yum"), S = c("pacman"), U = c("yaourt"), b = c("flatpak"), v = c("snap"), w = c("zypper");
    console.log(""), console.log(
      x.textSync("LKT System Update", {
        font: "Small",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: !0
      }).green
    ), console.log(""), s ? (console.log("[!]".red + " Running as regular user".yellow), console.log("")) : (console.log("[!]".red + " Running as root/sudo user".underline.yellow), console.log(""));
    let t = new m("", []);
    y && (console.log("Updating apt...".blue), console.log(""), t = p("update", s, o), l(t.cmd, t.opts), t = p("upgrade", s, o), l(t.cmd, t.opts), console.log(""), console.log("Cleaning apt...".blue), console.log(""), t = p("autoremove", s, o), l(t.cmd, t.opts), t = p("clean", s, o), l(t.cmd, t.opts), t = p("autoclean", s, o), l(t.cmd, t.opts), console.log("")), h ? (console.log("Updating dnf...".blue), console.log(""), t = z("update", s, o), l(t.cmd, t.opts), console.log("")) : C && (console.log("Updating yum...".blue), console.log(""), t = R("update", s, o), l(t.cmd, t.opts), console.log("")), S && (console.log("Updating pacman...".blue), console.log(""), t = K("-Syu", s, o), l(t.cmd, t.opts), console.log("")), U && (console.log("Updating yaourt...".blue), console.log(""), t = N("-Syu", s, o), l(t.cmd, t.opts), console.log("")), w && (console.log("Updating zypper...".blue), console.log(""), t = g("refresh", s, o), l(t.cmd, t.opts), t = g("up", s, o), l(t.cmd, t.opts), console.log("")), b && (console.log("Updating flatpak...".blue), console.log(""), l("flatpak", ["update", "-y"]), console.log("")), v && !e && (console.log("Updating snap...".blue), console.log(""), l("snap", ["refresh"]), console.log("")), console.log("System updated!".underline.green), console.log("");
  };
  f.doSystemUpdate = O;
});
export default D();
