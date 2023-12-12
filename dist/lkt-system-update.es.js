const { execSync: f, spawnSync: i } = require("child_process"), y = require("os"), g = y.userInfo(), c = g.uid, a = (e) => {
  try {
    return f("command -v " + e).toString() !== "";
  } catch {
    return !1;
  }
}, t = (e, u) => {
  i(e, u, { stdio: "inherit" });
}, s = a("apt-get"), o = a("dnf"), n = a("yum"), p = a("pacman"), d = a("yaourt"), m = a("flatpak"), h = a("snap"), r = a("zypper");
console.log("uid", c);
c === 0 ? (s && (t("apt-get", ["update"]), t("apt-get", ["upgrade", "-y"]), t("apt-get", ["autoremove"]), t("apt-get", ["clean"]), t("apt-get", ["autoclean"])), o ? (t("dnf", ["update"]), t("dnf", ["upgrade"])) : n && (t("yum", ["update"]), t("yum", ["upgrade"])), p && t("pacman", ["-Syu"]), d && t("yaourt", ["-Syu"]), r && t("zypper", ["up"])) : (s && (t("sudo", ["apt-get", "update"]), t("sudo", ["apt-get", "upgrade", "-y"]), t("sudo", ["apt-get", "autoremove"]), t("sudo", ["apt-get", "clean"]), t("sudo", ["apt-get", "autoclean"])), o ? (t("sudo", ["dnf", "update"]), t("sudo", ["dnf", "upgrade"])) : n && (t("sudo", ["yum", "update"]), t("sudo", ["yum", "upgrade"])), p && t("sudo", ["pacman", "-Syu"]), d && t("sudo", ["yaourt", "-Syu"]), r && t("sudo", ["zypper", "up"]));
m && t("flatpak", ["update", "-y"]);
h && t("snap", ["refresh"]);
