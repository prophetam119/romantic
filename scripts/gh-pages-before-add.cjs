const fs = require("fs");
const path = require("path");

/** Удаляет .gitignore из gh-pages-клона — иначе /photos/ не попадает в git add. */
module.exports = function ghPagesBeforeAdd(git) {
  const ignorePath = path.join(git.cwd, ".gitignore");

  if (fs.existsSync(ignorePath)) {
    fs.unlinkSync(ignorePath);
  }
};
