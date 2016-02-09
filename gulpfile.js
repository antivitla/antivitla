var gulp = require("gulp"),
	markdown = require("gulp-markdown");

// Markdown
gulp.task("md", function () {
	gulp.src("./**/*.src.md")
		.pipe(markdown())
		.pipe(gulp.dest("./"));
});

// Watch
gulp.task("watch", function () {
	gulp.watch("./**/*.src.md", ["md"]);
});