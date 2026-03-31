export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border px-4 py-3 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
        <span>
          pgfavor - Built for the{" "}
          <a
            href="https://projectgorgon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover"
          >
            Project Gorgon
          </a>{" "}
          community
        </span>
        <span>
          Game data &copy; Elder Game, LLC. This tool is not affiliated with Elder Game.
        </span>
      </div>
    </footer>
  );
}
